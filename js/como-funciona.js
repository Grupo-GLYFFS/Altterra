// js/como-funciona.js — tabs (Fornecedores / ONGs) + validação do formulário de ajuda.
(function () {
  function init() {
    const tabs = document.querySelectorAll(".como-funciona-tabs .button-tab[data-tab]");
    const panels = document.querySelectorAll(".tab-panels .tab-panel[data-panel]");
    if (tabs.length) {
      const ativar = (n) => {
        tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === n));
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === n));
      };
      tabs.forEach((t) => t.addEventListener("click", () => ativar(t.dataset.tab)));
    }

    const form = document.getElementById("form-ajuda");
    const sucesso = document.getElementById("ajuda-sucesso");
    if (form) {
      window.Validacao.ligarAoVivo(form);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!window.Validacao.validarFormulario(form)) {
          const inv = form.querySelector(".invalid");
          if (inv) inv.focus();
          return;
        }
        form.hidden = true;
        if (sucesso) { sucesso.hidden = false; sucesso.scrollIntoView({ behavior: "smooth" }); }
      });
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
