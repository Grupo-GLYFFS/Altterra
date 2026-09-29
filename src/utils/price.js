// Converte "R$ 3,20/kg" (formato já usado em data/products.js) para o
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

// Formata a data de criação do pedido (ISO) no padrão brasileiro,
// ex.: "26/08/2026 às 14:32".
export function formatDateBRL(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  const dia = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const hora = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${dia} às ${hora}`
}
