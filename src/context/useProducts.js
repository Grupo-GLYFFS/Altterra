import { useContext } from 'react'
import { ProductsContext } from './ProductsContext'

// Hook de acesso ao catálogo — lança erro claro se usado fora do
// <ProductsProvider>, em vez de falhar silenciosamente com `undefined`.
export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts precisa ser usado dentro de um <ProductsProvider>')
  }
  return context
}