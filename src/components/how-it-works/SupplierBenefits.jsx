function SupplierBenefits({ activeTab }) {
  if (activeTab !== 'fornecedores') {
    return null
  }
  return (
    <div className="bento" data-panel="fornecedores">

      {/* Card 01 */}
      <article className="bento-card bento-supplier-01">

        <div className="bento-card-body">
          <span className="bento-card-num">01</span>

          <h2 className="bento-card-title">
            Preço Justo
          </h2>

          <p className="bento-card-desc">
            Negocie sem intermediários, ficando com 100% da sua margem.
          </p>
        </div>

        <div className="bento-card-stat">
          <p className="bento-card-stat-num">100%</p>

          <p className="bento-card-stat-label">
            Margem sua
          </p>
        </div>

      </article>

      {/* Card 02 */}
      <article className="bento-card bento-supplier-02">

        <div className="bento-card-04-inner">

          <div className="bento-card-04-text bento-supplier-02-text">

            <div className="bento-card-body">
              <span className="bento-card-num">02</span>

              <h2 className="bento-card-title">
                Outlet Sustentável
              </h2>

              <p className="bento-card-desc">
                Possibilidade de vender excedentes de safra e produtos
                com pequenas imperfeições estéticas. O que seria descarte
                vira receita para a sua propriedade.
              </p>
            </div>

            <div className="bento-tags">

              <div className="bento-tag">
                Excedentes
              </div>

              <div className="bento-tag">
                Fora do Padrão
              </div>

              <div className="bento-tag">
                Nova Receita
              </div>

            </div>

          </div>

          <div className="bento-supplier-02-img-wrapper">

            <img
              className="bento-img"
              src="/images/card-02-fornecedores.png"
              alt="Gráfico de redução de desperdício de safra"
            />

          </div>

        </div>

      </article>

      {/* Card 03 */}
      <article className="bento-card bento-supplier-03">

        <div className="bento-card-body">

          <span className="bento-card-num">03</span>

          <h2 className="bento-card-title">
            Compradores Qualificados
          </h2>

          <p className="bento-card-desc">
            Conexão direta a grandes redes B2B, sem intermediários.
            Alcance visibilidade nacional e garanta o preço justo
            que você merece.
          </p>

        </div>

        <img
          className="bento-img bento-supplier-03-img"
          src="/images/card-03-fornecedores.png"
          alt="Mapa de distribuição nacional dos compradores"
        />

      </article>

      {/* Card 04 */}
      <article className="bento-card bento-supplier-04">

        <div className="bento-card-body">

          <span className="bento-card-num">04</span>

          <h2 className="bento-card-title">
            Rastreabilidade
          </h2>

          <p className="bento-card-desc">
            Sua história gera credibilidade e atrai mais vendas corporativas.
          </p>

        </div>

        <img
          className="bento-card-hero-img"
          src="/images/card-04-fornecedores.png"
          alt="Histórico de rastreabilidade do lote"
        />

        <div className="bento-badge">
          Lote 100% rastreado
        </div>

      </article>

    </div>
  )
}

export default SupplierBenefits