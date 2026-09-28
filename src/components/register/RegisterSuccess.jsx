import { Link } from 'react-router-dom'

// Antes tinha `hidden` fixo no JSX — nunca aparecia, porque nada
// controlava esse atributo. Agora quem decide se isso renderiza é o
// RegisterPage (só monta este componente quando submitted === true).
//
// `productId` é o produto que acabou de ser criado de verdade no catálogo
// (ver RegisterPage.handlePublish) — o link "Ver meu produto" leva direto
// pra página dele, em vez de um link fixo genérico como antes.
function RegisterSuccess({ productId }) {
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
        Seu produto já está disponível no marketplace.
      </p>

      <div className="register-success-actions">

        <Link
          to="/"
          className="button-wizard-ghost"
        >
          Voltar ao início
        </Link>

        <Link
          to={`/product/${productId}`}
          className="button-wizard-next"
        >
          Ver meu produto
        </Link>

      </div>
    </section>
  )
}

export default RegisterSuccess