// Status possíveis de um pedido. Mantidos como constantes (em vez de
// strings soltas espalhadas pelo código) para evitar erros de digitação
// e centralizar o rótulo exibido na interface.
export const ORDER_STATUS = {
  AGUARDANDO: 'aguardando',
  CONFIRMADO: 'confirmado',
  ENTREGUE: 'entregue',
}

// Rótulo legível de cada status, para exibição na OrdersPage.
export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.AGUARDANDO]: 'Aguardando confirmação',
  [ORDER_STATUS.CONFIRMADO]: 'Confirmado',
  [ORDER_STATUS.ENTREGUE]: 'Entregue',
}

// Todo pedido nasce aguardando confirmação do fornecedor.
export const DEFAULT_ORDER_STATUS = ORDER_STATUS.AGUARDANDO