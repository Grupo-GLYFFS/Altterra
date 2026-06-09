// js/home.js — interatividade da Home (depende de produtos.js).
(function () {
  const A = window.Altterra;
  const LABELS = { hortalicas: "Hortaliças", frutas: "Frutas", graos: "Grãos", sementes: "Sementes" };
  let produtos = [];

  const chunk = (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  };

  const secoesCuradas = () =>
    [...document.querySelectorAll(".page-sections > .product-section")].filter((s) => s.id !== "resultados");

  // ----- seções curadas + paginação (carrossel) -----
  function montarSecoesCuradas() {
    secoesCuradas().forEach((sec, i) => {
      const grid = sec.querySelector(".products-grid");
      if (!grid) return;
      const nome = grid.dataset.secao || A.ORDEM_SECOES[i] || "todos";
      const lista = (A.FILTROS_SECAO[nome] || A.FILTROS_SECAO.todos)(produtos);
      const paginas = chunk(lista, 6);
      let pag = 0;
      const render = () => A.renderizarGrid(paginas[pag] || [], grid);
      render();

      const botoes = sec.querySelectorAll(".product-section-nav .button-pagination");
      if (botoes.length >= 2) {
        if (paginas.length <= 1) {
          botoes.forEach((b) => { b.disabled = true; b.classList.add("is-disabled"); });
        } else {
          botoes[0].addEventListener("click", () => { pag = (pag - 1 + paginas.length) % paginas.length; render(); });
          botoes[1].addEventListener("click", () => { pag = (pag + 1) % paginas.length; render(); });
        }
      }
    });
  }

  // ----- resultados (busca / categoria / outlet) -----
  function garantirResultados() {
    let sec = document.getElementById("resultados");
    if (sec) return sec;
    const main = document.querySelector("main.page-sections");
    sec = document.createElement("section");
    sec.className = "product-section";
    sec.id = "resultados";
    sec.hidden = true;
    sec.innerHTML =
      '<div class="product-section-top">' +
      '<div class="product-section-header"><h2 class="title-2xl" id="resultados-titulo">Resultados</h2></div>' +
      '<button class="button-tab" id="resultados-limpar" type="button">Limpar</button>' +
      "</div>" +
      '<ul class="products-grid" id="resultados-grid"></ul>';
    main.prepend(sec);
    sec.querySelector("#resultados-limpar").addEventListener("click", limparResultados);
    return sec;
  }

  function mostrarResultados(lista, titulo) {
    const sec = garantirResultados();
    sec.querySelector("#resultados-titulo").textContent = `${titulo} (${lista.length})`;
    A.renderizarGrid(lista, sec.querySelector("#resultados-grid"));
    sec.hidden = false;
    secoesCuradas().forEach((s) => (s.hidden = true));
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function limparResultados() {
    const sec = document.getElementById("resultados");
    if (sec) sec.hidden = true;
    secoesCuradas().forEach((s) => (s.hidden = false));
  }

  // ----- categorias -----
  function wireCategorias() {
    document.querySelectorAll(".button-category").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.categoria;
        document.querySelectorAll(".button-category").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const det = btn.closest("details");
        if (det) det.open = false;
        if (cat === "todos") return limparResultados();
        mostrarResultados(produtos.filter((p) => p.categoria === cat), `Categoria: ${LABELS[cat] || cat}`);
      });
    });
  }

  // ----- busca -----
  function buscar(termo) {
    termo = (termo || "").trim().toLowerCase();
    if (!termo) return limparResultados();
    const lista = produtos.filter((p) =>
      [p.nome, p.fornecedor.nome, p.categoria].join(" ").toLowerCase().includes(termo)
    );
    mostrarResultados(lista, `Busca: "${termo}"`);
  }

  function wireBusca() {
    document.querySelectorAll(".search-bar").forEach((bar) => {
      const input = bar.querySelector("input");
      const btn = bar.querySelector(".button-search");
      if (btn) btn.addEventListener("click", () => buscar(input && input.value));
      if (input)
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); buscar(input.value); }
        });
    });
  }

  // ----- mercado (padrão / outlet) -----
  function wireMercado() {
    const grupos = document.querySelectorAll(".navbar-search .tab-group");
    const grupo = grupos[grupos.length - 1];
    if (!grupo) return;
    const tabs = grupo.querySelectorAll(".button-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        if (tab.textContent.trim().toLowerCase().includes("outlet"))
          mostrarResultados(produtos.filter((p) => p.mercado === "outlet"), "Outlet sustentável");
        else limparResultados();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (!document.querySelector("main.page-sections")) return; // só na Home
    try {
      produtos = await A.getProdutos();
      montarSecoesCuradas();
      garantirResultados();
      wireCategorias();
      wireBusca();
      wireMercado();
    } catch (e) {
      console.error("Erro na Home:", e);
    }
  });
})();
