import { Botao } from '../Botao.jsx';
import { Selo } from '../Selo.jsx';
import { formatarData, formatarDataCurta, formatarReais } from '../../logica/formatos.js';
import { STATUS_PEDIDO } from '../../logica/pedidos.js';
import estilos from './CardPedido.module.css';

// Monta a linha de apoio de acordo com o status do pedido.
function textoComplementar(pedido) {
  if (pedido.status === 'aguardando_pagamento') {
    const meio = pedido.pagamento === 'boleto' ? 'boleto' : 'Pix';
    return `Aguardando pagamento via ${meio}`;
  }
  if (pedido.status === 'em_separacao' || pedido.status === 'a_caminho') {
    return `Previsão de entrega: ${formatarDataCurta(pedido.previsaoEntrega)}`;
  }
  if (pedido.status === 'entregue') {
    return `Entregue em ${formatarDataCurta(pedido.previsaoEntrega || pedido.criadoEm)}`;
  }
  return 'Pedido cancelado';
}

// Card de um pedido na lista de Meus pedidos (foto, status, resumo, total e ações).
export function CardPedido({ pedido, fornecedor, aoAbrir, aoComprarDeNovo }) {
  const info = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.aguardando_pagamento;
  const primeiro = pedido.itens[0];
  const extras = pedido.itens.length - 1;
  const nomes = pedido.itens.map((item) => item.nome).join(', ');
  const pesoTotal = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <article className={estilos.card}>
      <div className={estilos.fotoCaixa}>
        {primeiro?.imagem ? (
          <img src={primeiro.imagem} alt="" className={estilos.foto} />
        ) : (
          <span className={estilos.foto} aria-hidden="true" />
        )}
        {extras > 0 && (
          <span className={estilos.badgeExtras} aria-label={`Mais ${extras} itens`}>
            +{extras}
          </span>
        )}
      </div>

      <div className={estilos.meio}>
        <Selo variante={info.variante} tamanho="sm">
          {info.rotulo}
        </Selo>
        <h2 className={estilos.nome}>{nomes}</h2>
        <p className={estilos.meta}>
          {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} ·{' '}
          {pesoTotal.toLocaleString('pt-BR')} {primeiro?.unidade || 'kg'}
          {fornecedor ? ` · ${fornecedor.nome}` : ''}
        </p>
        <p className={estilos.meta}>
          Pedido {pedido.id} · {formatarData(pedido.criadoEm)}
        </p>
        <p className={estilos.apoio}>{textoComplementar(pedido)}</p>
      </div>

      <div className={estilos.direita}>
        <strong className={estilos.valor}>{formatarReais(pedido.total)}</strong>
        <div className={estilos.acoes}>
          {pedido.status === 'aguardando_pagamento' ? (
            <>
              <Botao variante="terciario" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
                Ver pedido
              </Botao>
              <Botao variante="principal" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
                Pagar pedido
              </Botao>
            </>
          ) : pedido.status === 'a_caminho' ? (
            <>
              <Botao variante="terciario" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
                Ver pedido
              </Botao>
              <Botao variante="secundario" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
                Acompanhar entrega
              </Botao>
            </>
          ) : pedido.status === 'entregue' ? (
            <>
              <Botao variante="terciario" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
                Ver pedido
              </Botao>
              <Botao variante="secundario" tamanho="sm" onClick={() => aoComprarDeNovo(pedido)}>
                Comprar de novo
              </Botao>
            </>
          ) : (
            <Botao variante="secundario" tamanho="sm" onClick={() => aoAbrir(pedido.id)}>
              Ver pedido
            </Botao>
          )}
        </div>
      </div>
    </article>
  );
}
