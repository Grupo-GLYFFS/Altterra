function RegisterHeader() {
  return (
    <header className="register-header">

      <a
        href="/"
        className="button-back"
        aria-label="Voltar para a página inicial"
      >
        <span className="icon icon-24">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </span>
      </a>

      <h1 className="register-title">
        Cadastrar produto
      </h1>

    </header>
  )
}

export default RegisterHeader