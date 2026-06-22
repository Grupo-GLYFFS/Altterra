// Tab switch da Como Funciona: um clique troca o bento E a FAQ ao mesmo tempo

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-button');
  // [data-panel] cobre tanto os bentos quanto as listas de FAQ
  const panels = document.querySelectorAll('[data-panel]');

  function switchTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('tab-button-active');
      } else {
        btn.classList.remove('tab-button-active');
      }
    });

    panels.forEach(panel => {
      if (panel.getAttribute('data-panel') === tabId) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  }

  // Estado inicial da página
  switchTab('compradores');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
});

// Validação do formulário "Fale Conosco" (requisito da Fase 4).
// Regras: Nome = nome + sobrenome, mín. 2 letras cada; Email = formato válido;
// Assunto = mín. 3 caracteres; Mensagem = não vazia, máx. 500 caracteres.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const counter = document.getElementById('counter-message');
  const submitBtn = form.querySelector('.button-contact-action');
  const submitBtnHTML = submitBtn.innerHTML; // guarda o estado original para restaurar

  const MAX_MESSAGE = 500;
  let sentTimeout;

  // Cada validador devolve a mensagem de erro, ou '' quando o campo está ok.
  function validateName(value) {
    const name = value.trim();
    if (name === '') return 'Informe seu nome.';
    const parts = name.split(/\s+/);
    if (parts.length < 2) return 'Informe nome e sobrenome.';
    // Cada parte precisa ter ao menos 2 letras (aceita acentos, hífen e apóstrofo)
    const wordPattern = /^[A-Za-zÀ-ÿ'’.-]{2,}$/;
    if (!parts.every(part => wordPattern.test(part))) {
      return 'Cada nome deve ter ao menos 2 letras.';
    }
    return '';
  }

  function validateEmail(value) {
    const email = value.trim();
    if (email === '') return 'Informe seu email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido.';
    return '';
  }

  function validateSubject(value) {
    const subject = value.trim();
    if (subject === '') return 'Informe o assunto.';
    if (subject.length < 3) return 'O assunto deve ter ao menos 3 caracteres.';
    return '';
  }

  function validateMessage(value) {
    const message = value.trim();
    if (message === '') return 'Escreva sua mensagem.';
    if (message.length > MAX_MESSAGE) return `A mensagem deve ter no máximo ${MAX_MESSAGE} caracteres.`;
    return '';
  }

  const fields = [
    { input: nameInput, error: document.getElementById('error-name'), validate: validateName },
    { input: emailInput, error: document.getElementById('error-email'), validate: validateEmail },
    { input: subjectInput, error: document.getElementById('error-subject'), validate: validateSubject },
    { input: messageInput, error: document.getElementById('error-message'), validate: validateMessage },
  ];

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

  function updateCounter() {
    const length = messageInput.value.length;
    counter.textContent = `${length} / ${MAX_MESSAGE}`;
    counter.classList.toggle('counter-limit', length >= MAX_MESSAGE);
  }

  messageInput.addEventListener('input', updateCounter);
  updateCounter();

  fields.forEach(field => {
    // Valida ao sair do campo
    field.input.addEventListener('blur', () => {
      setFieldError(field.input, field.error, field.validate(field.input.value));
    });
    // Já com erro visível, revalida enquanto digita para limpar assim que corrigir
    field.input.addEventListener('input', () => {
      if (field.input.classList.contains('input-invalid')) {
        setFieldError(field.input, field.error, field.validate(field.input.value));
      }
    });
  });

  // Feedback de envio: troca o texto do botão e volta ao normal após alguns segundos
  function showSentFeedback() {
    submitBtn.classList.add('is-sent');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      Mensagem enviada
      <span class="icon icon-16" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.42z" />
        </svg>
      </span>`;

    clearTimeout(sentTimeout);
    sentTimeout = setTimeout(() => {
      submitBtn.classList.remove('is-sent');
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtnHTML;
    }, 3000);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach(field => {
      const message = field.validate(field.input.value);
      setFieldError(field.input, field.error, message);
      if (message && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Envio simulado — sem backend nesta fase
    form.reset();
    updateCounter();
    showSentFeedback();
  });
});
