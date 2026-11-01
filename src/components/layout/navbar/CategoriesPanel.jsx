import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_CATEGORIES, ALL_REGIONS, categories } from '../../../data/categories'
import { useProducts } from '../../../context/useProducts'
import { useFilters } from '../../../context/useFilters'
import { filterProductsByRegion, groupProductsByCategory } from '../../../utils/productFilters'

// Painel "Categorias" da navbar. O layout é o mesmo de antes (barra lateral
// + grupos com quadradinhos), mas agora com dados reais:
//   - cada quadradinho é um PRODUTO do catálogo (foto de capa + nome), que
//     leva à página dele; os produtos entram no grupo da categoria
//     escolhida ao anunciar;
//   - os botões da barra lateral são o filtro: "Todos os produtos" mostra
//     todas as categorias que têm produto; uma categoria mostra só ela;
//   - a região escolhida na navbar também vale aqui.
function CategoriesPanel() {
  const [selected, setSelected] = useState(ALL_CATEGORIES)
  const detailsRef = useRef(null)
  const { products } = useProducts()
  const { region, setRegion, isRegionFiltered } = useFilters()

  const groups = groupProductsByCategory(filterProductsByRegion(products, region), categories)
  // Em "Todos os produtos" categorias vazias são escondidas (senão sobrariam
  // 7 blocos vazios); ao escolher uma categoria específica, ela aparece
  // mesmo vazia, com uma mensagem.
  const shownGroups =
    selected === ALL_CATEGORIES
      ? groups.filter((group) => group.products.length > 0)
      : groups.filter((group) => group.name === selected)
  const totalVisible = groups.reduce((sum, group) => sum + group.products.length, 0)

  // O painel é um <details>: ao abrir um produto ele fecha, senão ficaria
  // aberto por cima da página de destino.
  function closePanel() {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details className="categories-bar" ref={detailsRef}>
      <summary className="categories-toggle">
        <span className="icon icon-20">
          <svg viewBox="0 0 16 16">
            <path d="M1.71429 16C1.25397 16 0.853175 15.8294 0.511905 15.4881C0.170635 15.1468 0 14.746 0 14.2857V1.71429C0 1.24286 0.170635 0.839286 0.511905 0.503572C0.853175 0.167858 1.25397 0 1.71429 0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.746 15.8321 15.1468 15.4964 15.4881C15.1607 15.8294 14.7571 16 14.2857 16H1.71429ZM1.71429 14.2857H14.2857V10.8571H11.619C11.254 11.5397 10.75 12.0913 10.1071 12.5119C9.46429 12.9325 8.7619 13.1429 8 13.1429C7.22222 13.1429 6.5119 12.9365 5.86905 12.5238C5.22619 12.1111 4.73016 11.5556 4.38095 10.8571H1.71429V14.2857ZM9.61905 10.7619C10.0635 10.3175 10.2857 9.77778 10.2857 9.14286H14.2857V1.71429H1.71429V9.14286H5.71429C5.71429 9.77778 5.93651 10.3175 6.38095 10.7619C6.8254 11.2063 7.36508 11.4286 8 11.4286C8.63492 11.4286 9.1746 11.2063 9.61905 10.7619ZM3.42857 7.71429H12.5714V6H3.42857V7.71429ZM3.42857 4.85714H12.5714V3.14286H3.42857V4.85714Z" />
          </svg>
        </span>

        <span className="categories-label">Categorias</span>

        <span className="icon icon-12">
          <svg viewBox="0 0 16 10">
            <path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" />
          </svg>
        </span>
      </summary>

      <div className="categories-panel">
        <nav className="categories-sidebar">
          {[ALL_CATEGORIES, ...categories.map((category) => category.name)].map((name) => {
            const count =
              name === ALL_CATEGORIES
                ? totalVisible
                : groups.find((group) => group.name === name)?.products.length ?? 0
            return (
              <button
                key={name}
                type="button"
                className={`categories-nav-item${name === selected ? ' active' : ''}`}
                aria-pressed={name === selected}
                onClick={() => setSelected(name)}
              >
                {name}
                <span className="categories-nav-count">{count}</span>
              </button>
            )
          })}
        </nav>

        <div className="categories-content">
          {isRegionFiltered && (
            <p className="categories-region-note">Mostrando produtos de {region}.</p>
          )}

          {shownGroups.length === 0 ? (
            <div className="categories-empty">
              <p>
                {isRegionFiltered
                  ? `Nenhum produto cadastrado em ${region}.`
                  : 'Ainda não há produtos cadastrados.'}
              </p>
              {isRegionFiltered ? (
                <button type="button" className="categories-empty-link" onClick={() => setRegion(ALL_REGIONS)}>
                  Ver todas as regiões
                </button>
              ) : (
                <Link to="/register" className="categories-empty-link" onClick={closePanel}>
                  Anunciar produto
                </Link>
              )}
            </div>
          ) : (
            shownGroups.map((group) => (
              <section className="category-group" key={group.name}>
                <h3 className="title-xl">{group.name}</h3>

                {group.products.length === 0 ? (
                  <p className="categories-empty-text">
                    Ainda não há produtos nesta categoria{isRegionFiltered ? ' nesta região' : ''}.
                  </p>
                ) : (
                  <div className="category-items">
                    {group.products.map((product) => (
                      <Link
                        to={`/product/${product.id}`}
                        className="category-item"
                        key={product.id}
                        title={product.name}
                        onClick={closePanel}
                      >
                        <figure>
                          <div className="category-item-img">
                            <img src={product.cardSummary.image} alt="" />
                          </div>
                          <figcaption>{product.name}</figcaption>
                        </figure>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </details>
  )
}

export default CategoriesPanel
