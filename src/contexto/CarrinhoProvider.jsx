import { useCallback, useMemo } from 'react';
import { ContextoCarrinho } from './ContextoCarrinho.js';
import { usePersistente } from './usePersistente.js';

// Guarda os itens do carrinho ({ produtoId, quantidade }) e o modo de entrega de cada fornecedor.
export function CarrinhoProvider({ children }) {
  const [itens, setItens] = usePersistente('carrinho', []);
  const [modosEntrega, setModosEntrega] = usePersistente('modos-entrega', {});

  // Soma a quantidade ao item existente ou cria uma linha nova.
  const adicionar = useCallback(
    (produto, quantidade) => {
      setItens((lista) => {
        const existente = lista.find((item) => item.produtoId === produto.id);
        if (existente) {
          return lista.map((item) =>
            item.produtoId === produto.id
              ? { ...item, quantidade: Math.min(produto.estoque, item.quantidade + quantidade) }
              : item
          );
        }
        return [...lista, { produtoId: produto.id, quantidade: Math.min(produto.estoque, quantidade) }];
      });
    },
    [setItens]
  );

  // Define a quantidade de um item.
  const definirQuantidade = useCallback(
    (produtoId, quantidade) => {
      setItens((lista) => lista.map((i) => (i.produtoId === produtoId ? { ...i, quantidade } : i)));
    },
    [setItens]
  );

  // Remove um item pelo id do produto.
  const remover = useCallback(
    (produtoId) => setItens((lista) => lista.filter((i) => i.produtoId !== produtoId)),
    [setItens]
  );

  // Remove vários itens de uma vez (grupo de um fornecedor).
  const removerVarios = useCallback(
    (ids) => setItens((lista) => lista.filter((i) => !ids.includes(i.produtoId))),
    [setItens]
  );

  // Esvazia o carrinho.
  const limpar = useCallback(() => setItens([]), [setItens]);

  // Guarda se o fornecedor entrega ou se o comprador retira.
  const definirModo = useCallback(
    (fornecedorId, modo) => setModosEntrega((atual) => ({ ...atual, [fornecedorId]: modo })),
    [setModosEntrega]
  );

  const valor = useMemo(
    () => ({
      itens,
      totalItens: itens.length,
      modosEntrega,
      adicionar,
      definirQuantidade,
      remover,
      removerVarios,
      limpar,
      definirModo,
    }),
    [itens, modosEntrega, adicionar, definirQuantidade, remover, removerVarios, limpar, definirModo]
  );

  return <ContextoCarrinho.Provider value={valor}>{children}</ContextoCarrinho.Provider>;
}
