import { createContext, useEffect, useMemo, useReducer } from 'react'
import { DEFAULT_ORDER_STATUS } from '../data/orderStatus'
import { currentUser } from '../data/currentUser'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const OrderContext = createContext(null)
export { OrderContext }

const STORAGE_KEY = 'altterra:orders'

function getInitialState() {
  return {
    orders: loadFromStorage(STORAGE_KEY, []),
  }
}

function generateOrderId() {
  const random = Math.floor(Math.random() * 1000000)
  return `ALT-${String(random).padStart(6, '0')}`
}

function cartItemsToOrderItems(cartItems) {
  return cartItems.map((item) => ({
    productId: item.id,
    productName: item.name,
    productImage: item.image,
    unitPrice: item.unitPrice,
    unitLabel: item.unitLabel,
    quantity: item.quantity,
  }))
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'CREATE_ORDER': {
      const { cartItems, user } = action.payload

      const items = cartItemsToOrderItems(cartItems)
      const total = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      )

      const order = {
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        status: DEFAULT_ORDER_STATUS,
        userId: user.id,
        userName: user.nome,
        items,
        total,
      }

      return { ...state, orders: [order, ...state.orders] }
    }

    case 'CLEAR_ORDERS':
      return { ...state, orders: [] }

    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, undefined, getInitialState)

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state.orders)
  }, [state.orders])

  const value = useMemo(() => {
    return {
      orders: state.orders,
      totalOrders: state.orders.length,

      createOrder: (cartItems, user = currentUser) => {
        if (!cartItems || cartItems.length === 0) return null
        dispatch({ type: 'CREATE_ORDER', payload: { cartItems, user } })
      },

      clearOrders: () => dispatch({ type: 'CLEAR_ORDERS' }),
    }
  }, [state])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}