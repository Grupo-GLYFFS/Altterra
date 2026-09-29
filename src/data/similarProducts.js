// Mesmo raciocínio de homeProducts.js: virou função pra recalcular sempre
// que o catálogo ganhar produtos novos publicados pelo formulário.
export function buildSimilarProducts(products) {
  return Array.from({ length: 12 }, (_, index) => {
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
}
