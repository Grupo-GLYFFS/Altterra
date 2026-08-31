import { Fragment } from 'react';

// O HTML original intercala <hr class="vertical-line"> ENTRE os preços
// (não depois do último). Reproduzido com index > 0 antes de cada item,
// dentro de um Fragment (não uma <div>), para manter .product-price e
// .vertical-line como irmãos diretos de .product-prices — igual ao HTML —
// já que o CSS pode depender disso (flex/gap entre filhos diretos).
function ProductPrices({ prices }) {
  return (
    <div className="product-prices">
      {prices.map((priceRange, index) => (
        <Fragment key={priceRange.label}>
          {index > 0 && <hr className="vertical-line" />}
          <div className="product-price">
            <span className="text-muted">{priceRange.label}</span>
            <span className="title-2xl">{priceRange.price}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default ProductPrices;
