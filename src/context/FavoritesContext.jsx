import { createContext, useEffect, useMemo, useReducer } from 'react'
import { useProducts } from './useProducts'
import { loadFromStorage, saveToStorage } from '../utils/storage'

// Estado global de favoritos. Mesma arquitetura de CartContext,
// OrderContext e ProductsContext (Context API + useReducer + localStorage).
//
// Guardamos APENAS os ids (productId) — nunca uma cópia do produto. Assim
// o favorito funciona igual para produtos do catálogo inicial e para os
// publicados pelo formulário, e qualquer dado do produto (nome, preço,
// foto) sempre vem do catálogo atual, sem ficar desatualizado.
//
// Este provider precisa ficar DENTRO do <ProductsProvider>, porque usa o
// catálogo para descartar ids de produtos que não existem mais.
const FavoritesContext = createContext(null)
export { FavoritesContext }

const STORAGE_KEY = 'altterra:favorites'

function getInitialState() {
  const saved = loadFromStorage(STORAGE_KEY, [])
  // Defesa contra dado corrompido no localStorage: só aceita array de strings.
  return {
    favoriteIds: Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [],
  }
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const id = action.payload
      const alreadyFavorite = state.favoriteIds.includes(id)
      return {
        ...state,
        favoriteIds: alreadyFavorite
          ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
          : [id, ...state.favoriteIds],
      }
    }

    default:
      return state
  }
}

export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favoritesReducer, undefined, getInitialState)
  const { getProductById } = useProducts()

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state.favoriteIds)
  }, [state.favoriteIds])

  const value = useMemo(() => {
    // Mais recente primeiro; ids sem produto correspondente são ignorados.
    const favoriteProducts = state.favoriteIds
      .map((id) => getProductById(id))
      .filter(Boolean)

    return {
      favoriteProducts,
      totalFavorites: favoriteProducts.length,
      isFavorite: (id) => state.favoriteIds.includes(id),
      toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
    }
  }, [state, getProductById])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}