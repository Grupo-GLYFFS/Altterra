import { useContext } from 'react';
import { ContextoPedidos } from './ContextoPedidos.js';

// Acessa os pedidos (pedidos, criarPedidos, confirmarPagamento, cancelarPedido, avancarStatus, avaliarPedido).
export function usePedidos() {
  const contexto = useContext(ContextoPedidos);
  if (!contexto) throw new Error('usePedidos precisa estar dentro de PedidosProvider');
  return contexto;
}
