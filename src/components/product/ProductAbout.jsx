import { forwardRef } from 'react';

// forwardRef porque o scroll-spy (useScrollSpyTabs) precisa medir a posição
// desta seção na página — mesmo papel que document.querySelector('.product-content-block')
// cumpria no JS original.
const ProductAbout = forwardRef(function ProductAbout({ description, cultivation }, ref) {
  return (
    <div className="product-content-block" ref={ref}>
      <h2 className="title-2xl">Sobre o produto</h2>

      <div className="content-block">
        <h3 className="title-xl">Descrição</h3>
        <p className="text-paragraph">{description}</p>
      </div>

      <div className="content-block">
        <h3 className="title-xl">Dados do cultivo</h3>

        <table className="cultivation-table">
          <caption className="sr-only">Dados do cultivo do Tomate Carmem</caption>
          {cultivation.map((row) => (
            <tr key={row.label}>
              <th className="cultivation-table-header">{row.label}</th>
              <td className="cultivation-table-data">{row.value}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
});

export default ProductAbout;
