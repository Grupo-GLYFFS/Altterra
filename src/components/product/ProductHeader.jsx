import ProductActions from './ProductActions';
import ProductSummary from './ProductSummary';

// Une .product-header (h1 + ações) e .product-summary num único wrapper,
// espelhando .product-header-container do HTML original.
function ProductHeader({ name, summary }) {
  return (
    <div className="product-header-container">
      <div className="product-header">
        <h1 className="title-2xl">{name}</h1>
        <ProductActions />
      </div>

      <ProductSummary rating={summary.rating} reviewCount={summary.reviewCount} soldStat={summary.soldStat} />
    </div>
  );
}

export default ProductHeader;
