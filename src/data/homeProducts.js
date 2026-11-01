// Antes era um array fixo (sempre os mesmos 12 cards, calculado 1 vez).
// Virou uma função porque agora o catálogo pode crescer em tempo de
// execução (produtos publicados pelo formulário) — precisa recalcular a
// cada chamada, usando a lista de produtos atual vinda do ProductsContext.
//
// buildProductCard converte UM produto do catálogo no formato que os cards
// consomem. Foi extraída daqui para também ser usada pela página de
// Favoritos, em vez de repetir o mapeamento.
export function buildProductCard(product, cardId) {
  return {
    id: cardId,
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
}

export function buildHomeProducts(products) {
  return Array.from({ length: 12 }, (_, index) =>
    buildProductCard(products[index % products.length], `home-product-${index + 1}`),
  )
}
