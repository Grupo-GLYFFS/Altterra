import { CATEGORIAS } from '../../dados/categorias.js';
import { OPCOES_CULTIVO, normalizarFaixas } from '../../logica/cadastro/anuncio.js';
import { formatarReais, lerNumero } from '../../logica/formatos.js';
import { rotuloFaixa } from '../../logica/preco.js';
import { Botao } from '../Botao.jsx';
import { Divisor } from '../Divisor.jsx';
import { Selo } from '../Selo.jsx';
import estilos from './EtapaRevisao.module.css';

// Selo compacto que destaca um campo alterado durante a edição de um anúncio.
function SeloAlterado({ visivel }) {
  if (!visivel) return null;
  return (
    <Selo variante="aviso" tamanho="sm" icone="">
      Alterado
    </Selo>
  );
}

// Cartão de resumo de uma seção da revisão com botão "Editar" para voltar à etapa.
function SecaoRevisao({ titulo, etapa, aoIrParaEtapa, children }) {
  return (
    <section className={estilos.cartao}>
      <header className={estilos.cabecalho}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        <Botao
          variante="terciario"
          tamanho="sm"
          iconeEsquerda="edit"
          onClick={() => aoIrParaEtapa(etapa)}
        >
          Editar
        </Botao>
      </header>
      <div className={estilos.corpo}>{children}</div>
    </section>
  );
}

// Etapa 5 do cadastro: revisão completa antes de publicar ou salvar alterações.
// No modo edição, destaca campos alterados e exibe as ações de pausar ou excluir.
export function EtapaRevisao({
  dados,
  enderecos = [],
  modoEdicao = false,
  alteracoes = {},
  statusAtual = 'ativo',
  aoIrParaEtapa,
  aoAlternarPausa,
  aoSolicitarExclusao,
}) {
  const categoria = CATEGORIAS.find((c) => c.id === dados.categoriaId)?.nome || 'Não informada';
  const cultivo = OPCOES_CULTIVO.find((c) => c.valor === dados.modoCultivo)?.rotulo || 'Convencional';
  const unidade = dados.unidade || 'kg';
  const faixas = normalizarFaixas(dados.faixas);
  const produtoFaixas = { faixas, unidade };

  const enderecoSalvo = enderecos.find((e) => e.id === dados.enderecoId);
  const localSaida = enderecoSalvo
    ? `${enderecoSalvo.cidade} - ${enderecoSalvo.uf}, ${enderecoSalvo.cep}`
    : `${dados.cidade || 'Não informada'}${dados.uf ? ` - ${dados.uf}` : ''}${dados.cep ? `, ${dados.cep}` : ''}`;

  const pausado = statusAtual === 'pausado';

  return (
    <div className={estilos.pilha}>
      <SecaoRevisao titulo="Produto" etapa="produto" aoIrParaEtapa={aoIrParaEtapa}>
        <dl className={estilos.lista}>
          <div className={estilos.linha}>
            <dt>Nome</dt>
            <dd>
              <span>{dados.nome || '—'}</span>
              <SeloAlterado visivel={modoEdicao && alteracoes.nome} />
            </dd>
          </div>
          <div className={estilos.linha}>
            <dt>Categoria</dt>
            <dd>
              <span>{categoria}</span>
              <SeloAlterado visivel={modoEdicao && alteracoes.categoriaId} />
            </dd>
          </div>
          {dados.variedade && (
            <div className={estilos.linha}>
              <dt>Variedade</dt>
              <dd>
                <span>{dados.variedade}</span>
                <SeloAlterado visivel={modoEdicao && alteracoes.variedade} />
              </dd>
            </div>
          )}
          <div className={estilos.linha}>
            <dt>Cultivo</dt>
            <dd>
              <span>{cultivo}</span>
              <SeloAlterado visivel={modoEdicao && alteracoes.modoCultivo} />
            </dd>
          </div>
          {dados.descricao && (
            <div className={estilos.linha}>
              <dt>Descrição</dt>
              <dd>
                <span>{dados.descricao}</span>
                <SeloAlterado visivel={modoEdicao && alteracoes.descricao} />
              </dd>
            </div>
          )}
        </dl>
      </SecaoRevisao>

      <SecaoRevisao titulo="Preço e estoque" etapa="preco" aoIrParaEtapa={aoIrParaEtapa}>
        <dl className={estilos.lista}>
          {faixas.map((faixa, indice) => (
            <div key={`${faixa.minimo}-${indice}`} className={estilos.linha}>
              <dt>{rotuloFaixa(produtoFaixas, indice)}</dt>
              <dd>
                <strong className={estilos.numero}>
                  {formatarReais(faixa.preco)} /{unidade}
                </strong>
                <SeloAlterado visivel={modoEdicao && alteracoes.faixas?.[indice]} />
              </dd>
            </div>
          ))}
          <div className={estilos.linha}>
            <dt>Estoque</dt>
            <dd>
              <span className={estilos.numero}>
                {lerNumero(dados.estoque).toLocaleString('pt-BR')} {unidade}
              </span>
              <SeloAlterado visivel={modoEdicao && alteracoes.estoque} />
            </dd>
          </div>
          <div className={estilos.linha}>
            <dt>Pedido mínimo</dt>
            <dd>
              <span className={estilos.numero}>
                {lerNumero(dados.pedidoMinimo).toLocaleString('pt-BR')} {unidade}
              </span>
              <SeloAlterado visivel={modoEdicao && alteracoes.pedidoMinimo} />
            </dd>
          </div>
          <div className={estilos.linha}>
            <dt>Outlet</dt>
            <dd>
              <span>
                {dados.outlet ? `Sim (−${lerNumero(dados.descontoPercentual) || 20}%)` : 'Não'}
              </span>
              <SeloAlterado
                visivel={modoEdicao && (alteracoes.outlet || alteracoes.descontoPercentual)}
              />
            </dd>
          </div>
        </dl>
      </SecaoRevisao>

      <SecaoRevisao titulo="Fotos" etapa="fotos" aoIrParaEtapa={aoIrParaEtapa}>
        {dados.fotos.length > 0 ? (
          <div className={estilos.blocoFotos}>
            <div className={estilos.miniaturas}>
              {dados.fotos.map((src, indice) => (
                <img
                  key={`${indice}-${src.slice(0, 20)}`}
                  src={src}
                  alt={indice === 0 ? 'Capa do anúncio' : `Foto ${indice + 1}`}
                  className={`${estilos.miniatura} ${indice === 0 ? estilos.miniaturaCapa : ''}`}
                />
              ))}
            </div>
            <div className={estilos.legendaFotos}>
              <span>
                {dados.fotos.length} {dados.fotos.length === 1 ? 'foto' : 'fotos'}. A primeira é a
                capa.
              </span>
              <SeloAlterado visivel={modoEdicao && alteracoes.fotos} />
            </div>
          </div>
        ) : (
          <p className={estilos.textoVazio}>
            Nenhuma foto enviada. O card vai mostrar &ldquo;Foto em breve&rdquo;.
          </p>
        )}
      </SecaoRevisao>

      <SecaoRevisao titulo="Entrega" etapa="entrega" aoIrParaEtapa={aoIrParaEtapa}>
        <dl className={estilos.lista}>
          <div className={estilos.linha}>
            <dt>Sai de</dt>
            <dd>
              <span>{localSaida}</span>
              <SeloAlterado visivel={modoEdicao && (alteracoes.enderecoId || alteracoes.cep)} />
            </dd>
          </div>
          <div className={estilos.linha}>
            <dt>Entrega própria</dt>
            <dd>
              <span>
                {dados.entregaPropria
                  ? `Até ${lerNumero(dados.raioKm).toLocaleString('pt-BR')} km`
                  : 'Desativada'}
              </span>
              <SeloAlterado
                visivel={modoEdicao && (alteracoes.entregaPropria || alteracoes.raioKm)}
              />
            </dd>
          </div>
          {dados.entregaPropria && (
            <div className={estilos.linha}>
              <dt>Prazo</dt>
              <dd>
                <span>{dados.prazoDias} dias úteis</span>
                <SeloAlterado visivel={modoEdicao && alteracoes.prazoDias} />
              </dd>
            </div>
          )}
          <div className={estilos.linha}>
            <dt>Retirada no local</dt>
            <dd>
              <span>{dados.retiradaLocal ? dados.horarioRetirada : 'Desativada'}</span>
              <SeloAlterado
                visivel={modoEdicao && (alteracoes.retiradaLocal || alteracoes.horarioRetirada)}
              />
            </dd>
          </div>
        </dl>
      </SecaoRevisao>

      {modoEdicao && (
        <section className={estilos.cartao}>
          <h3 className={estilos.titulo}>Pausar ou excluir</h3>

          <div className={estilos.acaoGerenciar}>
            <div className={estilos.acaoTextos}>
              <p className={estilos.acaoTitulo}>
                {pausado ? 'Reativar anúncio' : 'Pausar anúncio'}
              </p>
              <p className={estilos.acaoDescricao}>
                {pausado
                  ? 'Volta a aparecer na busca e nos carrosséis para novos pedidos.'
                  : 'Some da busca até você reativar. Pedidos em andamento continuam.'}
              </p>
            </div>
            <Botao
              variante="secundario"
              tamanho="sm"
              iconeEsquerda={pausado ? 'play_arrow' : 'pause'}
              onClick={aoAlternarPausa}
            >
              {pausado ? 'Reativar' : 'Pausar'}
            </Botao>
          </div>

          <Divisor />

          <div className={estilos.acaoGerenciar}>
            <div className={estilos.acaoTextos}>
              <p className={estilos.acaoTitulo}>Excluir anúncio</p>
              <p className={estilos.acaoDescricao}>
                Apaga o anúncio e as fotos. Não dá para desfazer; o histórico de pedidos continua em
                Pedidos recebidos.
              </p>
            </div>
            <Botao
              variante="perigo"
              tamanho="sm"
              iconeEsquerda="delete"
              onClick={aoSolicitarExclusao}
            >
              Excluir
            </Botao>
          </div>
        </section>
      )}
    </div>
  );
}
