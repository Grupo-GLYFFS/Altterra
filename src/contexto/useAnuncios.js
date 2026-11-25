import { useContext } from 'react';
import { ContextoAnuncios } from './ContextoAnuncios.js';

// Acessa os anúncios (produtos, produtosAtivos, buscarProduto, buscarFornecedor, publicar, atualizar, alternarPausa, excluir).
export function useAnuncios() {
  const contexto = useContext(ContextoAnuncios);
  if (!contexto) throw new Error('useAnuncios precisa estar dentro de AnunciosProvider');
  return contexto;
}
