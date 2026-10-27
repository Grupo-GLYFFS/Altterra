import { useContext } from 'react'
import { FiltersContext } from './FiltersContext'

// Hook de acesso aos filtros — lança erro claro se usado fora do
// <FiltersProvider>, em vez de falhar silenciosamente com `undefined`.
export function useFilters() {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error('useFilters precisa ser usado dentro de um <FiltersProvider>')
  }
  return context
}