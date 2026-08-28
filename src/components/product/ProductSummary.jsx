import StarIcon from './StarIcon';

// Corresponde a .product-summary no HTML: 5 estrelas fixas (decorativas,
// não refletem a nota real — mesmo comportamento do original), nota,
// contagem de avaliações e o "bullet" de estatística de vendas.
function ProductSummary({ rating, reviewCount, soldStat }) {
  return (
    <div className="product-summary">
      <div className="ratings">
        <div className="stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} size={16} />
          ))}
        </div>

        <p>{rating}</p>

        <button className="button-product-ratings" type="button">({reviewCount} Avaliações)</button>
      </div>

      <p className="product-summary-bullet">•</p>

      <p className="product-summary-stat">{soldStat}</p>
    </div>
  );
}

export default ProductSummary;
