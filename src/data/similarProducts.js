import tomateCarmem from '../assets/images/tomate-carmem.png';

// No HTML original, cada <article class="product-card"> dentro de
// #product-similar era colado manualmente 12 vezes com o mesmo conteúdo.
// Aqui viram 1 objeto repetido 12x, mantendo a MESMA quantidade de cards.
const baseProduct = {
  name: 'Tomate Carmem',
  supplier: 'Cooperativa Vale Verde',
  rating: '4.89',
  distance: '12km',
  available: '500t',
  minimum: '50t',
  priceRange: 'R$2,80 - R$3,20/kg',
  image: tomateCarmem,
  href: '/',
};

export const similarProducts = Array.from({ length: 12 }, (_, index) => ({
  id: `similar-${index + 1}`,
  ...baseProduct,
}));
