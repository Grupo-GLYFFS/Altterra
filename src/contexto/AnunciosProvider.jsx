import { useCallback, useMemo } from 'react';
import { lerArmazenamento, salvarArmazenamento } from '../armazenamento.js';
import { FORNECEDORES } from '../dados/fornecedores.js';
import { PRODUTOS } from '../dados/produtos.js';
import { completarProduto } from '../logica/catalogo.js';
import { ContextoAnuncios } from './ContextoAnuncios.js';
import { usePersistente } from './usePersistente.js';

const VERSAO_CATALOGO = 2;
const CHAVE_VERSAO = 'anuncios-versao';

// Normaliza caminhos de imagem e atualiza os anúncios iniciais quando a versão do catálogo sobe.
function normalizarListaAnuncios(lista) {
  const versaoSalva = lerArmazenamento(CHAVE_VERSAO, 0);
  if (!Array.isArray(lista) || versaoSalva < VERSAO_CATALOGO) {
    salvarArmazenamento(CHAVE_VERSAO, VERSAO_CATALOGO);
    const idsSemeados = new Set(PRODUTOS.map((item) => item.id));
    const personalizados = Array.isArray(lista)
      ? lista
          .filter((item) => item?.id && !idsSemeados.has(item.id))
          .map((item) => completarProduto(item, FORNECEDORES))
      : [];
    return [...personalizados, ...PRODUTOS];
  }
  return lista.map((item) => completarProduto(item, FORNECEDORES));
}

// Guarda todos os anúncios: os de exemplo e os que os fornecedores criam, editam ou pausam.
export function AnunciosProvider({ children }) {
  const [produtos, setProdutos] = usePersistente('anuncios', PRODUTOS, normalizarListaAnuncios);

  // Só os anúncios ativos aparecem na busca e nos carrosséis.
  const produtosAtivos = useMemo(() => produtos.filter((p) => p.status === 'ativo'), [produtos]);

  // Procura um produto pelo id.
  const buscarProduto = useCallback((id) => produtos.find((p) => p.id === id) || null, [produtos]);

  // Procura um fornecedor pelo id, primeiro nos anúncios e depois nos exemplos.
  const buscarFornecedor = useCallback(
    (id) =>
      produtos.find((p) => p.fornecedor?.id === id)?.fornecedor ||
      FORNECEDORES.find((f) => f.id === id) ||
      null,
    [produtos]
  );

  // Publica um anúncio novo; devolve o produto criado.
  const publicar = useCallback(
    (dados) => {
      const produto = completarProduto({ ...dados, id: `anuncio-${Date.now()}`, status: 'ativo' });
      setProdutos((lista) => [produto, ...lista]);
      return produto;
    },
    [setProdutos]
  );

  // Atualiza um anúncio existente e recalcula os preços.
  const atualizar = useCallback(
    (id, dados) => {
      setProdutos((lista) => lista.map((p) => (p.id === id ? completarProduto({ ...p, ...dados }) : p)));
    },
    [setProdutos]
  );

  // Pausa um anúncio ativo ou reativa um pausado.
  const alternarPausa = useCallback(
    (id) => {
      setProdutos((lista) =>
        lista.map((p) => (p.id === id ? { ...p, status: p.status === 'ativo' ? 'pausado' : 'ativo' } : p))
      );
    },
    [setProdutos]
  );

  // Cria uma cópia pausada de um anúncio.
  const duplicar = useCallback(
    (id) => {
      setProdutos((lista) => {
        const original = lista.find((p) => p.id === id);
        if (!original) return lista;
        return [
          { ...original, id: `anuncio-${Date.now()}`, nome: `${original.nome} (cópia)`, status: 'pausado' },
          ...lista,
        ];
      });
    },
    [setProdutos]
  );

  // Exclui um anúncio.
  const excluir = useCallback(
    (id) => setProdutos((lista) => lista.filter((p) => p.id !== id)),
    [setProdutos]
  );

  const valor = useMemo(
    () => ({
      produtos,
      produtosAtivos,
      buscarProduto,
      buscarFornecedor,
      publicar,
      atualizar,
      alternarPausa,
      duplicar,
      excluir,
    }),
    [produtos, produtosAtivos, buscarProduto, buscarFornecedor, publicar, atualizar, alternarPausa, duplicar, excluir]
  );

  return <ContextoAnuncios.Provider value={valor}>{children}</ContextoAnuncios.Provider>;
}
