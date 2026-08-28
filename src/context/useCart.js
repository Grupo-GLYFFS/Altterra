import { useContext } from 'react'
import { CartContext } from './CartContext'

// Hook de acesso ao carrinho — lança erro claro se usado fora do
// <CartProvider>, em vez de falhar silenciosamente com `undefined`.
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart precisa ser usado dentro de um <CartProvider>')
  }
  return context
}
