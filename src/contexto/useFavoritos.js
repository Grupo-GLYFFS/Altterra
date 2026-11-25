import { useContext } from 'react';
import { ContextoFavoritos } from './ContextoFavoritos.js';

// Acessa os favoritos (favoritos, ehFavorito, alternar).
export function useFavoritos() {
  const contexto = useContext(ContextoFavoritos);
  if (!contexto) throw new Error('useFavoritos precisa estar dentro de FavoritosProvider');
  return contexto;
}
