import HomeProductCard from './HomeProductCard'
import { useCarouselDrag } from '../product/useCarouselDrag'

// Mesma marcação de <section class="product-section"> que já existia 4x
// (colada manualmente) em HomePage.jsx. A única mudança é ligar os botões
// de paginação e o arrastar do mouse ao hook useCarouselDrag — o mesmo já
// usado em ProductPage > SimilarProducts, aqui só reaproveitado, não
// modificado, exatamente como o carousel.js original fazia em TODAS as
// .product-section da página (não só na de produtos similares).
function HomeProductCarousel({ title, products }) {
  const { trackRef, isDraggable, isDragging, prevDisabled, nextDisabled, scrollPrev, scrollNext } =
    useCarouselDrag()

  return (
    <section className="product-section">
      <div className="product-section-top">
        <div className="product-section-header">
          <h2 className="title-2xl">{title}</h2>

          <button className="button-arrow" type="button">
            <span className="icon icon-16">
              <svg viewBox="0 0 16 11">
                <path d="M10.6667 11L9.25 9.53906L12.1667 6.53125H0V4.46875H12.1667L9.25 1.46094L10.6667 0L16 5.5L10.6667 11Z" />
              </svg>
            </span>
          </button>
        </div>

        <div className="product-section-nav">
          <button className="button-pagination" type="button" onClick={scrollPrev} disabled={prevDisabled}>
            <span className="icon icon-12">
              <svg viewBox="0 0 10 16">
                <path d="M8.24742 16L0 8L8.24742 0L10 1.7L3.50515 8L10 14.3L8.24742 16Z" />
              </svg>
            </span>
          </button>

          <button className="button-pagination" type="button" onClick={scrollNext} disabled={nextDisabled}>
            <span className="icon icon-12">
              <svg viewBox="0 0 10 16">
                <path d="M6.49485 8L0 1.7L1.75258 0L10 8L1.75258 16L0 14.3L6.49485 8Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <ul
        className={`products-grid${isDraggable ? ' is-draggable' : ''}${isDragging ? ' is-dragging' : ''}`}
        ref={trackRef}
      >
        {products.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  )
}

export default HomeProductCarousel
