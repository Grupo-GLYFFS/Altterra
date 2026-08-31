// Reescrito: a versão anterior usava classes inventadas (bento-ngo-01/02/03,
// que não existem nem no CSS nem no HTML original — a seção de ONGs usa
// .bento-card genérico, sem sufixo numerado, diferente da seção de
// fornecedores) e um texto completamente diferente do original em
// pages/how-it-works-page.html. Conteúdo e estrutura abaixo replicam o
// HTML original exatamente.
function NgoBenefits({ activeTab }) {
  if (activeTab !== 'ongs') {
    return null
  }

  return (
    <div className="bento bento-ngo" data-panel="ongs">

      <article className="bento-card">
        <div className="bento-card-body">
          <span className="bento-card-num">01</span>

          <h2 className="bento-card-title">
            AgroLink: Hub de Doações
          </h2>

          <p className="bento-card-desc">
            Conectamos sua ONG a produtos fora do padrão estético que seriam descartados, fortalecendo a segurança alimentar e diminuindo o desperdício no campo. Acesso a alimentos de qualidade garantida.
          </p>
        </div>

        <img
          className="bento-img bento-ngo-img"
          src={`${import.meta.env.BASE_URL}images/card-01-ongs.png`}
          alt="Diagrama de conexão entre produtor e ONG"
        />
      </article>

      <article className="bento-card">
        <div className="bento-card-body">
          <span className="bento-card-num">02</span>

          <h2 className="bento-card-title">
            Impacto Social
          </h2>

          <p className="bento-card-desc">
            Resultados mensuráveis a cada lote recebido, ajudando na prestação de contas.
          </p>
        </div>

        <div className="bento-tech-table">
          <div className="bento-tech-row">
            <span className="bento-tech-label">Refeições salvas</span>
            <span className="bento-tech-value">5.000+</span>
          </div>

          <hr className="bento-tech-divider" />

          <div className="bento-tech-row">
            <span className="bento-tech-label">Alimentos resgatados</span>
            <span className="bento-tech-value">2 Ton</span>
          </div>
        </div>
      </article>

      <article className="bento-card">
        <div className="bento-card-body">
          <span className="bento-card-num">03</span>

          <h2 className="bento-card-title">
            Credibilidade para Parceiros
          </h2>

          <p className="bento-card-desc">
            Fornecedores parceiros ganham o badge "Doador Ativo", reforçando o compromisso com a ODS 2 (Fome Zero) de forma transparente e direta.
          </p>
        </div>

        <div className="bento-badge bento-badge-large">Doador Ativo</div>
      </article>

    </div>
  )
}

export default NgoBenefits
