import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lerArmazenamento, removerArmazenamento, salvarArmazenamento } from '../armazenamento.js';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { EtapaEntrega } from '../componentes/cadastro/EtapaEntrega.jsx';
import { EtapaFotos } from '../componentes/cadastro/EtapaFotos.jsx';
import { EtapaPreco } from '../componentes/cadastro/EtapaPreco.jsx';
import { EtapaProduto } from '../componentes/cadastro/EtapaProduto.jsx';
import { EtapaRevisao } from '../componentes/cadastro/EtapaRevisao.jsx';
import { PreviaAnuncio } from '../componentes/cadastro/PreviaAnuncio.jsx';
import { TelaSucessoCadastro } from '../componentes/cadastro/TelaSucessoCadastro.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { IndicadorEtapas } from '../componentes/IndicadorEtapas.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { Gaveta, ModalBase } from '../componentes/Sobreposicoes.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useSessao } from '../contexto/useSessao.js';
import {
  CHAVE_RASCUNHO,
  ETAPAS_CADASTRO,
  criarEstadoInicial,
  mapearAlteracoes,
  montarProdutoDoFormulario,
  produtoParaFormulario,
  validarEtapa,
} from '../logica/cadastro/anuncio.js';
import estilos from './CadastroProduto.module.css';

// Formata a hora atual como "14:05" para o aviso de rascunho salvo.
function horaAtual() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Fluxo completo em 5 etapas para anunciar um produto novo ou editar um anúncio existente.
function FluxoCadastroProduto({ produtoOriginal = null, modoEdicao = false }) {
  const navegar = useNavigate();
  const { usuario } = useSessao();
  const { publicar, atualizar, alternarPausa, excluir } = useAnuncios();

  const estadoInicial = useMemo(() => {
    if (modoEdicao && produtoOriginal) {
      return produtoParaFormulario(produtoOriginal, usuario);
    }
    const rascunho = lerArmazenamento(CHAVE_RASCUNHO, null);
    const base = criarEstadoInicial(usuario);
    return rascunho ? { ...base, ...rascunho } : base;
  }, [modoEdicao, produtoOriginal, usuario]);

  const [dados, setDados] = useState(estadoInicial);
  const [indiceEtapa, setIndiceEtapa] = useState(0);
  const [concluidas, setConcluidas] = useState(() =>
    modoEdicao ? ETAPAS_CADASTRO.map((e) => e.id) : []
  );
  const [erros, setErros] = useState({});
  const [etapasComErro, setEtapasComErro] = useState([]);
  const [horaRascunho, setHoraRascunho] = useState('');
  const [avisoTopo, setAvisoTopo] = useState(null);
  const [previaAberta, setPreviaAberta] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [produtoSalvo, setProdutoSalvo] = useState(null);

  const etapaAtual = ETAPAS_CADASTRO[indiceEtapa];
  const proximaEtapa = ETAPAS_CADASTRO[indiceEtapa + 1] || null;
  const produtoPrevia = useMemo(
    () => montarProdutoDoFormulario(dados, usuario, produtoOriginal),
    [dados, usuario, produtoOriginal]
  );
  const alteracoes = useMemo(
    () => (modoEdicao ? mapearAlteracoes(dados, estadoInicial) : {}),
    [modoEdicao, dados, estadoInicial]
  );

  // Atualiza um campo do formulário e limpa o erro correspondente.
  function alterarCampo(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!atual[campo] && campo !== 'faixas') return atual;
      const proximo = { ...atual };
      delete proximo[campo];
      if (campo === 'faixas') delete proximo.faixasGeral;
      if (campo === 'entregaPropria' || campo === 'retiradaLocal') delete proximo.entrega;
      return proximo;
    });
  }

  // Salva o rascunho no localStorage pelo módulo de armazenamento único.
  function salvarRascunho() {
    if (modoEdicao) {
      salvarAnuncio();
      return;
    }
    salvarArmazenamento(CHAVE_RASCUNHO, dados);
    setHoraRascunho(horaAtual());
    setAvisoTopo({ tipo: 'sucesso', texto: 'Rascunho salvo neste navegador.' });
  }

  // Vai para uma etapa pelo id (usado no trilho e nos botões "Editar" da revisão).
  function irParaEtapa(idEtapa) {
    const destino = ETAPAS_CADASTRO.findIndex((e) => e.id === idEtapa);
    if (destino < 0) return;
    setIndiceEtapa(destino);
    setErros({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Valida a etapa atual e avança para a próxima.
  function avancarEtapa() {
    const errosEtapa = validarEtapa(etapaAtual.id, dados);
    if (Object.keys(errosEtapa).length > 0) {
      setErros(errosEtapa);
      setEtapasComErro((lista) =>
        lista.includes(etapaAtual.id) ? lista : [...lista, etapaAtual.id]
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErros({});
    setEtapasComErro((lista) => lista.filter((id) => id !== etapaAtual.id));
    setConcluidas((lista) => (lista.includes(etapaAtual.id) ? lista : [...lista, etapaAtual.id]));
    if (indiceEtapa < ETAPAS_CADASTRO.length - 1) {
      setIndiceEtapa((atual) => atual + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Volta para a etapa anterior.
  function voltarEtapa() {
    if (indiceEtapa > 0) {
      setIndiceEtapa((atual) => atual - 1);
      setErros({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Valida todas as etapas obrigatórias e publica ou atualiza o anúncio.
  function salvarAnuncio() {
    const obrigatorias = ['produto', 'preco', 'entrega'];
    for (const idEtapa of obrigatorias) {
      const errosEtapa = validarEtapa(idEtapa, dados);
      if (Object.keys(errosEtapa).length > 0) {
        const indice = ETAPAS_CADASTRO.findIndex((e) => e.id === idEtapa);
        setIndiceEtapa(indice);
        setErros(errosEtapa);
        setEtapasComErro((lista) => (lista.includes(idEtapa) ? lista : [...lista, idEtapa]));
        setAvisoTopo({
          tipo: 'erro',
          texto: 'Confira os campos marcados antes de concluir.',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    const pronto = montarProdutoDoFormulario(dados, usuario, produtoOriginal);

    if (modoEdicao && produtoOriginal) {
      atualizar(produtoOriginal.id, pronto);
      setProdutoSalvo({ ...pronto, id: produtoOriginal.id });
    } else {
      const criado = publicar(pronto);
      removerArmazenamento(CHAVE_RASCUNHO);
      setProdutoSalvo(criado);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reinicia o fluxo para anunciar outro produto após a publicação.
  function anunciarOutro() {
    const novo = criarEstadoInicial(usuario);
    setDados(novo);
    setIndiceEtapa(0);
    setConcluidas([]);
    setErros({});
    setEtapasComErro([]);
    setHoraRascunho('');
    setAvisoTopo(null);
    setProdutoSalvo(null);
  }

  // Restaura os valores originais do anúncio em edição.
  function descartarAlteracoes() {
    setDados(estadoInicial);
    setErros({});
    setEtapasComErro([]);
    setAvisoTopo({ tipo: 'info', texto: 'Alterações descartadas.' });
  }

  // Alterna pausa do anúncio em edição e informa na tela.
  function lidarComPausa() {
    if (!produtoOriginal) return;
    alternarPausa(produtoOriginal.id);
    const proximoStatus = produtoOriginal.status === 'ativo' ? 'pausado' : 'ativo';
    setAvisoTopo({
      tipo: 'sucesso',
      texto:
        proximoStatus === 'pausado'
          ? 'Anúncio pausado. Ele saiu da busca até você reativar.'
          : 'Anúncio reativado. Ele voltou a aparecer na busca.',
    });
  }

  // Confirma exclusão definitiva do anúncio e retorna para Meus anúncios.
  function confirmarExclusao() {
    if (!produtoOriginal) return;
    excluir(produtoOriginal.id);
    setModalExcluir(false);
    navegar('/anuncios');
  }

  const etapasIndicador = ETAPAS_CADASTRO.map((etapa, indice) => {
    let status = 'pendente';
    if (indice === indiceEtapa) {
      status = 'atual';
    } else if (etapasComErro.includes(etapa.id)) {
      status = 'erro';
    } else if (modoEdicao || concluidas.includes(etapa.id) || indice < indiceEtapa) {
      status = 'concluida';
    }
    return { ...etapa, status };
  });

  if (produtoSalvo) {
    return (
      <Pagina>
        <div className={estilos.pagina}>
          <header className={estilos.topo}>
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="arrow_back"
              aria-label="Voltar para Meus anúncios"
              para="/anuncios"
            />
            <h1 className={estilos.tituloPagina}>
              {modoEdicao ? 'Alterações salvas' : 'Anúncio publicado'}
            </h1>
            <span className={estilos.espacadorTopo} aria-hidden="true" />
          </header>

          <TelaSucessoCadastro
            produto={produtoSalvo}
            modoEdicao={modoEdicao}
            aoNovoCadastro={anunciarOutro}
          />
        </div>
      </Pagina>
    );
  }

  const ehUltima = indiceEtapa === ETAPAS_CADASTRO.length - 1;
  const tituloTopo = modoEdicao
    ? `Editar anúncio · ${produtoOriginal?.nome || dados.nome}`
    : 'Anunciar produto';

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <header className={estilos.topo}>
          <Botao
            variante="icone"
            tamanho="sm"
            iconeEsquerda="arrow_back"
            aria-label="Voltar"
            onClick={() => navegar('/anuncios')}
          />
          <h1 className={estilos.tituloPagina}>{tituloTopo}</h1>
          <div className={estilos.metaTopo}>
            {modoEdicao ? (
              <span className={estilos.statusTopo}>
                <Icone
                  nome={produtoOriginal?.status === 'pausado' ? 'pause_circle' : 'check_circle'}
                  tamanho={16}
                />
                <span>{produtoOriginal?.status === 'pausado' ? 'Pausado' : 'No ar'}</span>
              </span>
            ) : (
              <span className={estilos.statusTopo}>
                <Icone nome="cloud_done" tamanho={16} />
                <span>
                  {horaRascunho ? `Rascunho salvo às ${horaRascunho}` : 'Rascunho local'}
                </span>
              </span>
            )}
            <Botao
              variante="terciario"
              tamanho="sm"
              className={estilos.botaoSalvarCelular}
              onClick={salvarRascunho}
            >
              Salvar
            </Botao>
          </div>
        </header>

        <IndicadorEtapas etapas={etapasIndicador} aoSelecionar={irParaEtapa} />

        <div className={estilos.cabecalhoEtapa}>
          <h2 className={estilos.tituloEtapa}>{etapaAtual.tituloPagina}</h2>
          <p className={estilos.subtituloEtapa}>
            Etapa {indiceEtapa + 1} de {ETAPAS_CADASTRO.length}
          </p>
        </div>

        {modoEdicao && (
          <Aviso
            tipo="info"
            descricao="As mudanças valem para os próximos pedidos. Pedidos já confirmados seguem com o preço e o prazo de quando foram feitos."
          />
        )}

        {avisoTopo && (
          <Aviso
            tipo={avisoTopo.tipo}
            descricao={avisoTopo.texto}
            aoFechar={() => setAvisoTopo(null)}
          />
        )}

        <button
          type="button"
          className={estilos.gatilhoPrevia}
          onClick={() => setPreviaAberta(true)}
        >
          <span className={estilos.gatilhoPreviaEsquerda}>
            <Icone nome="visibility" tamanho={20} />
            <span>Como o comprador vai ver</span>
          </span>
          <Icone nome="expand_less" tamanho={20} />
        </button>

        <div className={estilos.grade}>
          <div className={estilos.colunaFormulario}>
            {etapaAtual.id === 'produto' && (
              <EtapaProduto dados={dados} erros={erros} aoAlterar={alterarCampo} />
            )}
            {etapaAtual.id === 'preco' && (
              <EtapaPreco dados={dados} erros={erros} aoAlterar={alterarCampo} />
            )}
            {etapaAtual.id === 'fotos' && (
              <EtapaFotos
                fotos={dados.fotos}
                aoAlterarFotos={(fotos) => alterarCampo('fotos', fotos)}
              />
            )}
            {etapaAtual.id === 'entrega' && (
              <EtapaEntrega
                dados={dados}
                erros={erros}
                enderecos={usuario?.enderecos || []}
                aoAlterar={alterarCampo}
              />
            )}
            {etapaAtual.id === 'revisao' && (
              <EtapaRevisao
                dados={dados}
                enderecos={usuario?.enderecos || []}
                modoEdicao={modoEdicao}
                alteracoes={alteracoes}
                statusAtual={produtoOriginal?.status || 'ativo'}
                aoIrParaEtapa={irParaEtapa}
                aoAlternarPausa={lidarComPausa}
                aoSolicitarExclusao={() => setModalExcluir(true)}
              />
            )}

            <div className={estilos.navegacaoComputador}>
              <div>
                {indiceEtapa > 0 && (
                  <Botao
                    variante="terciario"
                    tamanho="md"
                    iconeEsquerda="arrow_back"
                    onClick={voltarEtapa}
                  >
                    Voltar
                  </Botao>
                )}
              </div>

              <div className={estilos.acoesDireita}>
                {modoEdicao ? (
                  ehUltima ? (
                    <>
                      <Botao variante="secundario" tamanho="md" onClick={descartarAlteracoes}>
                        Descartar alterações
                      </Botao>
                      <Botao variante="principal" tamanho="lg" onClick={salvarAnuncio}>
                        Salvar alterações
                      </Botao>
                    </>
                  ) : (
                    <>
                      <Botao variante="secundario" tamanho="md" onClick={salvarAnuncio}>
                        Salvar alterações
                      </Botao>
                      <Botao
                        variante="principal"
                        tamanho="md"
                        iconeDireita="arrow_forward"
                        onClick={avancarEtapa}
                      >
                        Continuar para {proximaEtapa?.titulo}
                      </Botao>
                    </>
                  )
                ) : ehUltima ? (
                  <>
                    <Botao variante="secundario" tamanho="md" onClick={salvarRascunho}>
                      Salvar rascunho
                    </Botao>
                    <Botao variante="principal" tamanho="lg" onClick={salvarAnuncio}>
                      Publicar produto
                    </Botao>
                  </>
                ) : (
                  <>
                    <Botao variante="secundario" tamanho="md" onClick={salvarRascunho}>
                      Salvar rascunho
                    </Botao>
                    <Botao
                      variante="principal"
                      tamanho="md"
                      iconeDireita="arrow_forward"
                      onClick={avancarEtapa}
                    >
                      Continuar para {proximaEtapa?.titulo}
                    </Botao>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={estilos.colunaPrevia}>
            <PreviaAnuncio produto={produtoPrevia} modoEdicao={modoEdicao} />
          </div>
        </div>

        <div className={estilos.barraCelular}>
          {indiceEtapa > 0 && (
            <Botao
              variante="icone"
              tamanho="md"
              iconeEsquerda="arrow_back"
              aria-label="Voltar para a etapa anterior"
              onClick={voltarEtapa}
            />
          )}
          <Botao
            variante="principal"
            tamanho="md"
            larguraTotal
            onClick={ehUltima ? salvarAnuncio : avancarEtapa}
          >
            {ehUltima ? (modoEdicao ? 'Salvar alterações' : 'Publicar produto') : 'Continuar'}
          </Botao>
        </div>

        <Gaveta
          aberto={previaAberta}
          aoFechar={() => setPreviaAberta(false)}
          titulo="Como o comprador vai ver"
        >
          <PreviaAnuncio produto={produtoPrevia} modoEdicao={modoEdicao} semMoldura />
        </Gaveta>

        <ModalBase
          aberto={modalExcluir}
          aoFechar={() => setModalExcluir(false)}
          titulo="Excluir anúncio?"
          comFaixas
          rodape={
            <div className={estilos.acoesModal}>
              <Botao variante="secundario" tamanho="sm" onClick={() => setModalExcluir(false)}>
                Cancelar
              </Botao>
              <Botao variante="perigo" tamanho="sm" onClick={confirmarExclusao}>
                Excluir anúncio
              </Botao>
            </div>
          }
        >
          <p className={estilos.textoModal}>
            O anúncio <strong>{produtoOriginal?.nome}</strong> e as fotos serão apagados. O
            histórico de pedidos recebidos continua salvo.
          </p>
        </ModalBase>
      </div>
    </Pagina>
  );
}

// Resolve modo criação (/anunciar) ou edição (/anunciar/:id) e verifica se o anúncio existe.
function ConteudoCadastroProduto() {
  const { id } = useParams();
  const { buscarProduto } = useAnuncios();
  const modoEdicao = Boolean(id);
  const produtoOriginal = id ? buscarProduto(id) : null;

  if (modoEdicao && !produtoOriginal) {
    return (
      <Pagina titulo="Editar anúncio">
        <EstadoVazio
          icone="inventory_2"
          titulo="Anúncio não encontrado"
          descricao="Este anúncio pode ter sido excluído ou o endereço está incorreto."
          textoAcao="Voltar para Meus anúncios"
          paraAcao="/anuncios"
        />
      </Pagina>
    );
  }

  return (
    <FluxoCadastroProduto
      key={id || 'novo'}
      produtoOriginal={produtoOriginal}
      modoEdicao={modoEdicao}
    />
  );
}

// Página de cadastro e edição de anúncio, restrita ao perfil de fornecedor.
export function CadastroProduto() {
  const { id } = useParams();
  return (
    <RotaProtegida perfil="fornecedor" titulo={id ? 'Editar anúncio' : 'Anunciar produto'}>
      <ConteudoCadastroProduto />
    </RotaProtegida>
  );
}
