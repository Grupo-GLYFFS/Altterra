import { caminhoImagem } from './imagens.js';

// Completa um produto de exemplo ou anúncio novo com os campos calculados.
// Recebe o produto bruto (com faixas de preço e fornecedor); devolve o produto pronto para os cards.
export function completarProduto(bruto, fornecedores = []) {
  const faixas = [...(bruto.faixas || [])].sort((a, b) => a.minimo - b.minimo);
  const precos = faixas.map((faixa) => faixa.preco);
  const precoMin = precos.length ? Math.min(...precos) : 0;
  const precoMax = precos.length ? Math.max(...precos) : 0;
  const fornecedorBruto =
    bruto.fornecedor || fornecedores.find((item) => item.id === bruto.fornecedorId) || null;
  const fornecedor = fornecedorBruto
    ? { ...fornecedorBruto, logo: caminhoImagem(fornecedorBruto.logo) }
    : null;
  const desconto = bruto.outlet ? bruto.descontoPercentual || 0 : 0;
  const fator = desconto ? 1 - desconto / 100 : 1;
  const imagem = caminhoImagem(bruto.imagem);
  const imagens = Array.isArray(bruto.imagens)
    ? bruto.imagens.map(caminhoImagem).filter(Boolean)
    : imagem
      ? [imagem]
      : [];

  return {
    status: 'ativo',
    organico: false,
    outlet: false,
    unidade: 'kg',
    nota: null,
    totalAvaliacoes: 0,
    ...bruto,
    imagem,
    imagens,
    fornecedor,
    fornecedorId: fornecedor?.id || bruto.fornecedorId,
    faixas,
    precoMin,
    precoMax,
    precoAntigoMin: desconto ? Math.round((precoMin / fator) * 100) / 100 : null,
    precoAntigoMax: desconto ? Math.round((precoMax / fator) * 100) / 100 : null,
    descontoPercentual: desconto,
    pedidoMinimo: faixas[0]?.minimo || 1,
  };
}
