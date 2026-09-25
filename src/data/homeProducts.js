import { products } from './products'

// Antes: repetia 1 produto fake 12 vezes. Agora: distribui os produtos
// reais do catálogo pelos 12 slots do carrossel (ciclando entre eles
// enquanto o catálogo for pequeno). `id` continua único por posição (é a
// key do React); `productId` é o produto de verdade, usado pro link e
// para manter a identidade de favorito consistente entre a Home e a
// página do produto.
export const homeProducts = Array.from({ length: 12 }, (_, index) => {
  const product = products[index % products.length]
  return {
    id: `home-product-${index + 1}`,
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
