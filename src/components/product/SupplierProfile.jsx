import { forwardRef } from 'react';

const SupplierProfile = forwardRef(function SupplierProfile({ supplier }, ref) {
  return (
    <div className="supplier-full-profile" ref={ref}>
      <div className="supplier-header">
        <h2 className="title-2xl">Conheça o fornecedor</h2>

        <button className="button-see-supplier-profile" type="button">
          <span className="icon icon-16">
            <svg viewBox="0 0 16 11">
              <path d="M10.6667 11L9.25 9.53906L12.1667 6.53125H0V4.46875H12.1667L9.25 1.46094L10.6667 0L16 5.5L10.6667 11Z" />
            </svg>
          </span>
        </button>
      </div>

      <div className="profile-summary">
        <img className="supplier-full-profile-image" src={supplier.logo} alt={supplier.name} />

        <div className="supplier-info-container">
          <div className="supplier-name-badge">
            <p className="text-xl text-semibold">{supplier.name}</p>

            <span className="icon icon-24">
              <svg viewBox="0 0 16 15">
                <path d="M5.53704 15L4.14815 12.7206L1.53704 12.1324L1.77778 9.48529L0 7.5L1.77778 5.51471L1.53704 2.86765L4.14815 2.27941L5.53704 0L8 1.04779L10.463 0L11.8519 2.27941L14.463 2.86765L14.2222 5.51471L16 7.5L14.2222 9.48529L14.463 12.1324L11.8519 12.7206L10.463 15L8 13.9522L5.53704 15ZM6.07407 13.3272L8 12.5184L9.92593 13.3272L11 11.5441L13.037 11.0846L12.8519 9.04412L14.2222 7.5L12.8519 5.95588L13.037 3.91544L11 3.45588L9.92593 1.67279L8 2.48162L6.07407 1.67279L5 3.45588L2.96296 3.89706L3.14815 5.95588L1.77778 7.5L3.16667 9.04412L2.96296 11.1029L5 11.5625L6.07407 13.3272ZM7.05556 10.1471L11.463 5.79044L10.5185 4.85294L7.05556 8.27206L5.48148 6.72794L4.53704 7.66544L7.05556 10.1471Z" />
              </svg>
            </span>
          </div>

          <div className="supplier-stats">
            <div className="supplier-rating">
              <span className="icon icon-16">
                <svg viewBox="0 0 16 16">
                  <path d="M5.875 11.9792L8 10.3542L10.125 11.9792L9.33333 9.39583L11.7083 7.5H8.85417L8 4.875L7.16667 7.5H4.29167L6.6875 9.39583L5.875 11.9792ZM3.0625 16L4.9375 9.9375L0 6H6.0625L8 0L9.9375 6H16L11.0625 9.9375L12.9375 16L8 12.25L3.0625 16Z" />
                </svg>
              </span>

              <p>{supplier.rating}</p>

              <button className="button-see-supplier-reviews" type="button">({supplier.reviewCount} Avaliações)</button>
            </div>

            <p className="supplier-member-info">•</p>
            <p className="supplier-member-info">Membro do Altterra desde {supplier.memberSince}</p>
          </div>

          <div className="supplier-location">
            <span className="icon icon-16">
              <svg viewBox="0 0 13 16">
                <path d="M7.5625 7.5625C7.85417 7.27083 8 6.91667 8 6.5C8 6.08333 7.85417 5.72917 7.5625 5.4375C7.27083 5.14583 6.91667 5 6.5 5C6.08333 5 5.72917 5.14583 5.4375 5.4375C5.14583 5.72917 5 6.08333 5 6.5C5 6.91667 5.14583 7.27083 5.4375 7.5625C5.72917 7.85417 6.08333 8 6.5 8C6.91667 8 7.27083 7.85417 7.5625 7.5625ZM6.5 14.0208C8.15278 12.5347 9.39931 11.1667 10.2396 9.91667C11.0799 8.66667 11.5 7.54861 11.5 6.5625C11.5 5.10417 11.0243 3.89583 10.0729 2.9375C9.12153 1.97917 7.93056 1.5 6.5 1.5C5.06944 1.5 3.87847 1.97917 2.92708 2.9375C1.97569 3.89583 1.5 5.10417 1.5 6.5625C1.5 7.54861 1.92014 8.66667 2.76042 9.91667C3.60069 11.1667 4.84722 12.5347 6.5 14.0208ZM6.5 16C4.31944 14.1806 2.69097 12.4896 1.61458 10.9271C0.538194 9.36458 0 7.90972 0 6.5625C0 4.70139 0.618056 3.14236 1.85417 1.88542C3.09028 0.628472 4.63889 0 6.5 0C8.34722 0 9.89236 0.628472 11.1354 1.88542C12.3785 3.14236 13 4.70139 13 6.5625C13 7.90972 12.4653 9.36111 11.3958 10.9167C10.3264 12.4722 8.69444 14.1667 6.5 16Z" />
              </svg>
            </span>
            <p>Localizado em {supplier.location}</p>
          </div>
        </div>
      </div>

      <div className="content-block">
        <p className="text-semibold">Descrição:</p>
        <p className="text-paragraph">{supplier.description}</p>
      </div>

      <div className="content-block">
        <p className="text-semibold">Tags Altterra:</p>

        <div className="supplier-badge-list">
          {supplier.badges.map((badge) => (
            <span className="supplier-badge-lg" key={badge}>{badge}</span>
          ))}
          <span className="supplier-badge-lg">Destaques:</span>
        </div>
      </div>

      <div className="content-block">
        <p className="text-semibold">Destaques:</p>

        <div className="features-table-container">
          {supplier.highlights.map((item) => (
            <table className="features-table" key={item.label}>
              <caption className="sr-only">{item.label}</caption>
              <tr>
                <th className="features-table-header">{item.label}</th>
              </tr>
              <tr>
                <td className="features-table-data">{item.value}</td>
              </tr>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
});

export default SupplierProfile;
