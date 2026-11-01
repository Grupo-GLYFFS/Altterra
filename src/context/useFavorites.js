import { useContext } from 'react'
import { FavoritesContext } from './FavoritesContext'

// Hook de acesso aos favoritos — lança erro claro se usado fora do
// <FavoritesProvider>, em vez de falhar silenciosamente com `undefined`.
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites precisa ser usado dentro de um <FavoritesProvider>')
  }
  return context
}