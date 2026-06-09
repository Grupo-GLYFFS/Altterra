// js/cadastro.js — sistema de tabs + validação da página de Cadastro de Produto.
(function () {
  function init() {
    const root = document.querySelector('[data-page="cadastro"]');
    if (!root) return;

    const tabs = root.querySelectorAll(".button-tab[data-tab]");
    const panels = root.querySelectorAll(".tab-panel[data-panel]");
    const ordem = [...panels].map((p) => p.dataset.panel);

    const ativar = (nome) => {
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === nome));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === nome));
    };
    const atual = () => {
      const a = [...tabs].find((t) => t.classList.contains("active"));
      return a ? a.dataset.tab : ordem[0];
    };

    tabs.forEach((t) => t.addEventListener("click", () => ativar(t.dataset.tab)));
    root.querySelectorAll("[data-next]").forEach((b) =>
      b.addEventListener("click", () => { const i = ordem.indexOf(atual()); if (i < ordem.length - 1) ativar(ordem[i + 1]); }));
    root.querySelectorAll("[data-prev]").forEach((b) =>
      b.addEventListener("click", () => { const i = ordem.indexOf(atual()); if (i > 0) ativar(ordem[i - 1]); }));

    const form = root.querySelector("form");
    const sucesso = document.getElementById("cadastro-sucesso");
    if (form) {
      window.Validacao.ligarAoVivo(form);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!window.Validacao.validarFormulario(form)) {
          const inv = form.querySelector(".invalid");
          if (inv) { const panel = inv.closest(".tab-panel"); if (panel) ativar(panel.dataset.panel); inv.focus(); }
          return;
        }
        form.hidden = true;
        if (sucesso) { sucesso.hidden = false; sucesso.scrollIntoView({ behavior: "smooth" }); }
      });
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
