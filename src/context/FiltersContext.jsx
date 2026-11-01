import { createContext, useEffect, useMemo, useState } from 'react'
import { ALL_REGIONS, locationCities } from '../data/categories'
import { loadFromStorage, saveToStorage } from '../utils/storage'

// Filtros globais do marketplace. Hoje só a REGIÃO, escolhida no popup de
// localização da navbar e lida pela Home e pelo painel de categorias — por
// isso precisa viver num contexto, e não dentro da Navbar como antes
// (useState local, que nenhuma outra tela conseguia ler).
//
// É um único valor, então usamos useState em vez de useReducer (os outros
// contextos têm várias ações). Persistido em localStorage como os demais.
const FiltersContext = createContext(null)
export { FiltersContext }

const STORAGE_KEY = 'altterra:region'

function getInitialRegion() {
  const saved = loadFromStorage(STORAGE_KEY, ALL_REGIONS)
  // Só aceita um valor que ainda exista na lista (defesa contra dado velho).
  return saved === ALL_REGIONS || locationCities.includes(saved) ? saved : ALL_REGIONS
}

export function FiltersProvider({ children }) {
  const [region, setRegion] = useState(getInitialRegion)

  useEffect(() => {
    saveToStorage(STORAGE_KEY, region)
  }, [region])

  const value = useMemo(
    () => ({ region, setRegion, isRegionFiltered: region !== ALL_REGIONS }),
    [region],
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}