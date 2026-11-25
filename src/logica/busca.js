import { normalizarTexto } from './formatos.js';

// Opções de ordenação da busca.
export const OPCOES_ORDENACAO = [
  { valor: 'relevantes', rotulo: 'Mais relevantes', rotuloCurto: 'relevantes' },
  { valor: 'menor-preco', rotulo: 'Menor preço por kg', rotuloCurto: 'menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço por kg', rotuloCurto: 'maior preço' },
  { valor: 'maior-estoque', rotulo: 'Maior estoque', rotuloCurto: 'maior estoque' },
  { valor: 'mais-perto', rotulo: 'Mais perto de você', rotuloCurto: 'mais perto' },
];

// Devolve a sigla do estado de um produto (ex.: "SP").
function ufDoProduto(produto) {
  return (produto.fornecedor?.cidade || '').split(' - ')[1] || '';
}

// Filtra os produtos ativos da busca.
// Recebe a lista e os filtros { q, soOutlet, categoriaId, uf, organico }; devolve só os que passam em todos.
export function filtrarProdutos(produtos, filtros) {
  const termos = normalizarTexto(filtros.q || '')
    .split(/\s+/)
    .filter(Boolean);

  return produtos.filter((produto) => {
    if (produto.status && produto.status !== 'ativo') return false;
    if (filtros.soOutlet && !produto.outlet) return false;
    if (filtros.organico && !produto.organico) return false;
    if (filtros.categoriaId && produto.categoriaId !== filtros.categoriaId) return false;
    if (filtros.uf && ufDoProduto(produto) !== filtros.uf) return false;
    if (termos.length === 0) return true;

    const texto = normalizarTexto(
      `${produto.nome} ${produto.categoria} ${produto.variedade || ''} ${produto.fornecedor?.nome || ''}`
    );
    return termos.every((termo) => texto.includes(termo));
  });
}

// Mede a distância simbólica entre um produto e a região do comprador (0 = mesma cidade).
function distancia(produto, regiao) {
  const cidade = produto.fornecedor?.cidade || '';
  if (cidade === regiao) return 0;
  const uf = (regiao || '').split(' - ')[1];
  return ufDoProduto(produto) === uf ? 1 : 2;
}

// Ordena a lista conforme a opção escolhida, sem alterar a original.
// Recebe a lista, a ordem e a região de referência (ex.: "São Paulo - SP").
export function ordenarProdutos(produtos, ordem, regiao = '') {
  const lista = [...produtos];
  if (ordem === 'menor-preco') return lista.sort((a, b) => a.precoMin - b.precoMin);
  if (ordem === 'maior-preco') return lista.sort((a, b) => b.precoMax - a.precoMax);
  if (ordem === 'maior-estoque') return lista.sort((a, b) => b.estoque - a.estoque);
  if (ordem === 'mais-perto') {
    return lista.sort((a, b) => distancia(a, regiao) - distancia(b, regiao));
  }
  return lista.sort((a, b) => {
    if ((a.estoque > 0) !== (b.estoque > 0)) return a.estoque > 0 ? -1 : 1;
    return (b.nota || 0) * Math.log10(10 + (b.totalAvaliacoes || 0)) -
      (a.nota || 0) * Math.log10(10 + (a.totalAvaliacoes || 0));
  });
}

// Lista as siglas de estado que aparecem nos produtos, em ordem alfabética.
export function listarEstados(produtos) {
  return [...new Set(produtos.map(ufDoProduto).filter(Boolean))].sort();
}
