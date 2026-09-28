// Antes era um array fixo (sempre os mesmos 12 cards, calculado 1 vez).
// Virou uma função porque agora o catálogo pode crescer em tempo de
// execução (produtos publicados pelo formulário) — precisa recalcular a
// cada chamada, usando a lista de produtos atual vinda do ProductsContext.
export function buildHomeProducts(products) {
  return Array.from({ length: 12 }, (_, index) => {
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
}
