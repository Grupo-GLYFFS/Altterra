import { useContext } from 'react'
import { OrderContext } from './OrderContext'

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders precisa ser usado dentro de um <OrderProvider>')
  }
  return context
}