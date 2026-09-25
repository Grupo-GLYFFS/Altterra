import { products } from './products'

// Mesmo raciocínio de homeProducts.js: distribui os produtos reais do
// catálogo pelos 12 slots da seção "Produtos similares", em vez de repetir
// 1 produto fake. `productId` é o id real usado pro link.
export const similarProducts = Array.from({ length: 12 }, (_, index) => {
  const product = products[index % products.length]
  return {
    id: `similar-${index + 1}`,
    productId: product.id,
    name: product.name,
    supplier: product.cardSummary.supplierName,
    rating: product.cardSummary.rating,
    distance: product.cardSummary.distance,
    available: product.cardSummary.available,
    minimum: product.cardSummary.minimum,
    priceRange: product.cardSummary.priceRangeLabel,
    image: product.cardSummary.image,
  }
})
