import { createContext, useEffect, useMemo, useReducer } from 'react'
import { products as seedProducts } from '../data/products'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { hydrateProduct } from '../utils/productAssets'

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
    // hydrateProduct troca as chaves de imagem guardadas no localStorage
    // ('asset:placeholder'...) pelas URLs reais do build atual.
    const products = [...seedProducts, ...state.customProducts.map(hydrateProduct)]

    return {
      products,

      // Devolve true se o produto foi publicado E gravado no localStorage;
      // false se a gravação falhou (cota cheia — acontece com fotos). Neste
      // caso o produto NÃO entra no catálogo, para nunca parecer publicado
      // e sumir no próximo reload.
      addProduct: (product) => {
        const saved = saveToStorage(STORAGE_KEY, [product, ...state.customProducts])
        if (!saved) return false
        dispatch({ type: 'ADD_PRODUCT', payload: product })
        return true
      },

      getProductById: (id) => products.find((product) => product.id === id),
    }
  }, [state])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}