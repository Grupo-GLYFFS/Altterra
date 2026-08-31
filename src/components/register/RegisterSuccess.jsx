// Antes tinha `hidden` fixo no JSX — nunca aparecia, porque nada
// controlava esse atributo. Agora quem decide se isso renderiza é o
// RegisterPage (só monta este componente quando submitted === true).
function RegisterSuccess() {
  return (
    <section
      className="register-success"
      id="register-success"
    >
      <span
        className="icon icon-40 register-success-icon"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.42z" />
        </svg>
      </span>

      <h2 className="title-2xl">
        Produto publicado!
      </h2>

      <p className="text-muted">
        Seu anúncio foi enviado para revisão e logo estará disponível no marketplace.
      </p>

      <div className="register-success-actions">

        <a
          href="/"
          className="button-wizard-ghost"
        >
          Voltar ao início
        </a>

        <a
          href="/product"
          className="button-wizard-next"
        >
          Ver exemplo de anúncio
        </a>

      </div>
    </section>
  )
}

export default RegisterSuccess