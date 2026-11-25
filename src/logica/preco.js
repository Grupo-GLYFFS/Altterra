// Regras de preço por faixa de volume.

// Descobre o preço por unidade para a quantidade pedida.
// Recebe o produto (com faixas ordenadas) e a quantidade; devolve o preço da maior faixa atingida.
export function precoPorQuantidade(produto, quantidade) {
  const faixas = produto.faixas || [];
  if (faixas.length === 0) return produto.precoMin || 0;
  let preco = faixas[0].preco;
  faixas.forEach((faixa) => {
    if (quantidade >= faixa.minimo) preco = faixa.preco;
  });
  return preco;
}

// Calcula o subtotal de uma linha (quantidade x preço da faixa).
export function subtotalLinha(produto, quantidade) {
  return Math.round(precoPorQuantidade(produto, quantidade) * quantidade * 100) / 100;
}

// Devolve a próxima faixa que dá desconto, ou null se já está na melhor.
export function proximaFaixa(produto, quantidade) {
  return (produto.faixas || []).find((faixa) => faixa.minimo > quantidade) || null;
}

// Monta o texto de intervalo de cada faixa (ex.: "50 a 199 kg" e "500 kg ou mais").
export function rotuloFaixa(produto, indice) {
  const faixas = produto.faixas || [];
  const atual = faixas[indice];
  const seguinte = faixas[indice + 1];
  if (!seguinte) return `${atual.minimo.toLocaleString('pt-BR')} ${produto.unidade} ou mais`;
  return `${atual.minimo.toLocaleString('pt-BR')} a ${(seguinte.minimo - 1).toLocaleString('pt-BR')} ${produto.unidade}`;
}
