import { categories } from '../../../data/categories'

// Reescrito: a versão anterior tinha só 1 dos 9 grupos (Frutas, e com
// apenas 3 dos 17 itens), usava emojis (☰, ▼) em vez dos SVGs originais,
// e a barra lateral de categorias só listava os títulos sem o conteúdo
// correspondente. No HTML original as 9 seções aparecem todas de uma vez
// dentro de .categories-content (a barra lateral é puramente decorativa —
// sem onClick nenhum no JS original), então não foi adicionada nenhuma
// lógica de clique/scroll que não existia antes.
function CategoriesPanel() {
  return (
    <details className="categories-bar">
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
          {categories.map((category, index) => (
            <button
              key={category.name}
              type="button"
              className={`categories-nav-item${index === 0 ? ' active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </nav>

        <div className="categories-content">
          {categories.map((category) => (
            <section className="category-group" key={category.name}>
              <h3 className="title-xl">{category.name}</h3>

              <div className="category-items">
                {category.items.map((item) => (
                  <a href="#" className="category-item" key={item}>
                    <figure>
                      <div className="category-item-img"></div>
                      <figcaption>{item}</figcaption>
                    </figure>
                  </a>
                ))}

                <a href="#" className="category-item category-item-more">
                  <figure>
                    <div className="category-item-img"></div>
                    <figcaption>
                      Ver mais{' '}
                      <span className="icon icon-12">
                        <svg viewBox="0 0 16 10">
                          <path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" />
                        </svg>
                      </span>
                    </figcaption>
                  </figure>
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </details>
  )
}

export default CategoriesPanel
