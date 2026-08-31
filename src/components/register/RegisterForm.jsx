import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Campos de cada etapa — idêntico a STEP_FIELDS em js/pages/register-page.js.
const STEP_FIELDS = {
  1: ['categoria', 'tipo', 'especie', 'titulo', 'descricao'],
  2: ['endereco', 'cidade', 'estado', 'cep'],
  3: ['preco-min', 'preco-max', 'unidade', 'disponivel', 'minimo'],
  4: ['modo-cultivo', 'tipo-solo', 'ph', 'umidade', 'avarias', 'altitude'],
}

const LABELS = {
  categoria: 'Categoria', tipo: 'Tipo', especie: 'Espécie',
  titulo: 'Título', descricao: 'Descrição',
  endereco: 'Endereço', cidade: 'Cidade', estado: 'Estado', cep: 'CEP',
  'preco-min': 'Preço mínimo', 'preco-max': 'Preço máximo', unidade: 'Unidade',
  disponivel: 'Disponível', minimo: 'Pedido mínimo',
  'modo-cultivo': 'Modo de cultivo', 'tipo-solo': 'Tipo de solo',
  ph: 'pH do solo', umidade: 'Umidade', avarias: 'Avarias', altitude: 'Altitude',
}

// Valida um campo numérico; devolve a mensagem de erro ou '' se válido.
function numberField(value, { min, max, integer, msg } = {}) {
  const raw = value.trim()
  if (raw === '') return msg || 'Campo obrigatório.'
  const n = Number(raw.replace(',', '.'))
  if (Number.isNaN(n)) return 'Informe um número válido.'
  if (integer && !Number.isInteger(n)) return 'Use um número inteiro.'
  if (min != null && n < min) return `Valor mínimo: ${min}.`
  if (max != null && n > max) return `Valor máximo: ${max}.`
  return ''
}

// Cada validador recebe (valor, todosOsValores) e devolve a mensagem ou ''.
const VALIDATORS = {
  categoria: (v) => (v.trim() === '' ? 'Selecione uma categoria.' : ''),
  tipo: (v) => (v.trim() === '' ? 'Informe o tipo.' : ''),
  especie: (v) => (v.trim() === '' ? 'Informe a espécie.' : ''),
  titulo: (v) => {
    const t = v.trim()
    if (t === '') return 'Informe o título.'
    if (t.length < 5) return 'O título deve ter ao menos 5 caracteres.'
    return ''
  },
  descricao: (v) => {
    const t = v.trim()
    if (t === '') return 'Escreva uma descrição.'
    if (t.length < 20) return 'A descrição deve ter ao menos 20 caracteres.'
    if (t.length > 600) return 'Máximo de 600 caracteres.'
    return ''
  },
  endereco: (v) => {
    const t = v.trim()
    if (t === '') return 'Informe o endereço.'
    if (t.length < 5) return 'Endereço muito curto.'
    return ''
  },
  cidade: (v) => (v.trim() === '' ? 'Informe a cidade.' : ''),
  estado: (v) => (v.trim() === '' ? 'Selecione o estado.' : ''),
  cep: (v) => {
    const t = v.trim()
    if (t === '') return 'Informe o CEP.'
    if (!/^\d{5}-?\d{3}$/.test(t)) return 'CEP inválido (use 00000-000).'
    return ''
  },
  'preco-min': (v) => numberField(v, { min: 0.01, msg: 'Informe o preço mínimo.' }),
  'preco-max': (v, all) => {
    const base = numberField(v, { min: 0.01, msg: 'Informe o preço máximo.' })
    if (base) return base
    const min = Number(all['preco-min'])
    if (!Number.isNaN(min) && Number(v) < min) return 'Deve ser maior ou igual ao mínimo.'
    return ''
  },
  unidade: (v) => (v.trim() === '' ? 'Selecione a unidade.' : ''),
  disponivel: (v) => numberField(v, { min: 1, integer: true, msg: 'Informe a quantidade.' }),
  minimo: (v, all) => {
    const base = numberField(v, { min: 1, integer: true, msg: 'Informe o pedido mínimo.' })
    if (base) return base
    const disp = Number(all['disponivel'])
    if (!Number.isNaN(disp) && Number(v) > disp) return 'Não pode exceder o disponível.'
    return ''
  },
  'modo-cultivo': (v) => (v.trim() === '' ? 'Selecione o modo de cultivo.' : ''),
  'tipo-solo': (v) => (v.trim() === '' ? 'Selecione o tipo de solo.' : ''),
  ph: (v) => numberField(v, { min: 0, max: 14, msg: 'Informe o pH.' }),
  umidade: (v) => numberField(v, { min: 0, max: 100, msg: 'Informe a umidade.' }),
  avarias: (v) => numberField(v, { min: 0, max: 100, msg: 'Informe as avarias.' }),
  altitude: (v) => numberField(v, { min: 0, integer: true, msg: 'Informe a altitude.' }),
}

const ALL_FIELD_IDS = Object.values(STEP_FIELDS).flat()

// Mostra o valor formatado de um campo (texto da opção em selects, prefixos/sufixos).
// Idêntico a displayValue() do original.
function displayValue(formEl, id) {
  const el = formEl.elements[id]
  if (!el) return ''
  let value
  if (el.tagName === 'SELECT') {
    value = el.selectedIndex > 0 ? el.options[el.selectedIndex].text : ''
  } else {
    value = el.value.trim()
  }
  if (value === '') return ''

  switch (id) {
    case 'preco-min':
    case 'preco-max': return `R$ ${value}`
    case 'umidade':
    case 'avarias': return `${value}%`
    case 'altitude': return `${value} m`
    default: return value
  }
}

function RegisterForm({
  currentStep,
  onNext,
  onBack,
  onStepChange,
  onPublish,
}) {
  // formRef substitui os `document.getElementById` do JS original: os
  // campos continuam não-controlados (sem value/onChange individual), e a
  // leitura acontece via formRef.current.elements[id], igual ao byId(id).value.
  const formRef = useRef(null)
  const counterRef = useRef(null)
  const navigate = useNavigate()
  // Conteúdo da etapa 5 (Revisão). Lido do formRef só dentro de um efeito
  // (nunca durante o render — o React 19 trata leitura de ref.current no
  // corpo do componente como erro, já que quebra otimizações do compilador)
  // e guardado em estado, que é o que a JSX abaixo efetivamente renderiza.
  const [reviewGroups, setReviewGroups] = useState([])

  useEffect(() => {
    if (currentStep !== 5 || !formRef.current) return
    const form = formRef.current
    const groups = [
      { title: 'Informações básicas', ids: STEP_FIELDS[1] },
      { title: 'Localização', ids: STEP_FIELDS[2] },
      { title: 'Preço e disponibilidade', ids: STEP_FIELDS[3] },
      { title: 'Dados do cultivo', ids: STEP_FIELDS[4] },
    ].map((group) => ({
      title: group.title,
      items: group.ids.map((id) => ({
        id,
        label: LABELS[id],
        value: displayValue(form, id) || '—',
      })),
    }))
    setReviewGroups(groups)
  }, [currentStep])

  function getValues() {
    const values = {}
    ALL_FIELD_IDS.forEach((id) => {
      values[id] = formRef.current.elements[id]?.value ?? ''
    })
    return values
  }

  function setFieldError(id, message) {
    const input = formRef.current.elements[id]
    const errorEl = formRef.current.querySelector(`#error-${id}`)
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

  // Valida todos os campos de uma etapa; foca o primeiro inválido. Devolve
  // true se a etapa está válida — idêntico a validateStep() do original.
  function validateStep(step, focus = true) {
    const values = getValues()
    let firstInvalidInput = null
    STEP_FIELDS[step].forEach((id) => {
      const input = formRef.current.elements[id]
      const message = VALIDATORS[id](input.value, values)
      setFieldError(id, message)
      if (message && !firstInvalidInput) firstInvalidInput = input
    })
    if (firstInvalidInput && focus) firstInvalidInput.focus()
    return !firstInvalidInput
  }

  function updateDescCounter(event) {
    const length = event.target.value.length
    if (counterRef.current) {
      counterRef.current.textContent = `${length} / 600`
      counterRef.current.classList.toggle('counter-limit', length >= 600)
    }
  }

  // Enter no meio do wizard só avança (sem validar); no Publicar, valida
  // as 4 etapas e pula para a primeira com erro — igual ao listener de
  // 'submit' do original.
  function handleSubmit(event) {
    event.preventDefault()

    if (currentStep < 5) {
      onNext()
      return
    }

    let firstBadStep = 0
    for (let step = 1; step <= 4; step += 1) {
      if (!validateStep(step, false) && !firstBadStep) firstBadStep = step
    }

    if (firstBadStep) {
      onStepChange(firstBadStep)
      // validateStep precisa rodar de novo depois que o painel da etapa
      // trocar de `hidden`, senão o .focus() não funciona em campo oculto.
      requestAnimationFrame(() => validateStep(firstBadStep, true))
      return
    }

    onPublish(getValues())
  }

  return (
    <form className="register-form" noValidate ref={formRef} onSubmit={handleSubmit}>

      {/* Etapa 1: Básico */}

      <section
        className="wizard-panel"
        data-panel="1"
        hidden={currentStep !== 1}
      >

        <header className="wizard-panel-head">

          <h2 className="title-2xl">
            Informações básicas
          </h2>

          <p className="text-muted">
            Etapa 1 de 5
          </p>

        </header>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Tipo de produto
          </h3>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="categoria"
                className="text-semibold"
              >
                Categoria
              </label>

              <select
                id="categoria"
                className="form-input form-select"
                required
                aria-describedby="error-categoria"
              >
                <option value="" disabled>
                  Selecione
                </option>

                <option>Frutas</option>
                <option>Verduras e folhas</option>
                <option>Legumes</option>
                <option>Ervas</option>
                <option>Tubérculos e raízes</option>
                <option>Bulbos</option>
                <option>Grãos e cereais</option>
                <option>Leguminosas</option>
                <option>Sementes e mudas</option>
              </select>

              <span
                className="form-error"
                id="error-categoria"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="tipo"
                className="text-semibold"
              >
                Tipo
              </label>

              <input
                id="tipo"
                type="text"
                className="form-input"
                placeholder="Ex.: Tomate"
                required
                maxLength="60"
                aria-describedby="error-tipo"
              />

              <span
                className="form-error"
                id="error-tipo"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="especie"
                className="text-semibold"
              >
                Espécie
              </label>

              <input
                id="especie"
                type="text"
                className="form-input"
                placeholder="Ex.: Tomate Carmem"
                required
                maxLength="60"
                aria-describedby="error-especie"
              />

              <span
                className="form-error"
                id="error-especie"
                role="alert"
                hidden
              />

            </div>

          </div>

        </div>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Informações do anúncio
          </h3>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="titulo"
                className="text-semibold"
              >
                Título do anúncio
              </label>

              <input
                id="titulo"
                type="text"
                className="form-input"
                placeholder="Ex.: Excelente Tomate Carmem Orgânico"
                required
                maxLength="80"
                aria-describedby="error-titulo"
              />

              <span
                className="form-error"
                id="error-titulo"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="descricao"
                className="text-semibold"
              >
                Descrição do anúncio
              </label>

              <textarea
                id="descricao"
                className="form-input form-textarea"
                placeholder="Descreva o produto, o cultivo e os diferenciais..."
                required
                maxLength="600"
                aria-describedby="error-descricao"
                onChange={updateDescCounter}
              />

              <div className="form-field-footer">

                <span
                  className="form-error"
                  id="error-descricao"
                  role="alert"
                  hidden
                />

                <span
                  className="form-counter"
                  id="counter-descricao"
                  aria-hidden="true"
                  ref={counterRef}
                >
                  0 / 600
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Etapa 2: Localização */}

      <section
        className="wizard-panel"
        data-panel="2"
        hidden={currentStep !== 2}
      >

        <header className="wizard-panel-head">

          <h2 className="title-2xl">
            Localização do lote
          </h2>

          <p className="text-muted">
            Etapa 2 de 5
          </p>

        </header>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Endereço
          </h3>

          <div className="form-field">

            <label
              htmlFor="endereco"
              className="text-semibold"
            >
              Endereço (rua / rodovia e número)
            </label>

            <input
              id="endereco"
              type="text"
              className="form-input"
              placeholder="Ex.: Rodovia Dom Pedro I, km 74 - Pinhal"
              required
              maxLength="120"
              aria-describedby="error-endereco"
            />

            <span
              className="form-error"
              id="error-endereco"
              role="alert"
              hidden
            />

          </div>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="cidade"
                className="text-semibold"
              >
                Cidade
              </label>

              <input
                id="cidade"
                type="text"
                className="form-input"
                placeholder="Ex.: Atibaia"
                required
                maxLength="60"
                aria-describedby="error-cidade"
              />

              <span
                className="form-error"
                id="error-cidade"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="estado"
                className="text-semibold"
              >
                Estado
              </label>

              <select
                id="estado"
                className="form-input form-select"
                required
                aria-describedby="error-estado"
              >

                <option value="" disabled>
                  UF
                </option>

                <option>AC</option>
                <option>AL</option>
                <option>AP</option>
                <option>AM</option>
                <option>BA</option>
                <option>CE</option>
                <option>DF</option>
                <option>ES</option>
                <option>GO</option>
                <option>MA</option>
                <option>MT</option>
                <option>MS</option>
                <option>MG</option>
                <option>PA</option>
                <option>PB</option>
                <option>PR</option>
                <option>PE</option>
                <option>PI</option>
                <option>RJ</option>
                <option>RN</option>
                <option>RS</option>
                <option>RO</option>
                <option>RR</option>
                <option>SC</option>
                <option>SP</option>
                <option>SE</option>
                <option>TO</option>

              </select>

              <span
                className="form-error"
                id="error-estado"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="cep"
                className="text-semibold"
              >
                CEP
              </label>

              <input
                id="cep"
                type="text"
                className="form-input"
                placeholder="00000-000"
                inputMode="numeric"
                maxLength="9"
                required
                aria-describedby="error-cep"
              />

              <span
                className="form-error"
                id="error-cep"
                role="alert"
                hidden
              />

            </div>

          </div>

        </div>

      </section>


      {/* Etapa 3: Preço */}

      <section
        className="wizard-panel"
        data-panel="3"
        hidden={currentStep !== 3}
      >

        <header className="wizard-panel-head">

          <h2 className="title-2xl">
            Preço e disponibilidade
          </h2>

          <p className="text-muted">
            Etapa 3 de 5
          </p>

        </header>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Faixa de preço
          </h3>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="preco-min"
                className="text-semibold"
              >
                Preço mínimo (R$)
              </label>

              <input
                id="preco-min"
                type="number"
                className="form-input"
                placeholder="2,80"
                min="0"
                step="0.01"
                required
                aria-describedby="error-preco-min"
              />

              <span
                className="form-error"
                id="error-preco-min"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="preco-max"
                className="text-semibold"
              >
                Preço máximo (R$)
              </label>

              <input
                id="preco-max"
                type="number"
                className="form-input"
                placeholder="3,20"
                min="0"
                step="0.01"
                required
                aria-describedby="error-preco-max"
              />

              <span
                className="form-error"
                id="error-preco-max"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="unidade"
                className="text-semibold"
              >
                Unidade de venda
              </label>

              <select
                id="unidade"
                className="form-input form-select"
                required
                aria-describedby="error-unidade"
              >

                <option value="" disabled>
                  Selecione
                </option>

                <option value="kg">
                  por kg
                </option>

                <option value="t">
                  por tonelada
                </option>

                <option value="saca">
                  por saca (60kg)
                </option>

                <option value="caixa">
                  por caixa
                </option>

                <option value="duzia">
                  por dúzia
                </option>

              </select>

              <span
                className="form-error"
                id="error-unidade"
                role="alert"
                hidden
              />

            </div>

          </div>

        </div>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Estoque
          </h3>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="disponivel"
                className="text-semibold"
              >
                Quantidade disponível
              </label>

              <input
                id="disponivel"
                type="number"
                className="form-input"
                placeholder="Ex.: 500"
                min="0"
                step="1"
                required
                aria-describedby="error-disponivel"
              />

              <span
                className="form-error"
                id="error-disponivel"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="minimo"
                className="text-semibold"
              >
                Pedido mínimo
              </label>

              <input
                id="minimo"
                type="number"
                className="form-input"
                placeholder="Ex.: 50"
                min="0"
                step="1"
                required
                aria-describedby="error-minimo"
              />

              <span
                className="form-error"
                id="error-minimo"
                role="alert"
                hidden
              />

            </div>

          </div>

        </div>

      </section>


      {/* Etapa 4: Cultivo */}

      <section
        className="wizard-panel"
        data-panel="4"
        hidden={currentStep !== 4}
      >

        <header className="wizard-panel-head">

          <h2 className="title-2xl">
            Dados do cultivo
          </h2>

          <p className="text-muted">
            Etapa 4 de 5
          </p>

        </header>

        <div className="register-fieldset">

          <h3 className="text-semibold">
            Características técnicas
          </h3>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="modo-cultivo"
                className="text-semibold"
              >
                Modo de cultivo
              </label>

              <select
                id="modo-cultivo"
                className="form-input form-select"
                required
                aria-describedby="error-modo-cultivo"
              >

                <option value="" disabled>
                  Selecione
                </option>

                <option>
                  Orgânico certificado
                </option>

                <option>
                  Agroecológico
                </option>

                <option>
                  Convencional
                </option>

                <option>
                  Hidropônico
                </option>

                <option>
                  Em transição
                </option>

              </select>

              <span
                className="form-error"
                id="error-modo-cultivo"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="tipo-solo"
                className="text-semibold"
              >
                Tipo de solo
              </label>

              <select
                id="tipo-solo"
                className="form-input form-select"
                required
                aria-describedby="error-tipo-solo"
              >

                <option value="" disabled>
                  Selecione
                </option>

                <option>Argilo-arenoso</option>
                <option>Argiloso</option>
                <option>Arenoso</option>
                <option>Humífero</option>
                <option>Calcário</option>
                <option>Siltoso</option>

              </select>

              <span
                className="form-error"
                id="error-tipo-solo"
                role="alert"
                hidden
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-field">

              <label
                htmlFor="ph"
                className="text-semibold"
              >
                pH do solo
              </label>

              <input
                id="ph"
                type="number"
                className="form-input"
                placeholder="Ex.: 6,4"
                min="0"
                max="14"
                step="0.1"
                required
                aria-describedby="error-ph"
              />

              <span
                className="form-error"
                id="error-ph"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="umidade"
                className="text-semibold"
              >
                Umidade na colheita (%)
              </label>

              <input
                id="umidade"
                type="number"
                className="form-input"
                placeholder="Ex.: 92"
                min="0"
                max="100"
                step="1"
                required
                aria-describedby="error-umidade"
              />

              <span
                className="form-error"
                id="error-umidade"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="avarias"
                className="text-semibold"
              >
                Avarias (%)
              </label>

              <input
                id="avarias"
                type="number"
                className="form-input"
                placeholder="Ex.: 2"
                min="0"
                max="100"
                step="1"
                required
                aria-describedby="error-avarias"
              />

              <span
                className="form-error"
                id="error-avarias"
                role="alert"
                hidden
              />

            </div>

            <div className="form-field">

              <label
                htmlFor="altitude"
                className="text-semibold"
              >
                Altitude (m)
              </label>

              <input
                id="altitude"
                type="number"
                className="form-input"
                placeholder="Ex.: 800"
                min="0"
                step="1"
                required
                aria-describedby="error-altitude"
              />

              <span
                className="form-error"
                id="error-altitude"
                role="alert"
                hidden
              />

            </div>

          </div>

        </div>

      </section>


      {/* Etapa 5: Revisão */}

      <section
        className="wizard-panel"
        data-panel="5"
        hidden={currentStep !== 5}
      >

        <header className="wizard-panel-head">

          <h2 className="title-2xl">
            Revisão
          </h2>

          <p className="text-muted">
            Etapa 5 de 5
          </p>

        </header>

        <p className="text-muted">
          Confira os dados antes de publicar. Você pode voltar e ajustar qualquer etapa.
        </p>

        {/* Antes era um <div id="review-content" /> vazio, preenchido via
            innerHTML pelo JS original — nunca migrado, por isso a etapa 5
            sempre aparecia em branco. Como os campos continuam
            não-controlados, lemos os valores atuais direto do formRef no
            momento da renderização (só quando currentStep === 5, então o
            painel já está com os valores mais recentes digitados). */}
        <div className="review" id="review-content">
          {reviewGroups.map((group) => (
            <div className="review-group" key={group.title}>
              <h3 className="review-group-title">{group.title}</h3>

              <div className="review-items">
                {group.items.map((item) => (
                  <div className="review-item" key={item.id}>
                    <span className="review-item-label">{item.label}</span>
                    <span className="review-item-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* Footer */}

      <footer className="register-footer">

        <button
          type="button"
          className="button-wizard-back"
          onClick={onBack}
          hidden={currentStep === 1}
        >

          <span
            className="icon icon-16"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </span>

          Voltar

        </button>

        <div className="register-footer-actions">

          <button
            type="button"
            className="button-wizard-ghost"
            onClick={() => navigate('/')}
          >
            Salvar e sair
          </button>

          <button
            type="button"
            className="button-wizard-next"
            onClick={onNext}
            hidden={currentStep === 5}
          >

            Avançar

            <span
              className="icon icon-16"
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16">
                <path d="M12.1667 7H0V9H12.1667L6.58333 14.5833L8 16L16 8L8 0L6.58333 1.41667L12.1667 7Z" />
              </svg>
            </span>

          </button>

          <button
            type="submit"
            className="button-wizard-next"
            hidden={currentStep !== 5}
          >

            Publicar

            <span
              className="icon icon-16"
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16">
                <path d="M12.1667 7H0V9H12.1667L6.58333 14.5833L8 16L16 8L8 0L6.58333 1.41667L12.1667 7Z" />
              </svg>
            </span>

          </button>

        </div>

      </footer>

    </form>
  )
}

export default RegisterForm
