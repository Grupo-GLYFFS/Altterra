import { SimpleGrid } from '@mantine/core';
import { useMemo, useState } from 'react';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoTexto } from '../componentes/Campo.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { CardInstituicao } from '../componentes/fornecedor/CardInstituicao.jsx';
import { ModalDoar } from '../componentes/fornecedor/ModalDoar.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { Tabela } from '../componentes/Tabela.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useDoacoes } from '../contexto/useDoacoes.js';
import { useSessao } from '../contexto/useSessao.js';
import { INSTITUICOES } from '../dados/instituicoes.js';
import { formatarData, normalizarTexto } from '../logica/formatos.js';
import { caminhoImagem } from '../logica/imagens.js';
import estilos from './SafraQueAlimenta.module.css';

const CATEGORIAS_ACEITAS = ['Todas', 'Legumes', 'Verduras e folhas', 'Frutas', 'Tubérculos e raízes'];

const PASSOS_DOACAO = [
  {
    numero: '1',
    titulo: 'Escolha a instituição',
    texto: 'Veja o que ela aceita, o endereço e os horários de retirada.',
  },
  {
    numero: '2',
    titulo: 'Ofereça o excedente',
    texto: 'Informe o produto do seu estoque, a quantidade em quilos e como chega.',
  },
  {
    numero: '3',
    titulo: 'Retirada combinada',
    texto: 'A instituição recebe o aviso e confirma a retirada ou a entrega.',
  },
  {
    numero: '4',
    titulo: 'Doação registrada',
    texto: 'Entra no seu histórico e atualiza o selo Doador do seu perfil.',
  },
];

// Página Safra que Alimenta (V03): painel e fluxo de doação para fornecedores;
// apresentação do programa, passo a passo e instituições para visitantes e compradores.
export function SafraQueAlimenta() {
  const { usuario } = useSessao();
  const { produtos } = useAnuncios();
  const { doacoes, registrar, kgDoadosPor, totais } = useDoacoes();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [instituicaoDoar, setInstituicaoDoar] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const ehFornecedor = usuario?.perfil === 'fornecedor';
  const fornecedorId = usuario?.fornecedorId || usuario?.fornecedor?.id || '';

  const produtosDoFornecedor = useMemo(() => {
    if (!ehFornecedor) return [];
    const proprios = produtos.filter(
      (p) => (p.fornecedor?.id === fornecedorId || p.fornecedorId === fornecedorId) && p.estoque > 0
    );
    return proprios.length > 0 ? proprios : produtos.filter((p) => p.estoque > 0);
  }, [ehFornecedor, produtos, fornecedorId]);

  const minhasDoacoes = useMemo(
    () => (ehFornecedor ? doacoes.filter((d) => d.fornecedorId === fornecedorId) : []),
    [ehFornecedor, doacoes, fornecedorId]
  );

  const kgFornecedor = ehFornecedor ? kgDoadosPor(fornecedorId) : 0;
  const instituicoesAjudadas = new Set(minhasDoacoes.map((d) => d.instituicaoId)).size;
  const pendente = minhasDoacoes.find((d) => d.status === 'aguardando_retirada');
  const fornecedoresDoadores = new Set(doacoes.map((d) => d.fornecedorId)).size;

  const instituicoesFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca);
    return INSTITUICOES.filter((inst) => {
      if (categoria !== 'Todas' && !inst.aceita.includes(categoria)) return false;
      if (!termo) return true;
      return normalizarTexto(`${inst.nome} ${inst.cidade} ${inst.aceita.join(' ')}`).includes(termo);
    });
  }, [busca, categoria]);

  // Busca o nome de uma instituição pelo id.
  function nomeInstituicao(id) {
    return INSTITUICOES.find((i) => i.id === id)?.nome || 'Instituição parceira';
  }

  // Registra a nova doação no contexto e mostra confirmação na página.
  function lidarRegistrarDoacao(dados) {
    registrar({ ...dados, fornecedorId });
    setInstituicaoDoar(null);
    setMensagem(
      `Doação de ${dados.quantidade.toLocaleString('pt-BR')} kg de ${dados.produtoNome} registrada para ${nomeInstituicao(dados.instituicaoId)}.`
    );
  }

  const colunasDoacoes = [
    {
      id: 'data',
      titulo: 'Data',
      render: (d) => <span className={estilos.meta}>{formatarData(d.data)}</span>,
    },
    {
      id: 'produto',
      titulo: 'Produto',
      render: (d) => <strong className={estilos.negrito}>{d.produtoNome}</strong>,
    },
    {
      id: 'quantidade',
      titulo: 'Quantidade',
      render: (d) => (
        <span className={estilos.numero}>{d.quantidade.toLocaleString('pt-BR')} kg</span>
      ),
    },
    {
      id: 'instituicao',
      titulo: 'Instituição',
      render: (d) => <span>{nomeInstituicao(d.instituicaoId)}</span>,
    },
    {
      id: 'status',
      titulo: 'Situação',
      alinhar: 'direita',
      render: (d) => (
        <Selo variante={d.status === 'retirada' ? 'sucesso' : 'aviso'} tamanho="sm">
          {d.status === 'retirada' ? 'Retirada' : 'Aguardando retirada'}
        </Selo>
      ),
    },
  ];

  const blocoImpacto = (
    <section className={estilos.secao} aria-labelledby="titulo-impacto-safra">
      <div className={estilos.secaoTopo}>
        <h2 id="titulo-impacto-safra" className={estilos.tituloSecao}>
          Impacto do programa
        </h2>
        <p className={estilos.subtitulo}>Números acumulados das doações registradas no Altterra.</p>
      </div>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        <div className={estilos.bentoCard}>
          <img
            src={caminhoImagem('tomate-carmem-5.webp')}
            alt=""
            className={estilos.bentoFoto}
            aria-hidden="true"
          />
          <div className={estilos.bentoVeu} aria-hidden="true" />
          <div className={estilos.bentoConteudo}>
            <p className={estilos.bentoNumero}>{totais.kg.toLocaleString('pt-BR')} kg</p>
            <p className={estilos.bentoRotulo}>de alimentos doados</p>
            <p className={estilos.bentoMeta}>em {totais.doacoes} doações registradas</p>
          </div>
        </div>

        <div className={estilos.bentoCard}>
          <img
            src={caminhoImagem('alface-crespa.webp')}
            alt=""
            className={estilos.bentoFoto}
            aria-hidden="true"
          />
          <div className={estilos.bentoVeu} aria-hidden="true" />
          <div className={estilos.bentoConteudo}>
            <p className={estilos.bentoNumero}>{fornecedoresDoadores}</p>
            <p className={estilos.bentoRotulo}>fornecedores doaram</p>
            <p className={estilos.bentoMeta}>cooperativas e produtores da região</p>
          </div>
        </div>

        <div className={estilos.bentoCard}>
          <img
            src={caminhoImagem('tomate-carmem-4.webp')}
            alt=""
            className={estilos.bentoFoto}
            aria-hidden="true"
          />
          <div className={estilos.bentoVeu} aria-hidden="true" />
          <div className={estilos.bentoConteudo}>
            <p className={estilos.bentoNumero}>{totais.instituicoes}</p>
            <p className={estilos.bentoRotulo}>instituições participantes</p>
            <p className={estilos.bentoMeta}>bancos de alimentos, cozinhas e abrigos</p>
          </div>
        </div>
      </SimpleGrid>
    </section>
  );

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Safra que Alimenta</h1>
          <p className={estilos.descricao}>
            {ehFornecedor
              ? 'Doe o excedente da colheita para bancos de alimentos, cozinhas comunitárias e abrigos perto de você.'
              : 'Programa de doação do Altterra: fornecedores doam o excedente da colheita para bancos de alimentos, cozinhas comunitárias e abrigos verificados.'}
          </p>
        </header>

        {mensagem && <Aviso tipo="sucesso" titulo={mensagem} aoFechar={() => setMensagem('')} />}

        {ehFornecedor ? (
          <>
            {/* Painel de 3 números do fornecedor */}
            <section className={estilos.painel} aria-label="Resumo das suas doações">
              <div className={`${estilos.blocoNumero} ${estilos.blocoDestaque}`}>
                <span className={estilos.rotuloPainel}>Você doou</span>
                <strong className={estilos.valorPainel}>
                  {kgFornecedor.toLocaleString('pt-BR')} kg
                </strong>
              </div>
              <div className={estilos.blocoNumero}>
                <strong className={estilos.valorPainel}>{minhasDoacoes.length}</strong>
                <span className={estilos.rotuloPainel}>
                  {minhasDoacoes.length === 1 ? 'doação registrada' : 'doações registradas'}
                </span>
              </div>
              <div className={estilos.blocoNumero}>
                <strong className={estilos.valorPainel}>{instituicoesAjudadas}</strong>
                <span className={estilos.rotuloPainel}>
                  {instituicoesAjudadas === 1 ? 'instituição ajudada' : 'instituições ajudadas'}
                </span>
              </div>
            </section>

            {pendente && (
              <Aviso
                tipo="info"
                titulo={`${pendente.quantidade.toLocaleString('pt-BR')} kg de ${pendente.produtoNome} aguardando retirada`}
                descricao={`${nomeInstituicao(pendente.instituicaoId)} confirma a retirada pelo contato da sua conta.`}
              />
            )}

            {/* Instituições perto de você */}
            <section className={estilos.secao} aria-labelledby="titulo-instituicoes">
              <div className={estilos.secaoTopoLinha}>
                <h2 id="titulo-instituicoes" className={estilos.tituloSecao}>
                  Instituições perto de você
                </h2>
                <span className={estilos.meta}>{INSTITUICOES.length} instituições verificadas</span>
              </div>

              <div className={estilos.barraFiltros}>
                <div className={estilos.campoBusca}>
                  <CampoTexto
                    placeholder="Buscar instituição ou cidade"
                    aria-label="Buscar instituição ou cidade"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                <div className={estilos.chips} role="group" aria-label="Filtrar por alimento aceito">
                  {CATEGORIAS_ACEITAS.map((cat) => (
                    <Chip
                      key={cat}
                      comBorda
                      ativo={categoria === cat}
                      aoClicar={() => setCategoria(cat)}
                    >
                      {cat}
                    </Chip>
                  ))}
                </div>
              </div>

              {instituicoesFiltradas.length === 0 ? (
                <EstadoVazio
                  icone="search_off"
                  titulo="Nenhuma instituição encontrada"
                  descricao="Tente outro termo ou veja todas as instituições cadastradas."
                  textoAcao="Limpar filtros"
                  aoClicarAcao={() => {
                    setBusca('');
                    setCategoria('Todas');
                  }}
                />
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  {instituicoesFiltradas.map((inst) => (
                    <CardInstituicao
                      key={inst.id}
                      instituicao={inst}
                      mostrarBotaoDoar
                      aoDoar={setInstituicaoDoar}
                    />
                  ))}
                </SimpleGrid>
              )}
            </section>

            {/* Histórico de doações do fornecedor */}
            <section className={estilos.secao} aria-labelledby="titulo-minhas-doacoes">
              <div className={estilos.secaoTopo}>
                <h2 id="titulo-minhas-doacoes" className={estilos.tituloSecao}>
                  Minhas doações
                </h2>
                <p className={estilos.subtitulo}>
                  {kgFornecedor.toLocaleString('pt-BR')} kg registrados no programa.
                </p>
              </div>

              {minhasDoacoes.length === 0 ? (
                <EstadoVazio
                  icone="volunteer_activism"
                  titulo="Você ainda não registrou doações"
                  descricao="Escolha uma instituição acima para doar parte do seu estoque."
                />
              ) : (
                <Tabela
                  colunas={colunasDoacoes}
                  linhas={minhasDoacoes}
                  chave={(d) => d.id}
                  legenda="Histórico das suas doações"
                />
              )}
            </section>

            {blocoImpacto}

            <ModalDoar
              instituicao={instituicaoDoar}
              produtos={produtosDoFornecedor}
              aoFechar={() => setInstituicaoDoar(null)}
              aoRegistrar={lidarRegistrarDoacao}
            />
          </>
        ) : (
          <>
            <Aviso
              tipo="info"
              titulo="Só fornecedores doam pelo Safra que Alimenta"
              descricao="Cada doação sai do estoque anunciado no Altterra e vai para uma instituição verificada. Compradores e visitantes acompanham o programa por esta página."
            />

            {/* Quem participa */}
            <section className={estilos.secao} aria-label="Quem participa">
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                <article className={`${estilos.cardPerfil} ${estilos.cardPerfilDestaque}`}>
                  <Icone nome="agriculture" tamanho={24} className={estilos.iconePerfil} />
                  <h2 className={estilos.tituloCard}>Você produz ou distribui?</h2>
                  <p className={estilos.textoCard}>
                    Crie uma conta de fornecedor, anuncie e doe o que sobrar da colheita.
                  </p>
                  <div className={estilos.acaoCard}>
                    <Botao variante="principal" tamanho="sm" para="/entrar?cadastro=fornecedor">
                      Criar conta de fornecedor
                    </Botao>
                  </div>
                </article>

                <article className={estilos.cardPerfil}>
                  <Icone nome="storefront" tamanho={24} className={estilos.iconePerfil} />
                  <h2 className={estilos.tituloCard}>Você compra?</h2>
                  <p className={estilos.textoCard}>
                    Procure o selo de quem doa nos anúncios e na página do fornecedor.
                  </p>
                  <div className={estilos.acaoCard}>
                    <Selo variante="doador">Doador do Safra que Alimenta</Selo>
                  </div>
                </article>

                <article className={estilos.cardPerfil}>
                  <Icone nome="volunteer_activism" tamanho={24} className={estilos.iconePerfil} />
                  <h2 className={estilos.tituloCard}>Sua instituição recebe alimentos?</h2>
                  <p className={estilos.textoCard}>
                    Peça o cadastro pelo Fale Conosco, no assunto Cadastro de instituição.
                  </p>
                  <div className={estilos.acaoCard}>
                    <Botao variante="secundario" tamanho="sm" para="/como-funciona#fale-conosco">
                      Pedir cadastro
                    </Botao>
                  </div>
                </article>
              </SimpleGrid>
            </section>

            {/* Como a doação funciona */}
            <section className={estilos.secao} aria-labelledby="titulo-como-doacao">
              <h2 id="titulo-como-doacao" className={estilos.tituloSecao}>
                Como a doação funciona
              </h2>
              <ol className={estilos.passos}>
                {PASSOS_DOACAO.map((passo) => (
                  <li key={passo.numero} className={estilos.passo}>
                    <span className={estilos.passoNumero} aria-hidden="true">
                      {passo.numero}
                    </span>
                    <h3 className={estilos.passoTitulo}>{passo.titulo}</h3>
                    <p className={estilos.textoCard}>{passo.texto}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Algumas instituições participantes */}
            <section className={estilos.secao} aria-labelledby="titulo-inst-visitante">
              <div className={estilos.secaoTopoLinha}>
                <h2 id="titulo-inst-visitante" className={estilos.tituloSecao}>
                  Instituições participantes
                </h2>
                <span className={estilos.meta}>{INSTITUICOES.length} instituições verificadas</span>
              </div>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {INSTITUICOES.map((inst) => (
                  <CardInstituicao key={inst.id} instituicao={inst} />
                ))}
              </SimpleGrid>
            </section>

            {blocoImpacto}

            {/* Convite final para instituições */}
            <section className={estilos.faixaConvite} aria-labelledby="titulo-convite-inst">
              <div className={estilos.conviteEsquerda}>
                <span className={estilos.circuloConvite} aria-hidden="true">
                  <Icone nome="volunteer_activism" tamanho={24} />
                </span>
                <div>
                  <h2 id="titulo-convite-inst" className={estilos.tituloCard}>
                    Sua instituição recebe alimentos?
                  </h2>
                  <p className={estilos.textoCard}>
                    Bancos de alimentos, cozinhas comunitárias e abrigos podem pedir o cadastro pelo
                    Fale Conosco.
                  </p>
                </div>
              </div>
              <Botao
                variante="principal"
                tamanho="sm"
                iconeEsquerda="mail"
                para="/como-funciona#fale-conosco"
              >
                Pedir cadastro pelo Fale Conosco
              </Botao>
            </section>
          </>
        )}
      </div>
    </Pagina>
  );
}
