// js/tema.js — alterna tema claro/escuro e salva a escolha (compartilhado em todas as páginas).
(function () {
  const KEY = "altterra-theme";
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const ORDEM = ["system", "light", "dark"]; // ordem dos botões no .theme-toggle

  const escolhaSalva = () => localStorage.getItem(KEY) || "system";
  const efetivo = (e) => (e === "dark" ? "dark" : e === "light" ? "light" : mq.matches ? "dark" : "light");

  function aplicar(escolha) {
    document.documentElement.dataset.theme = efetivo(escolha);
    document.querySelectorAll(".theme-toggle").forEach((grupo) => {
      grupo.querySelectorAll(".button-theme-option").forEach((b, i) =>
        b.classList.toggle("active", ORDEM[i] === escolha)
      );
    });
  }

  function init() {
    aplicar(escolhaSalva());
    document.querySelectorAll(".theme-toggle").forEach((grupo) => {
      grupo.querySelectorAll(".button-theme-option").forEach((b, i) => {
        b.addEventListener("click", () => {
          const escolha = ORDEM[i] || "system";
          localStorage.setItem(KEY, escolha);
          aplicar(escolha);
        });
      });
    });
    mq.addEventListener("change", () => { if (escolhaSalva() === "system") aplicar("system"); });
  }

  aplicar(escolhaSalva()); // aplica o quanto antes
  document.addEventListener("DOMContentLoaded", init);
})();
