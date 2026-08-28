import { Fragment } from 'react';

// Corresponde aos dois .content-block da coluna direita: "Detalhes" (a <dl>)
// e "Fornecedor" (o .supplier-mini-profile). Mantidos juntos porque no HTML
// original são vizinhos e semanticamente parte do mesmo "resumo rápido" —
// diferente do .supplier-full-profile grande, que é o componente SupplierProfile.
function ProductDetails({ details, supplier }) {
  return (
    <>
      <div className="content-block">
        <h3 className="title-xl">Detalhes</h3>

        <dl className="details">
          {details.map((item) => (
            // <dt>/<dd> precisam ficar como irmãos diretos de <dl> (HTML original),
            // por isso Fragment em vez de agrupar numa <div>.
            <Fragment key={item.label}>
              <dt className="text-semibold">{item.label}</dt>
              <dd>{item.value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <div className="content-block">
        <h3 className="title-xl">Fornecedor</h3>

        <div className="supplier-mini-profile">
          <img className="supplier-mini-image" src={supplier.logo} alt="Logo do fornecedor" />

          <div className="supplier-mini-info">
            <div className="supplier-mini-name-rating">
              <div className="supplier-name-badge">
                {supplier.name}
                <span className="icon icon-16">
                  <svg viewBox="0 0 16 15">
                    <path d="M5.53704 15L4.14815 12.7206L1.53704 12.1324L1.77778 9.48529L0 7.5L1.77778 5.51471L1.53704 2.86765L4.14815 2.27941L5.53704 0L8 1.04779L10.463 0L11.8519 2.27941L14.463 2.86765L14.2222 5.51471L16 7.5L14.2222 9.48529L14.463 12.1324L11.8519 12.7206L10.463 15L8 13.9522L5.53704 15ZM6.07407 13.3272L8 12.5184L9.92593 13.3272L11 11.5441L13.037 11.0846L12.8519 9.04412L14.2222 7.5L12.8519 5.95588L13.037 3.91544L11 3.45588L9.92593 1.67279L8 2.48162L6.07407 1.67279L5 3.45588L2.96296 3.89706L3.14815 5.95588L1.77778 7.5L3.16667 9.04412L2.96296 11.1029L5 11.5625L6.07407 13.3272ZM7.05556 10.1471L11.463 5.79044L10.5185 4.85294L7.05556 8.27206L5.48148 6.72794L4.53704 7.66544L7.05556 10.1471Z" />
                  </svg>
                </span>
              </div>

              <span>•</span>

              <div className="supplier-rating-mini">
                <span className="icon icon-16">
                  <svg viewBox="0 0 16 16">
                    <path d="M5.875 11.9792L8 10.3542L10.125 11.9792L9.33333 9.39583L11.7083 7.5H8.85417L8 4.875L7.16667 7.5H4.29167L6.6875 9.39583L5.875 11.9792ZM3.0625 16L4.9375 9.9375L0 6H6.0625L8 0L9.9375 6H16L11.0625 9.9375L12.9375 16L8 12.25L3.0625 16Z" />
                  </svg>
                </span>
                <span>{supplier.rating}</span>
              </div>
            </div>

            <div className="supplier-supplier-badge-list">
              {supplier.badges.map((badge) => (
                <span className="supplier-badge" key={badge}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
