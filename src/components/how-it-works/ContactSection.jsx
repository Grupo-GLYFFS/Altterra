import { useRef, useState } from 'react'

// Validadores idênticos aos de js/pages/how-it-works-page.js.
function validateName(value) {
  const name = value.trim()
  if (name === '') return 'Informe seu nome.'
  const parts = name.split(/\s+/)
  if (parts.length < 2) return 'Informe nome e sobrenome.'
  const allowed = /^[A-Za-zÀ-ÿ'’.-]+$/
  const countLetters = (part) => (part.match(/[A-Za-zÀ-ÿ]/g) || []).length
  if (!parts.every((part) => allowed.test(part) && countLetters(part) >= 2)) {
    return 'Cada nome deve ter ao menos 2 letras.'
  }
  return ''
}

function validateEmail(value) {
  const email = value.trim()
  if (email === '') return 'Informe seu email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido.'
  return ''
}

function validateSubject(value) {
  const subject = value.trim()
  if (subject === '') return 'Informe o assunto.'
  if (subject.length < 3) return 'O assunto deve ter ao menos 3 caracteres.'
  return ''
}

const MAX_MESSAGE = 500

function validateMessage(value) {
  const message = value.trim()
  if (message === '') return 'Escreva sua mensagem.'
  if (message.length > MAX_MESSAGE) return `A mensagem deve ter no máximo ${MAX_MESSAGE} caracteres.`
  return ''
}

function ContactSection() {
  // formRef substitui os document.getElementById do original — os campos
  // continuam não-controlados, igual ao HTML puro.
  const formRef = useRef(null)
  const counterRef = useRef(null)
  const [isSent, setIsSent] = useState(false)
  const sentTimeoutRef = useRef(null)

  const FIELDS = [
    { id: 'contact-name', validate: validateName },
    { id: 'contact-email', validate: validateEmail },
    { id: 'contact-subject', validate: validateSubject },
    { id: 'contact-message', validate: validateMessage },
  ]

  function setFieldError(id, message) {
    const input = formRef.current.elements[id]
    const errorEl = formRef.current.querySelector(`#error-${id.replace('contact-', '')}`)
    if (!input || !errorEl) return
    if (message) {
      input.classList.add('input-invalid')
      input.setAttribute('aria-invalid', 'true')
      errorEl.textContent = message
      errorEl.hidden = false
    } else {
      input.classList.remove('input-invalid')
      input.removeAttribute('aria-invalid')
      errorEl.textContent = ''
      errorEl.hidden = true
    }
  }

  function updateCounter() {
    const length = formRef.current.elements['contact-message'].value.length
    if (counterRef.current) {
      counterRef.current.textContent = `${length} / ${MAX_MESSAGE}`
      counterRef.current.classList.toggle('counter-limit', length >= MAX_MESSAGE)
    }
  }

  // Revalida ao sair do campo, e enquanto digita só se já estava com erro
  // visível — igual ao par de listeners 'blur'/'input' do original.
  function handleBlur(event) {
    const field = FIELDS.find((f) => f.id === event.target.id)
    if (field) setFieldError(field.id, field.validate(event.target.value))
  }

  function handleFieldInput(event) {
    if (event.target.id === 'contact-message') updateCounter()
    const field = FIELDS.find((f) => f.id === event.target.id)
    if (field && event.target.classList.contains('input-invalid')) {
      setFieldError(field.id, field.validate(event.target.value))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = formRef.current

    let firstInvalid = null
    FIELDS.forEach((field) => {
      const input = form.elements[field.id]
      const message = field.validate(input.value)
      setFieldError(field.id, message)
      if (message && !firstInvalid) firstInvalid = input
    })

    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    // Envio simulado — sem backend nesta fase, igual ao original.
    form.reset()
    updateCounter()
    setIsSent(true)
    clearTimeout(sentTimeoutRef.current)
    sentTimeoutRef.current = setTimeout(() => setIsSent(false), 3000)
  }

  return (
    <section className="section-contact">

      <h2 className="contact-title">
        Ainda tem dúvidas?
      </h2>

      <div className="contact-grid">

        {/* WhatsApp */}
        <article className="contact-card">

          <div className="contact-card-header">

            <span className="icon icon-40" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M13.6036 2.325C12.1071 0.825 10.1143 0 7.99643 0C3.625 0 0.0678571 3.55714 0.0678571 7.92857C0.0678571 9.325 0.432143 10.6893 1.125 11.8929L0 16L4.20357 14.8964C5.36071 15.5286 6.66429 15.8607 7.99286 15.8607H7.99643C12.3643 15.8607 16 12.3036 16 7.93214C16 5.81429 15.1 3.825 13.6036 2.325ZM7.99643 14.525C6.81071 14.525 5.65 14.2071 4.63929 13.6071L4.4 13.4643L1.90714 14.1179L2.57143 11.6857L2.41429 11.4357C1.75357 10.3857 1.40714 9.175 1.40714 7.92857C1.40714 4.29643 4.36429 1.33929 8 1.33929C9.76071 1.33929 11.4143 2.025 12.6571 3.27143C13.9 4.51786 14.6643 6.17143 14.6607 7.93214C14.6607 11.5679 11.6286 14.525 7.99643 14.525ZM11.6107 9.58929C11.4143 9.48929 10.4393 9.01071 10.2571 8.94643C10.075 8.87857 9.94286 8.84643 9.81072 9.04643C9.67857 9.24643 9.3 9.68929 9.18214 9.825C9.06786 9.95714 8.95 9.975 8.75357 9.875C7.58929 9.29286 6.825 8.83571 6.05714 7.51786C5.85357 7.16786 6.26071 7.19286 6.63929 6.43571C6.70357 6.30357 6.67143 6.18929 6.62143 6.08929C6.57143 5.98929 6.175 5.01429 6.01071 4.61786C5.85 4.23214 5.68571 4.28571 5.56429 4.27857C5.45 4.27143 5.31786 4.27143 5.18571 4.27143C5.05357 4.27143 4.83929 4.32143 4.65714 4.51786C4.475 4.71786 3.96429 5.19643 3.96429 6.17143C3.96429 7.14643 4.675 8.08929 4.77143 8.22143C4.87143 8.35357 6.16786 10.3536 8.15714 11.2143C9.41429 11.7571 9.90714 11.8036 10.5357 11.7107C10.9179 11.6536 11.7071 11.2321 11.8714 10.7679C12.0357 10.3036 12.0357 9.90714 11.9857 9.825C11.9393 9.73571 11.8071 9.68571 11.6107 9.58929Z" />
              </svg>
            </span>

            <h2 className="title-2xl">
              WhatsApp
            </h2>

          </div>

          <div className="contact-info">
            <p className="title-lg">
              Horário de atendimento
            </p>

            <p>
              Segunda - Sexta : 8h–19h
            </p>
          </div>

          <p className="contact-value">
            11 94040-8800
          </p>

          <a
            href="https://wa.me/5511940408800"
            className="button-contact-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir conversa

            <span className="icon icon-16" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M12.1667 7H0V9H12.1667L6.58333 14.5833L8 16L16 8L8 0L6.58333 1.41667L12.1667 7Z" />
              </svg>
            </span>
          </a>

        </article>

        {/* E-mail */}
        <article className="contact-card">

          <div className="contact-card-header">

            <span className="icon icon-40" aria-hidden="true">
              <svg viewBox="0 0 16 12">
                <path d="M1.5 12C1.0875 12 0.734375 11.8531 0.440625 11.5592C0.146875 11.2653 0 10.9119 0 10.4992V1.49417C0 1.08139 0.146875 0.729167 0.440625 0.4375C0.734375 0.145833 1.0875 0 1.5 0H14.5C14.9125 0 15.2656 0.146944 15.5594 0.440833C15.8531 0.734722 16 1.08806 16 1.50083V10.5058C16 10.9186 15.8531 11.2708 15.5594 11.5625C15.2656 11.8542 14.9125 12 14.5 12H1.5ZM8 7L1.5 3.27083V10.5H14.5V3.27083L8 7ZM8 5.22917L14.5 1.5H1.5L8 5.22917ZM1.5 3.27083V1.5V10.5V3.27083Z" />
              </svg>
            </span>

            <h2 className="title-2xl">
              E-mail
            </h2>

          </div>

          <p className="contact-value">
            ajuda@altterra.com.br
          </p>

          <a
            href="mailto:ajuda@altterra.com.br"
            className="button-contact-action"
          >
            Enviar e-mail

            <span className="icon icon-16" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M12.1667 7H0V9H12.1667L6.58333 14.5833L8 16L16 8L8 0L6.58333 1.41667L12.1667 7Z" />
              </svg>
            </span>
          </a>

        </article>

        {/* Formulário */}
        <article className="contact-card contact-form-card">

          <div className="contact-card-header">

            <span className="icon icon-40" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2z" />
              </svg>
            </span>

            <h2 className="title-2xl">
              Formulário
            </h2>

          </div>

          <form
            className="contact-form"
            method="post"
            action=""
            noValidate
            ref={formRef}
            onSubmit={handleSubmit}
          >

            <div className="contact-form-fields">

              <div className="form-row">

                <div className="form-field">

                  <label
                    htmlFor="contact-name"
                    className="text-semibold"
                  >
                    Nome
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    className="form-input"
                    placeholder="Nome e sobrenome"
                    required
                    maxLength="100"
                    autoComplete="name"
                    aria-describedby="error-name"
                    onBlur={handleBlur}
                    onChange={handleFieldInput}
                  />

                  <span
                    className="form-error"
                    id="error-name"
                    role="alert"
                    hidden
                  />

                </div>

                <div className="form-field">

                  <label
                    htmlFor="contact-email"
                    className="text-semibold"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    className="form-input"
                    placeholder="email@empresa.com"
                    required
                    autoComplete="email"
                    aria-describedby="error-email"
                    onBlur={handleBlur}
                    onChange={handleFieldInput}
                  />

                  <span
                    className="form-error"
                    id="error-email"
                    role="alert"
                    hidden
                  />

                </div>

              </div>

              <div className="form-field">

                <label
                  htmlFor="contact-subject"
                  className="text-semibold"
                >
                  Assunto
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  className="form-input"
                  placeholder="Assunto"
                  required
                  maxLength="200"
                  aria-describedby="error-subject"
                  onBlur={handleBlur}
                  onChange={handleFieldInput}
                />

                <span
                  className="form-error"
                  id="error-subject"
                  role="alert"
                  hidden
                />

              </div>

              <div className="form-field">

                <label
                  htmlFor="contact-message"
                  className="text-semibold"
                >
                  Mensagem
                </label>

                <textarea
                  id="contact-message"
                  className="form-input form-textarea"
                  placeholder="Mensagem..."
                  required
                  maxLength="500"
                  aria-describedby="error-message"
                  onBlur={handleBlur}
                  onChange={handleFieldInput}
                />

                <div className="form-field-footer">

                  <span
                    className="form-error"
                    id="error-message"
                    role="alert"
                    hidden
                  />

                  <span
                    className="form-counter"
                    id="counter-message"
                    aria-hidden="true"
                    ref={counterRef}
                  >
                    0 / 500
                  </span>

                </div>

              </div>

            </div>

            <button
              type="submit"
              className={`button-contact-action${isSent ? ' is-sent' : ''}`}
              disabled={isSent}
            >
              {isSent ? (
                <>
                  Mensagem enviada
                  <span className="icon icon-16" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.42z" />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  Enviar mensagem
                  <span className="icon icon-16" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M12.1667 7H0V9H12.1667L6.58333 14.5833L8 16L16 8L8 0L6.58333 1.41667L12.1667 7Z" />
                    </svg>
                  </span>
                </>
              )}
            </button>

          </form>

        </article>

      </div>

    </section>
  )
}

export default ContactSection