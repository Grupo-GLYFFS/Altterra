// js/produtos.js
// Biblioteca de dados do Altterra (Fase 4).
// Carrega data/produtos.json e oferece funções para montar os cards.
// Quem usa: home.js (Home) e produto.js (página de produto).

const BASE = location.pathname.includes("/pages/") ? "../" : "./";

let _cacheProdutos = null;

async function getProdutos() {
  if (_cacheProdutos) return _cacheProdutos;
  const resp = await fetch(`${BASE}data/produtos.json`);
  if (!resp.ok) throw new Error("Não foi possível carregar data/produtos.json");
  _cacheProdutos = await resp.json();
  return _cacheProdutos;
}

async function getProdutoPorId(id) {
  const produtos = await getProdutos();
  return produtos.find((p) => p.id === id) || null;
}

function formatarPreco({ precoMin, precoMax, unidade }) {
  const real = (n) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (precoMin === precoMax) return `R$${real(precoMin)}/${unidade}`;
  return `R$${real(precoMin)} - R$${real(precoMax)}/${unidade}`;
}

// HTML de UM card (mesma marcação desenhada na Fase 3).
function criarCardProduto(p) {
  const fallback = `${BASE}images/tomate-carmem.png`;
  return `
    <li>
      <a href="${BASE}pages/product-page.html?id=${encodeURIComponent(p.id)}">
        <article class="product-card">
          <img class="product-image" src="${BASE}${p.imagem}" alt="${p.nome}"
               onerror="this.onerror=null;this.src='${fallback}'" />
          <h3 class="text-semibold">${p.nome}</h3>
          <div class="product-card-supplier-info">
            <p class="text-xs text-muted-dark">${p.fornecedor.nome}</p>
            <div class="product-card-review">
              <span class="icon icon-12 text-muted-dark">
                <svg viewBox="0 0 16 16"><path d="M5.875 11.9792L8 10.3542L10.125 11.9792L9.33333 9.39583L11.7083 7.5H8.85417L8 4.875L7.16667 7.5H4.29167L6.6875 9.39583L5.875 11.9792ZM3.0625 16L4.9375 9.9375L0 6H6.0625L8 0L9.9375 6H16L11.0625 9.9375L12.9375 16L8 12.25L3.0625 16Z" /></svg>
              </span>
              <span class="text-xs text-muted-dark">${p.avaliacao.toFixed(2)}</span>
            </div>
          </div>
          <p class="text-xs text-muted-dark">Distância: ${p.distanciaKm}km</p>
          <div class="product-card-stock">
            <span class="text-xs text-muted-dark">Disponível: ${p.disponivel}</span>
            <span class="text-xs text-muted-dark">/</span>
            <span class="text-xs text-muted-dark">Qtd. min: ${p.quantidadeMinima}</span>
          </div>
          <p class="title-lg">${formatarPreco(p)}</p>
        </article>
      </a>
    </li>`;
}

function renderizarGrid(lista, grid) {
  if (!grid) return;
  grid.innerHTML = lista.length
    ? lista.map(criarCardProduto).join("")
    : `<li><p class="text-muted-dark">Nenhum produto encontrado.</p></li>`;
}

// Recortes usados pelas seções da Home.
const FILTROS_SECAO = {
  perto: (l) => [...l].sort((a, b) => a.distanciaKm - b.distanciaKm).slice(0, 6),
  pequenos: (l) => l.filter((p) => p.fornecedor.tipo === "pequeno"),
  certificados: (l) => l.filter((p) => p.fornecedor.certificado),
  safra: (l) => l.filter((p) => p.categoria === "sementes"),
  todos: (l) => l,
};

const ORDEM_SECOES = ["perto", "pequenos", "certificados", "safra"];

window.Altterra = {
  BASE,
  getProdutos,
  getProdutoPorId,
  criarCardProduto,
  renderizarGrid,
  formatarPreco,
  FILTROS_SECAO,
  ORDEM_SECOES,
};
