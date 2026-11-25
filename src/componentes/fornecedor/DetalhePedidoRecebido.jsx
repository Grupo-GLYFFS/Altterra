import { Avatar } from '../Avatar.jsx';
import { Botao } from '../Botao.jsx';
import { Divisor } from '../Divisor.jsx';
import { Icone } from '../Icone.jsx';
import { ImagemSegura } from '../ImagemSegura.jsx';
import { LinhaDoTempo } from '../LinhaDoTempo.jsx';
import { Selo } from '../Selo.jsx';
import { formatarData, formatarReais } from '../../logica/formatos.js';
import { STATUS_PEDIDO, montarEtapasPedido } from '../../logica/pedidos.js';
import estilos from './DetalhePedidoRecebido.module.css';

// Detalhe de um pedido recebido em 2 colunas: andamento e itens à esquerda;
// ações do fornecedor, comprador, entrega e pagamento à direita.
export function DetalhePedidoRecebido({
  pedido,
  aoVoltar,
  aoConfirmarPagamento,
  aoAvancarStatus,
  aoPedirRecusa,
}) {
  const infoStatus = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.aguardando_pagamento;
  const totalUnidades = pedido.itens.reduce((acc, item) => acc + item.quantidade, 0);
  const podeRecusar = pedido.status === 'aguardando_pagamento' || pedido.status === 'em_separacao';

  // Monta a ação principal de acordo com a etapa atual do pedido.
  function renderizarAcaoPrincipal() {
    if (pedido.status === 'aguardando_pagamento') {
      return (
        <Botao
          variante="principal"
          tamanho="md"
          larguraTotal
          iconeEsquerda="check"
          onClick={() => aoConfirmarPagamento(pedido)}
        >
          Confirmar pagamento
        </Botao>
      );
    }
    if (pedido.status === 'em_separacao') {
      return (
        <Botao
          variante="principal"
          tamanho="md"
          larguraTotal
          iconeEsquerda="local_shipping"
          onClick={() => aoAvancarStatus(pedido)}
        >
          Marcar como enviado
        </Botao>
      );
    }
    if (pedido.status === 'a_caminho') {
      return (
        <Botao
          variante="principal"
          tamanho="md"
          larguraTotal
          iconeEsquerda="check_circle"
          onClick={() => aoAvancarStatus(pedido)}
        >
          Marcar como entregue
        </Botao>
      );
    }
    return null;
  }

  const acaoPrincipal = renderizarAcaoPrincipal();

  return (
    <div className={estilos.pagina}>
      <div>
        <Botao variante="terciario" tamanho="sm" iconeEsquerda="arrow_back" onClick={aoVoltar}>
          Voltar para pedidos recebidos
        </Botao>
      </div>

      <header className={estilos.cabecalho}>
        <div className={estilos.tituloLinha}>
          <h1 className={estilos.titulo}>Pedido {pedido.id}</h1>
          <Selo variante={infoStatus.variante}>{infoStatus.rotulo}</Selo>
        </div>
        <p className={estilos.meta}>
          Recebido em {formatarData(pedido.criadoEm)} · {pedido.compradorEmpresa} ·{' '}
          {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} ·{' '}
          {totalUnidades.toLocaleString('pt-BR')} {pedido.itens[0]?.unidade || 'kg'}
        </p>
      </header>

      <div className={estilos.grade}>
        <div className={estilos.principal}>
          <section className={estilos.card} aria-labelledby="titulo-andamento-rec">
            <div className={estilos.cardTopo}>
              <h2 id="titulo-andamento-rec" className={estilos.cardTitulo}>
                Andamento
              </h2>
              {pedido.status !== 'cancelado' && (
                <span className={estilos.meta}>
                  Previsão: {formatarData(pedido.previsaoEntrega)}
                </span>
              )}
            </div>
            <LinhaDoTempo etapas={montarEtapasPedido(pedido)} />
          </section>

          <section className={estilos.card} aria-labelledby="titulo-itens-rec">
            <div className={estilos.cardTopo}>
              <h2 id="titulo-itens-rec" className={estilos.cardTitulo}>
                Itens
              </h2>
              <span className={estilos.meta}>
                {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} ·{' '}
                {totalUnidades.toLocaleString('pt-BR')} {pedido.itens[0]?.unidade || 'kg'}
              </span>
            </div>

            <ul className={estilos.listaItens}>
              {pedido.itens.map((item) => (
                <li key={item.produtoId} className={estilos.itemLinha}>
                  <div className={estilos.miniatura}>
                    <ImagemSegura
                      src={item.imagem}
                      alt=""
                      className={estilos.imagem}
                      fallback={<Icone nome="image" tamanho={20} />}
                    />
                  </div>
                  <div className={estilos.itemTextos}>
                    <p className={estilos.itemNome}>{item.nome}</p>
                    <p className={estilos.meta}>
                      {item.quantidade.toLocaleString('pt-BR')} {item.unidade} ×{' '}
                      {formatarReais(item.precoUnit)}/{item.unidade}
                    </p>
                  </div>
                  <strong className={estilos.valor}>{formatarReais(item.subtotal)}</strong>
                </li>
              ))}
            </ul>

            <Divisor />

            <div className={estilos.totais}>
              <div className={estilos.linhaTotal}>
                <span>Produtos</span>
                <span className={estilos.valor}>{formatarReais(pedido.subtotal)}</span>
              </div>
              <div className={estilos.linhaTotal}>
                <span>Frete pago pelo comprador</span>
                <span className={estilos.valor}>
                  {pedido.frete === 0 ? 'Retirada' : formatarReais(pedido.frete)}
                </span>
              </div>
              <div className={`${estilos.linhaTotal} ${estilos.totalDestaque}`}>
                <span>Total do pedido</span>
                <span className={estilos.valor}>{formatarReais(pedido.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className={estilos.lateral} aria-label="Ações e dados do comprador">
          {(acaoPrincipal || podeRecusar) && (
            <section className={estilos.card}>
              <div className={estilos.acoes}>
                {acaoPrincipal}
                {podeRecusar && (
                  <Botao
                    variante="secundario"
                    tamanho="md"
                    larguraTotal
                    onClick={() => aoPedirRecusa(pedido)}
                  >
                    Recusar pedido
                  </Botao>
                )}
              </div>
            </section>
          )}

          <section className={estilos.card}>
            <div className={estilos.blocoInfo}>
              <h2 className={estilos.rotuloSecao}>Comprador</h2>
              <div className={estilos.comprador}>
                <Avatar nome={pedido.compradorEmpresa} tamanho={44} />
                <div>
                  <p className={estilos.negrito}>{pedido.compradorEmpresa}</p>
                  <p className={estilos.meta}>{pedido.compradorNome}</p>
                </div>
              </div>
            </div>

            <Divisor />

            <div className={estilos.blocoInfo}>
              <h2 className={estilos.rotuloSecao}>Entrega</h2>
              <p className={estilos.linhaIcone}>
                <Icone
                  nome={pedido.modoEntrega === 'retirada' ? 'storefront' : 'location_on'}
                  tamanho={20}
                />
                <span>
                  {pedido.modoEntrega === 'retirada'
                    ? 'Comprador retira na sua propriedade'
                    : `${pedido.endereco.rua}, ${pedido.endereco.numero} · ${pedido.endereco.bairro}, ${pedido.endereco.cidade} - ${pedido.endereco.uf}, CEP ${pedido.endereco.cep}`}
                </span>
              </p>
            </div>

            <Divisor />

            <div className={estilos.blocoInfo}>
              <h2 className={estilos.rotuloSecao}>Pagamento</h2>
              <p className={estilos.linhaIcone}>
                <Icone
                  nome={pedido.pagamento === 'boleto' ? 'receipt_long' : 'qr_code_2'}
                  tamanho={20}
                />
                <span>
                  {pedido.pagamento === 'boleto' ? 'Boleto bancário' : 'Pix'} ·{' '}
                  {formatarReais(pedido.total)}
                </span>
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
