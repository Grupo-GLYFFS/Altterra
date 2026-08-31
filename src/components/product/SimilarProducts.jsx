import ProductCard from './ProductCard';
import { useCarouselDrag } from './useCarouselDrag';

// Corresponde a <section class="product-section"> no HTML original.
// A lógica de arrastar/paginar que antes vinha de carousel.js (aplicada
// via querySelectorAll a QUALQUER .product-section da página) agora é
// local a este componente, via useCarouselDrag.
function SimilarProducts({ title, products }) {
  const { trackRef, isDraggable, isDragging, prevDisabled, nextDisabled, scrollPrev, scrollNext } =
    useCarouselDrag();

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
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
}

export default SimilarProducts;
