// js/produto.js — preenche a página de produto a partir do ?id= (depende de produtos.js).
(function () {
  const LABELS = { hortalicas: "Hortaliças", frutas: "Frutas", graos: "Grãos", sementes: "Sementes" };
  const preco = (n, uni) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${uni}`;

  async function init() {
    if (!document.querySelector(".product-page-container")) return;
    const id = new URLSearchParams(location.search).get("id");
    let p = null;
    try {
      p = id ? await window.Altterra.getProdutoPorId(id) : (await window.Altterra.getProdutos())[0];
    } catch (e) { console.error(e); return; }
    if (!p) return;

    const BASE = "../";
    const fb = `${BASE}images/tomate-carmem.png`;
    document.title = `${p.nome} • Altterra`;

    const h1 = document.querySelector("h1.title-2xl");
    if (h1) h1.textContent = p.nome;

    const bcAtual = document.querySelector('.breadcrumb [aria-current="page"]');
    if (bcAtual) bcAtual.textContent = p.nome;
    const bcCat = document.querySelector(".breadcrumb ol li:nth-of-type(2) a");
    if (bcCat) bcCat.textContent = LABELS[p.categoria] || p.categoria;

    const main = document.querySelector(".main-image");
    if (main) {
      main.src = `${BASE}${(p.imagens && p.imagens[0]) || p.imagem}`;
      main.alt = `Foto principal do ${p.nome}`;
      main.onerror = function () { this.onerror = null; this.src = fb; };
    }

    const thumbs = document.querySelector(".thumbnails");
    const extras = (p.imagens || []).slice(1);
    if (thumbs) {
      if (!extras.length) thumbs.style.display = "none";
      else thumbs.innerHTML = extras
        .map((s, i) => `<img class="thumbnail-image" src="${BASE}${s}" alt="Vista ${i + 2} do ${p.nome}">`)
        .join("");
      if (main) thumbs.querySelectorAll(".thumbnail-image").forEach((t) =>
        t.addEventListener("click", () => { const tmp = main.src; main.src = t.src; t.src = tmp; }));
    }

    const precos = document.querySelectorAll(".product-prices .product-price .title-2xl");
    if (precos.length >= 3) {
      const mid = (p.precoMin + p.precoMax) / 2;
      precos[0].textContent = preco(p.precoMax, p.unidade);
      precos[1].textContent = preco(mid, p.unidade);
      precos[2].textContent = preco(p.precoMin, p.unidade);
    } else if (precos.length) {
      precos.forEach((s) => (s.textContent = preco(p.precoMax, p.unidade)));
    }

    const fn = document.querySelector(".supplier-mini-profile .supplier-name-badge");
    if (fn && fn.firstChild) fn.firstChild.textContent = p.fornecedor.nome + " ";
    const fr = document.querySelector(".supplier-rating-mini > span:last-of-type");
    if (fr) fr.textContent = p.avaliacao.toFixed(2);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
