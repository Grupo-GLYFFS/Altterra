// js/validacao.js — validação simples com mensagens inline (usada no Cadastro e no Como Funciona).
(function () {
  function mostrarErro(campo, msg) {
    campo.classList.add("invalid");
    let erro = campo.parentElement.querySelector(".form-error");
    if (!erro) {
      erro = document.createElement("span");
      erro.className = "form-error";
      campo.parentElement.appendChild(erro);
    }
    erro.textContent = msg;
  }

  function limparErro(campo) {
    campo.classList.remove("invalid");
    const erro = campo.parentElement.querySelector(".form-error");
    if (erro) erro.remove();
  }

  function validarCampo(campo) {
    if (campo.type === "submit" || campo.type === "button") return true;
    const val = (campo.value || "").trim();
    if (campo.hasAttribute("required") && !val) { mostrarErro(campo, "Campo obrigatório."); return false; }
    if (campo.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { mostrarErro(campo, "Email inválido."); return false; }
    const min = campo.getAttribute("minlength");
    if (min && val && val.length < +min) { mostrarErro(campo, `Mínimo de ${min} caracteres.`); return false; }
    if (campo.type === "number" && val) {
      const n = parseFloat(val);
      if (isNaN(n)) { mostrarErro(campo, "Informe um número."); return false; }
      const mn = campo.getAttribute("min");
      if (mn !== null && n < +mn) { mostrarErro(campo, `Valor mínimo: ${mn}.`); return false; }
    }
    limparErro(campo);
    return true;
  }

  function validarFormulario(form) {
    let ok = true;
    form.querySelectorAll("input, textarea, select").forEach((c) => {
      if (!validarCampo(c)) ok = false;
    });
    return ok;
  }

  // liga validação ao vivo (blur/input) num formulário
  function ligarAoVivo(form) {
    form.querySelectorAll("input, textarea, select").forEach((c) => {
      c.addEventListener("blur", () => validarCampo(c));
      c.addEventListener("input", () => { if (c.classList.contains("invalid")) validarCampo(c); });
    });
  }

  window.Validacao = { validarCampo, validarFormulario, ligarAoVivo };
})();
