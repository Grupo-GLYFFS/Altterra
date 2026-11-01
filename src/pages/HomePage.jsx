import HomeProductCarousel from '../components/home/HomeProductCarousel'
import { buildHomeProducts } from '../data/homeProducts'
import { useProducts } from '../context/useProducts'
import { useFilters } from '../context/useFilters'
import { ALL_REGIONS } from '../data/categories'
import { filterProductsByRegion } from '../utils/productFilters'

// As 4 seções eram coladas manualmente (1832 linhas, sem nenhum onClick,
// useRef, useState) — os botões de seta/paginação existiam visualmente mas
// não faziam nada, e não havia como arrastar os cards com o mouse. Nenhum
// comportamento do carousel.js original tinha sido migrado para React.
// Reescrito para usar HomeProductCarousel (que já embute o mesmo hook
// useCarouselDrag usado em ProductPage > SimilarProducts), mantendo os
// mesmos 4 títulos e os mesmos 12 cards por seção do HTML original.
function HomePage() {
  const { products } = useProducts()
  const { region, setRegion } = useFilters()

  // Só entram nos carrosséis os produtos da região escolhida na navbar
  // ("Todas as regiões" não filtra nada).
  const visibleProducts = filterProductsByRegion(products, region)

  if (visibleProducts.length === 0) {
    return (
      <div className="page-sections">
        <div className="orders-empty">
          <p className="text-muted">Nenhum produto cadastrado em {region}.</p>
          <button type="button" className="button-primary" onClick={() => setRegion(ALL_REGIONS)}>
            Ver todas as regiões
          </button>
        </div>
      </div>
    )
  }

  const homeProducts = buildHomeProducts(visibleProducts)

  return (
    <div className="page-sections">
      <HomeProductCarousel title="Produtos perto de você" products={homeProducts} />
      <HomeProductCarousel title="Produtores pequenos" products={homeProducts} />
      <HomeProductCarousel title="Produtores certificados" products={homeProducts} />
      <HomeProductCarousel title="Produtos para próxima safra" products={homeProducts} />
    </div>
  )
}

export default HomePage
