// Arquivo estava vazio (0 linhas) e nem era importado em HowItWorksPage.jsx —
// como 'compradores' é a aba ativa por padrão, a seção inteira ficava em
// branco ao carregar a página. Reconstruído a partir de
// pages/how-it-works-page.html (data-panel="compradores").
function BuyerBenefits({ activeTab }) {
  if (activeTab !== 'compradores') {
    return null
  }

  return (
    <div className="bento" data-panel="compradores">

      <article className="bento-card bento-card-01">
        <div className="bento-card-body">
          <span className="bento-card-num">01</span>

          <h2 className="bento-card-title">
            Preço direto do produtor
          </h2>

          <p className="bento-card-desc">
            Sem intermediários. Negocie diretamente com quem cultiva e reduza seus custos operacionais em até 32%.
          </p>
        </div>

        <img
          className="bento-card-hero-img"
          src={`${import.meta.env.BASE_URL}images/card-01-compradores.png`}
          alt="Comprador e produtor negociando diretamente"
        />

        <div className="bento-card-stat">
          <p className="bento-card-stat-num">32%↓</p>
          <p className="bento-card-stat-label">Margem média recuperada</p>
        </div>
      </article>

      <article className="bento-card bento-card-02">
        <div className="bento-card-body">
          <span className="bento-card-num">02</span>

          <h2 className="bento-card-title">
            Variedade de opções
          </h2>

          <p className="bento-card-desc">
            Centenas de produtores cadastrados, com diferentes espécies, variedades e volumes prontos pra cotar.
          </p>
        </div>

        <div className="bento-card-producers">
          <div className="bento-avatars">
            <div className="bento-avatar">FA</div>
            <div className="bento-avatar">JM</div>
            <div className="bento-avatar">SC</div>
            <div className="bento-avatar">CR</div>
            <div className="bento-avatar">+847</div>
          </div>

          <div className="bento-producers-count">
            <p className="bento-card-stat-num">850+</p>
            <p className="bento-card-stat-label">Produtores ativos</p>
          </div>
        </div>
      </article>

      <article className="bento-card bento-card-03">
        <div className="bento-card-body">
          <span className="bento-card-num">03</span>

          <h2 className="bento-card-title">
            Qualidade verificada
          </h2>

          <p className="bento-card-desc">
            Cada lote vem com ficha técnica completa: umidade, pH, altitude de cultivo, percentual de avarias e mais.
          </p>
        </div>

        <div className="bento-tech-table">
          <div className="bento-tech-row">
            <span className="bento-tech-label">Umidade</span>
            <span className="bento-tech-value">12,4 %</span>
          </div>
          <hr className="bento-tech-divider" />
          <div className="bento-tech-row">
            <span className="bento-tech-label">pH do solo</span>
            <span className="bento-tech-value">6,2</span>
          </div>
          <hr className="bento-tech-divider" />
          <div className="bento-tech-row">
            <span className="bento-tech-label">Altitude</span>
            <span className="bento-tech-value">920 m</span>
          </div>
          <hr className="bento-tech-divider" />
          <div className="bento-tech-row">
            <span className="bento-tech-label">Avarias</span>
            <span className="bento-tech-value">0,8 %</span>
          </div>
        </div>
      </article>

      <article className="bento-card bento-card-04">
        <div className="bento-card-04-inner">
          <div className="bento-card-04-text">
            <div className="bento-card-body">
              <span className="bento-card-num">04</span>

              <h2 className="bento-card-title">
                Rastreabilidade completa
              </h2>

              <p className="bento-card-desc">
                Saiba exatamente de onde vem cada lote. Localização, método de cultivo e histórico do produtor.
              </p>
            </div>

            <div className="bento-badge">
              <span className="icon icon-12" aria-hidden="true">
                <svg viewBox="0 -960 960 960">
                  <path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z" />
                </svg>
              </span>
              Lote · MG-CRX-0418
            </div>
          </div>

          <img
            className="bento-card-04-img"
            src={`${import.meta.env.BASE_URL}images/altterra_rastreio_map_transparent.svg`}
            alt=""
          />
        </div>
      </article>

      <article className="bento-card bento-card-05">
        <div className="bento-card-body">
          <span className="bento-card-num">05</span>

          <h2 className="bento-card-title">
            Compromisso ESG
          </h2>

          <p className="bento-card-desc">
            Filtre por certificações sustentáveis e mostre ao seu cliente final que sua cadeia é responsável.
          </p>
        </div>

        <div className="bento-tags">
          {['Rainforest Alliance', 'Orgânico IBD', 'Fairtrade', 'Carbono Neutro', 'FSC'].map((label) => (
            <div className="bento-tag" key={label}>
              <span className="icon icon-12" aria-hidden="true">
                <svg viewBox="0 -960 960 960">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </span>
              {label}
            </div>
          ))}

          <div className="bento-tag">E muito mais...</div>
        </div>
      </article>

    </div>
  )
}

export default BuyerBenefits
