import { useCallback, useMemo } from 'react';
import { ContextoFavoritos } from './ContextoFavoritos.js';
import { usePersistente } from './usePersistente.js';

// Favoritos de exemplo: o preço guardado difere do atual em alguns, para mostrar "Baixou" e "Subiu".
const FAVORITOS_INICIAIS = [
  { id: 'tomate-carmem', preco: 3.4 },
  { id: 'alface-crespa', preco: 2.2 },
  { id: 'tomate-debora', preco: 2.9 },
  { id: 'tomate-cereja', preco: 7.9 },
];

// Guarda os favoritos com o menor preço visto no momento em que foram marcados.
export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = usePersistente('favoritos', FAVORITOS_INICIAIS);

  // Confere se um produto está favoritado.
  const ehFavorito = useCallback((id) => favoritos.some((f) => f.id === id), [favoritos]);

  // Marca ou desmarca um produto, guardando o preço atual.
  const alternar = useCallback(
    (produto) => {
      setFavoritos((lista) =>
        lista.some((f) => f.id === produto.id)
          ? lista.filter((f) => f.id !== produto.id)
          : [...lista, { id: produto.id, preco: produto.precoMin }]
      );
    },
    [setFavoritos]
  );

  // Atualiza o preço guardado (usado ao dispensar o aviso de mudança).
  const atualizarPreco = useCallback(
    (id, preco) => setFavoritos((lista) => lista.map((f) => (f.id === id ? { ...f, preco } : f))),
    [setFavoritos]
  );

  const valor = useMemo(
    () => ({ favoritos, ehFavorito, alternar, atualizarPreco }),
    [favoritos, ehFavorito, alternar, atualizarPreco]
  );

  return <ContextoFavoritos.Provider value={valor}>{children}</ContextoFavoritos.Provider>;
}
