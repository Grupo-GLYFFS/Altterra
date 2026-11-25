import { useContext } from 'react';
import { ContextoCarrinho } from './ContextoCarrinho.js';

// Acessa o carrinho (itens, totalItens, adicionar, definirQuantidade, remover, limpar).
export function useCarrinho() {
  const contexto = useContext(ContextoCarrinho);
  if (!contexto) throw new Error('useCarrinho precisa estar dentro de CarrinhoProvider');
  return contexto;
}
