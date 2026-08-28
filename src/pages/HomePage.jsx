import HomeProductCarousel from '../components/home/HomeProductCarousel'
import { homeProducts } from '../data/homeProducts'

// As 4 seções eram coladas manualmente (1832 linhas, sem nenhum onClick,
// useRef, useState) — os botões de seta/paginação existiam visualmente mas
// não faziam nada, e não havia como arrastar os cards com o mouse. Nenhum
// comportamento do carousel.js original tinha sido migrado para React.
// Reescrito para usar HomeProductCarousel (que já embute o mesmo hook
// useCarouselDrag usado em ProductPage > SimilarProducts), mantendo os
// mesmos 4 títulos e os mesmos 12 cards por seção do HTML original.
function HomePage() {
  return (
    <main className="page-sections">
      <HomeProductCarousel title="Produtos perto de você" products={homeProducts} />
      <HomeProductCarousel title="Produtores pequenos" products={homeProducts} />
      <HomeProductCarousel title="Produtores certificados" products={homeProducts} />
      <HomeProductCarousel title="Produtos para próxima safra" products={homeProducts} />
    </main>
  )
}

export default HomePage
