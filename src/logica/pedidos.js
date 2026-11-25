// Estados do pedido e regras da linha do tempo.

export const STATUS_PEDIDO = {
  aguardando_pagamento: { rotulo: 'Aguardando pagamento', variante: 'aviso', aba: 'andamento' },
  em_separacao: { rotulo: 'Em separação', variante: 'info', aba: 'andamento' },
  a_caminho: { rotulo: 'A caminho', variante: 'info', aba: 'andamento' },
  entregue: { rotulo: 'Entregue', variante: 'sucesso', aba: 'entregues' },
  cancelado: { rotulo: 'Cancelado', variante: 'erro', aba: 'cancelados' },
};

const ETAPAS = [
  { id: 'feito', rotulo: 'Pedido feito' },
  { id: 'pagamento', rotulo: 'Pagamento' },
  { id: 'separacao', rotulo: 'Em separação' },
  { id: 'caminho', rotulo: 'A caminho' },
  { id: 'entregue', rotulo: 'Entregue' },
];

const POSICAO_STATUS = {
  aguardando_pagamento: 1,
  em_separacao: 2,
  a_caminho: 3,
  entregue: 4,
};

// Monta as etapas da linha do tempo de um pedido.
// Recebe o pedido; devolve a lista com o estado de cada etapa ("feita", "atual", "pendente" ou "cancelada").
export function montarEtapasPedido(pedido) {
  if (pedido.status === 'cancelado') {
    return ETAPAS.slice(0, 2).map((etapa, indice) => ({
      ...etapa,
      estado: indice === 0 ? 'feita' : 'cancelada',
      rotulo: indice === 1 ? 'Cancelado' : etapa.rotulo,
    }));
  }
  const posicao = POSICAO_STATUS[pedido.status] ?? 0;
  return ETAPAS.map((etapa, indice) => {
    let estado = 'pendente';
    if (indice < posicao || pedido.status === 'entregue') estado = 'feita';
    else if (indice === posicao) estado = 'atual';
    return { ...etapa, estado };
  });
}

// Gera o número do pedido no formato ALT-AAMM-NNNN, seguindo o maior número já usado.
export function gerarNumeroPedido(pedidos, dataIso) {
  const data = new Date(dataIso);
  const prefixo = `${String(data.getFullYear()).slice(2)}${String(data.getMonth() + 1).padStart(2, '0')}`;
  const maior = pedidos.reduce((acc, pedido) => {
    const sequencia = Number(String(pedido.id).split('-')[2]);
    return Number.isNaN(sequencia) ? acc : Math.max(acc, sequencia);
  }, 500);
  return `ALT-${prefixo}-${String(maior + 1).padStart(4, '0')}`;
}
