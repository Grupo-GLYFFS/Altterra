import { createContext, useMemo, useReducer } from 'react'

// Estado global do carrinho. Escolhido Context API + useReducer (em vez de
// vários useState soltos) porque as ações do carrinho (adicionar,
// incrementar, decrementar, remover) são todas "atualizações da mesma lista
// de itens" — um reducer deixa essa lógica num único lugar previsível, e o
// Context deixa o carrinho acessível em qualquer página sem precisar passar
// props manualmente pela árvore (Navbar, ProductPage e o painel do carrinho
// não têm relação de pai/filho direta).
const CartContext = createContext(null)
export { CartContext }

const initialState = {
  items: [], // { id, name, image, unitPrice, unitLabel, quantity }
  isOpen: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      // Se o produto já está no carrinho, não duplica — soma na quantidade
      // do item existente.
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          isOpen: true,
        }
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        isOpen: true,
      }
    }

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }

    case 'DECREMENT':
      return {
        ...state,
        // Ao chegar em 1 e decrementar, remove o item (evita quantidade 0
        // "fantasma" ficando visível no carrinho).
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // useMemo evita recriar o objeto de contexto (e os totais derivados) em
  // todo render — só recalcula quando os itens realmente mudam.
  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = state.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    return {
      items: state.items,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addItem: (product, quantity = 1) =>
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
      incrementItem: (id) => dispatch({ type: 'INCREMENT', payload: { id } }),
      decrementItem: (id) => dispatch({ type: 'DECREMENT', payload: { id } }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      openCart: () => dispatch({ type: 'OPEN_CART' }),
      closeCart: () => dispatch({ type: 'CLOSE_CART' }),
      toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
