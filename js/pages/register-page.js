// Wizard de cadastro de produto: navegação por etapas, validação no final,
// revisão dos dados e publicação simulada (sem backend nesta fase).

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.register-form');
  if (!form) return;

  const stepper = document.querySelector('.wizard-steps');
  const stepEls = Array.from(document.querySelectorAll('.wizard-step'));
  const panels = Array.from(document.querySelectorAll('.wizard-panel'));
  const backBtn = form.querySelector('[data-action="back"]');
  const nextBtn = form.querySelector('[data-action="next"]');
  const publishBtn = form.querySelector('[data-action="publish"]');
  const saveBtn = form.querySelector('[data-action="save-exit"]');
  const reviewContent = document.getElementById('review-content');
  const successSection = document.getElementById('register-success');

  const TOTAL_STEPS = 5;
  let currentStep = 1;

  // Quais campos pertencem a cada etapa
  const STEP_FIELDS = {
    1: ['categoria', 'tipo', 'especie', 'titulo', 'descricao'],
    2: ['endereco', 'cidade', 'estado', 'cep'],
    3: ['preco-min', 'preco-max', 'unidade', 'disponivel', 'minimo'],
    4: ['modo-cultivo', 'tipo-solo', 'ph', 'umidade', 'avarias', 'altitude'],
  };

  const LABELS = {
    categoria: 'Categoria', tipo: 'Tipo', especie: 'Espécie',
    titulo: 'Título', descricao: 'Descrição',
    endereco: 'Endereço', cidade: 'Cidade', estado: 'Estado', cep: 'CEP',
    'preco-min': 'Preço mínimo', 'preco-max': 'Preço máximo', unidade: 'Unidade',
    disponivel: 'Disponível', minimo: 'Pedido mínimo',
    'modo-cultivo': 'Modo de cultivo', 'tipo-solo': 'Tipo de solo',
    ph: 'pH do solo', umidade: 'Umidade', avarias: 'Avarias', altitude: 'Altitude',
  };

  const byId = (id) => document.getElementById(id);

  // Valida um campo numérico; devolve a mensagem de erro ou '' se válido
  function numberField(value, { min, max, integer, msg } = {}) {
    const raw = value.trim();
    if (raw === '') return msg || 'Campo obrigatório.';
    const n = Number(raw.replace(',', '.'));
    if (Number.isNaN(n)) return 'Informe um número válido.';
    if (integer && !Number.isInteger(n)) return 'Use um número inteiro.';
    if (min != null && n < min) return `Valor mínimo: ${min}.`;
    if (max != null && n > max) return `Valor máximo: ${max}.`;
    return '';
  }

  // Cada validador recebe (valor, todosOsValores) e devolve a mensagem ou ''
  const VALIDATORS = {
    categoria: (v) => (v.trim() === '' ? 'Selecione uma categoria.' : ''),
    tipo: (v) => (v.trim() === '' ? 'Informe o tipo.' : ''),
    especie: (v) => (v.trim() === '' ? 'Informe a espécie.' : ''),
    titulo: (v) => {
      const t = v.trim();
      if (t === '') return 'Informe o título.';
      if (t.length < 5) return 'O título deve ter ao menos 5 caracteres.';
      return '';
    },
    descricao: (v) => {
      const t = v.trim();
      if (t === '') return 'Escreva uma descrição.';
      if (t.length < 20) return 'A descrição deve ter ao menos 20 caracteres.';
      if (t.length > 600) return 'Máximo de 600 caracteres.';
      return '';
    },
    endereco: (v) => {
      const t = v.trim();
      if (t === '') return 'Informe o endereço.';
      if (t.length < 5) return 'Endereço muito curto.';
      return '';
    },
    cidade: (v) => (v.trim() === '' ? 'Informe a cidade.' : ''),
    estado: (v) => (v.trim() === '' ? 'Selecione o estado.' : ''),
    cep: (v) => {
      const t = v.trim();
      if (t === '') return 'Informe o CEP.';
      if (!/^\d{5}-?\d{3}$/.test(t)) return 'CEP inválido (use 00000-000).';
      return '';
    },
    'preco-min': (v) => numberField(v, { min: 0.01, msg: 'Informe o preço mínimo.' }),
    'preco-max': (v, all) => {
      const base = numberField(v, { min: 0.01, msg: 'Informe o preço máximo.' });
      if (base) return base;
      const min = Number(all['preco-min']);
      if (!Number.isNaN(min) && Number(v) < min) return 'Deve ser maior ou igual ao mínimo.';
      return '';
    },
    unidade: (v) => (v.trim() === '' ? 'Selecione a unidade.' : ''),
    disponivel: (v) => numberField(v, { min: 1, integer: true, msg: 'Informe a quantidade.' }),
    minimo: (v, all) => {
      const base = numberField(v, { min: 1, integer: true, msg: 'Informe o pedido mínimo.' });
      if (base) return base;
      const disp = Number(all['disponivel']);
      if (!Number.isNaN(disp) && Number(v) > disp) return 'Não pode exceder o disponível.';
      return '';
    },
    'modo-cultivo': (v) => (v.trim() === '' ? 'Selecione o modo de cultivo.' : ''),
    'tipo-solo': (v) => (v.trim() === '' ? 'Selecione o tipo de solo.' : ''),
    ph: (v) => numberField(v, { min: 0, max: 14, msg: 'Informe o pH.' }),
    umidade: (v) => numberField(v, { min: 0, max: 100, msg: 'Informe a umidade.' }),
    avarias: (v) => numberField(v, { min: 0, max: 100, msg: 'Informe as avarias.' }),
    altitude: (v) => numberField(v, { min: 0, integer: true, msg: 'Informe a altitude.' }),
  };

  const allFieldIds = Object.values(STEP_FIELDS).flat();

  function getValues() {
    const values = {};
    allFieldIds.forEach((id) => { values[id] = byId(id).value; });
    return values;
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.classList.add('input-invalid');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      input.classList.remove('input-invalid');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  // Valida todos os campos de uma etapa; foca o primeiro inválido se focus = true
  function validateStep(step, focus = true) {
    const values = getValues();
    let firstInvalid = null;
    STEP_FIELDS[step].forEach((id) => {
      const input = byId(id);
      const errorEl = byId('error-' + id);
      const message = VALIDATORS[id](input.value, values);
      setFieldError(input, errorEl, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid && focus) firstInvalid.focus();
    return !firstInvalid;
  }

  function showStep(step) {
    currentStep = step;

    panels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.panel) !== step;
    });

    stepEls.forEach((el) => {
      const s = Number(el.dataset.step);
      el.classList.toggle('is-active', s === step);
      el.classList.toggle('is-done', s < step);
    });

    backBtn.hidden = step === 1;
    const isLast = step === TOTAL_STEPS;
    nextBtn.hidden = isLast;
    publishBtn.hidden = !isLast;

    if (isLast) renderReview();
  }

  // Navegação livre: avançar não valida (a validação acontece só no Publicar)
  function goNext() {
    if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // Mostra o valor formatado de um campo (texto da opção em selects, prefixos/sufixos)
  function displayValue(id) {
    const el = byId(id);
    let value;
    if (el.tagName === 'SELECT') {
      value = el.selectedIndex > 0 ? el.options[el.selectedIndex].text : '';
    } else {
      value = el.value.trim();
    }
    if (value === '') return '';

    switch (id) {
      case 'preco-min':
      case 'preco-max': return `R$ ${value}`;
      case 'umidade':
      case 'avarias': return `${value}%`;
      case 'altitude': return `${value} m`;
      default: return value;
    }
  }

  function renderReview() {
    const groups = [
      { title: 'Informações básicas', ids: STEP_FIELDS[1] },
      { title: 'Localização', ids: STEP_FIELDS[2] },
      { title: 'Preço e disponibilidade', ids: STEP_FIELDS[3] },
      { title: 'Dados do cultivo', ids: STEP_FIELDS[4] },
    ];

    reviewContent.innerHTML = groups.map((group) => `
      <div class="review-group">
        <h3 class="review-group-title">${group.title}</h3>
        <div class="review-items">
          ${group.ids.map((id) => {
            const value = displayValue(id);
            return `
              <div class="review-item">
                <span class="review-item-label">${LABELS[id]}</span>
                <span class="review-item-value">${value ? escapeHtml(value) : '—'}</span>
              </div>`;
          }).join('')}
        </div>
      </div>`).join('');
  }

  function showSuccess() {
    form.hidden = true;
    stepper.hidden = true;
    successSection.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Contador de caracteres da descrição
  const descricao = byId('descricao');
  const counter = byId('counter-descricao');
  function updateCounter() {
    counter.textContent = `${descricao.value.length} / 600`;
    counter.classList.toggle('counter-limit', descricao.value.length >= 600);
  }
  descricao.addEventListener('input', updateCounter);
  updateCounter();

  // Revalida cada campo enquanto digita, uma vez que já mostrou erro
  allFieldIds.forEach((id) => {
    const input = byId(id);
    const errorEl = byId('error-' + id);
    const revalidate = () => {
      if (input.classList.contains('input-invalid')) {
        setFieldError(input, errorEl, VALIDATORS[id](input.value, getValues()));
      }
    };
    input.addEventListener('input', revalidate);
    input.addEventListener('change', revalidate);
  });

  nextBtn.addEventListener('click', goNext);
  backBtn.addEventListener('click', () => showStep(currentStep - 1));
  saveBtn.addEventListener('click', () => { window.location.href = '../index.html'; });

  // Stepper clicável: pular direto para qualquer etapa
  stepEls.forEach((el) => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    const goToStep = () => showStep(Number(el.dataset.step));
    el.addEventListener('click', goToStep);
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToStep();
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Enter nas etapas intermediárias só avança
    if (currentStep < TOTAL_STEPS) {
      goNext();
      return;
    }

    // Última etapa: valida tudo e pula para a primeira etapa com erro
    let firstBadStep = 0;
    for (let step = 1; step <= 4; step += 1) {
      if (!validateStep(step, false) && !firstBadStep) firstBadStep = step;
    }
    if (firstBadStep) {
      showStep(firstBadStep);
      validateStep(firstBadStep, true);
      return;
    }

    showSuccess();
  });
});
