import { Link } from 'react-router-dom'

// Os itens do breadcrumb não têm destino próprio (href vazio): um <a href="">
// recarregava a página atual. O primeiro ("Mercado padrão") leva à Home; a
// categoria não tem página própria, então vira texto simples.
function ProductBreadcrumb({ items, current }) {
  return (
    <nav className="breadcrumb" aria-label="Localização atual">
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {item.label !== items[0].label && (
              <span className="icon icon-10" aria-hidden="true">
                <svg viewBox="0 0 10 16">
                  <path d="M6.49485 8L0 1.7L1.75258 0L10 8L1.75258 16L0 14.3L6.49485 8Z" />
                </svg>
              </span>
            )}
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : index === 0 ? (
              <Link to="/">{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
        <li>
          <span className="icon icon-10" aria-hidden="true">
            <svg viewBox="0 0 10 16">
              <path d="M6.49485 8L0 1.7L1.75258 0L10 8L1.75258 16L0 14.3L6.49485 8Z" />
            </svg>
          </span>
          <span className="text-semibold" aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}

export default ProductBreadcrumb;
