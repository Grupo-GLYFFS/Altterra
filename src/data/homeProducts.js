// Extraído dos 4 blocos <ul class="products-grid"> de index.html — cada um
// tinha os mesmos 12 cards de "Tomate Carmem" colados manualmente. Aqui
// viram 1 array reaproveitado pelas 4 seções, mantendo a MESMA quantidade
// de cards (12) e o mesmo conteúdo do HTML original.
const baseProduct = {
  name: 'Tomate Carmem',
  supplier: 'Cooperativa Vale Verde',
  rating: '4.89',
  distance: '12km',
  available: '500t',
  minimum: '50t',
  priceRange: 'R$2,80 - R$3,20/kg',
  image: '/images/tomate-carmem.png',
}

export const homeProducts = Array.from({ length: 12 }, (_, index) => ({
  id: `home-product-${index + 1}`,
  ...baseProduct,
}))
