// Corresponde a cada <li><a><article class="product-card">...</article></a></li>
// do HTML original. Os 12 blocos eram idênticos byte-a-byte — aqui viram
// 1 componente + dado, sem mudar nada visualmente.
//
// Nota: a estrela aqui usa a classe "icon icon-12 text-muted-dark" (uma
// combinação que só aparece neste card), por isso o SVG fica inline em vez
// de reaproveitar <StarIcon> — StarIcon sempre teria que aninhar um <span>
// dentro de outro <span class="icon">, o que duplicaria o wrapper.
function ProductCard({ product }) {
  return (
    <li>
      <a href={product.href}>
        <article className="product-card">
          <img className="product-image" src={product.image} alt={product.name} />

          <h3 className="text-semibold">{product.name}</h3>

          <div className="product-card-supplier-info">
            <p className="text-xs text-muted-dark">{product.supplier}</p>

            <div className="product-card-review">
              <span className="icon icon-12 text-muted-dark">
                <svg viewBox="0 0 16 16">
                  <path d="M5.875 11.9792L8 10.3542L10.125 11.9792L9.33333 9.39583L11.7083 7.5H8.85417L8 4.875L7.16667 7.5H4.29167L6.6875 9.39583L5.875 11.9792ZM3.0625 16L4.9375 9.9375L0 6H6.0625L8 0L9.9375 6H16L11.0625 9.9375L12.9375 16L8 12.25L3.0625 16Z" />
                </svg>
              </span>
              <span className="text-xs text-muted-dark">{product.rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted-dark">Distância: {product.distance}</p>

          <div className="product-card-stock">
            <span className="text-xs text-muted-dark">Disponível: {product.available}</span>
            <span className="text-xs text-muted-dark">/</span>
            <span className="text-xs text-muted-dark">Qtd. min: {product.minimum}</span>
          </div>

          <p className="title-lg">{product.priceRange}</p>
        </article>
      </a>
    </li>
  );
}

export default ProductCard;
