// Converte "R$ 3,20/kg" (formato já usado em data/productData.js) para o
// número 3.2, para permitir soma/multiplicação no carrinho.
export function parsePriceBRL(priceLabel) {
  const match = priceLabel.match(/[\d.,]+/)
  if (!match) return 0
  return Number(match[0].replace(/\./g, '').replace(',', '.'))
}

// Formata um número de volta para o padrão R$ usado no resto do projeto.
export function formatPriceBRL(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
