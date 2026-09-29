import { createContext, useEffect, useMemo, useReducer } from 'react'
import { products as seedProducts } from '../data/products'
import { loadFromStorage, saveToStorage } from '../utils/storage'

// Estado global do catálogo de produtos. Segue a mesma arquitetura já
// validada em CartContext/OrderContext (Context API + useReducer +
// persistência em localStorage), por consistência.
//
// `seedProducts` (de data/products.js) são os produtos que já vêm prontos
// com o projeto — nunca mudam em tempo de execução. `customProducts` são
// os publicados pelo formulário "Anunciar produto", guardados à parte e
// persistidos, porque só eles precisam sobreviver a um reload.
const ProductsContext = createContext(null)
export { ProductsContext }

const STORAGE_KEY = 'altterra:custom-products'

function getInitialState() {
  return {
    customProducts: loadFromStorage(STORAGE_KEY, []),
  }
}

function productsReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, customProducts: [action.payload, ...state.customProducts] }

    default:
      return state
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(productsReducer, undefined, getInitialState)

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state.customProducts)
  }, [state.customProducts])

  const value = useMemo(() => {
    // Semente primeiro, publicados depois — mantém a ordem dos carrosséis
    // da Home estável independente de quantos produtos novos existirem.
    const products = [...seedProducts, ...state.customProducts]

    return {
      products,

      addProduct: (product) => dispatch({ type: 'ADD_PRODUCT', payload: product }),

      getProductById: (id) => products.find((product) => product.id === id),
    }
  }, [state])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}