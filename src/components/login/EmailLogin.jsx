function EmailLogin() {
  return (
    <form className="login-email">
      <label htmlFor="login-email" className="sr-only">
        Email ou telefone
      </label>

      <input
        id="login-email"
        type="email"
        className="text-input"
        placeholder="Digite seu número de telefone ou email"
      />

      <button className="button-primary" type="submit">
        Continuar
      </button>

      <small className="text-xs text-muted">
        Ao continuar, você aceita os{' '}
        <a className="button-link" href="">
          Termos
        </a>{' '}
        e{' '}
        <a className="button-link" href="">
          Privacidade
        </a>{' '}
        da Altterra.
      </small>
    </form>
  )
}

export default EmailLogin