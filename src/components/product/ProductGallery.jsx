import { useState } from 'react';

// Equivalente ao bloco "Galeria de imagens" de js/pages/product-page.js.
// Antes: currentIndex vivia numa closure e o DOM era atualizado na mão
// (mainImage.src, thumb.classList.toggle('is-active', ...)).
// Agora: currentIndex é estado React e o JSX é derivado dele — mesmo
// comportamento (thumbnails fixos, seta prev/next percorre a mesma lista,
// thumbnail ativo destacado), sem tocar no DOM diretamente.
function ProductGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = images[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <figure className="image-gallery-container">
      <div className="main-image-container">
        <button className="image-gallery-button image-gallery-button-prev" onClick={goToPrev} type="button">
          <span className="icon icon-16">
            <svg viewBox="0 0 10 16">
              <path d="M8.24742 16L0 8L8.24742 0L10 1.7L3.50515 8L10 14.3L8.24742 16Z" />
            </svg>
          </span>
        </button>

        <img className="main-image" src={current.src} alt={current.alt} />

        <button className="image-gallery-button image-gallery-button-next" onClick={goToNext} type="button">
          <span className="icon icon-16">
            <svg viewBox="0 0 10 16">
              <path d="M6.49485 8L0 1.7L1.75258 0L10 8L1.75258 16L0 14.3L6.49485 8Z" />
            </svg>
          </span>
        </button>
      </div>

      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={image.src}
            className={`thumbnail-image${index === currentIndex ? ' is-active' : ''}`}
            src={image.src}
            alt={image.alt}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </figure>
  );
}

export default ProductGallery;
