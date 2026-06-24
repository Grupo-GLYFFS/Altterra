# project-guide.md — Guia do Projeto Altterra

## O que é o Altterra

Marketplace B2B de commodities agrícolas. Conecta produtores/cooperativas diretamente a distribuidores, varejistas e ONGs, sem intermediários. ODS 2 (Fome Zero). Projeto PBL da FIAP.

**3 pilares:**
1. **Marketplace Direto** — compra B2B de safras e excedentes
2. **Outlet Sustentável** — produtos fora do padrão estético, com desconto
3. **AgroLink** — hub de doações para ONGs

**Repositório:** github.com/Grupo-GLYFFS/Altterra · branches `main` (produção) e `veneno's-branch` (desenvolvimento)
**Deploy:** https://grupo-glyffs.github.io/Altterra/ (GitHub Pages)

---

## Estrutura de arquivos

```
Altterra/
├── index.html                      ← Home / Marketplace (carrosséis de produtos)
├── pages/
│   ├── login-page.html             ← Login (cover + social + email)
│   ├── product-page.html           ← Detalhe de produto (galeria, local, avaliações)
│   ├── how-it-works-page.html      ← Como Funciona (tabs + FAQ + Fale Conosco)
│   └── register-page.html          ← Cadastro de produto (wizard de 5 etapas)
├── css/
│   ├── variables.css               ← Tokens de design (cores, espaços, fontes, z-index)
│   ├── reset.css                   ← @font-face + reset global
│   ├── utilities.css               ← Classes utilitárias (.icon-*, .title-*, .text-*, .sr-only)
│   ├── components.css              ← Compartilhados (navbar, footer, categorias, cards, forms)
│   └── pages/
│       ├── login-page.css
│       ├── product-page.css
│       ├── how-it-works-page.css
│       └── register-page.css
├── js/
│   ├── components.js               ← Render de navbar + footer (caminhos relativos p/ funcionar em file://, GitHub Pages e Live Server)
│   ├── carousel.js                 ← Carrossel de produtos (setas + arraste com o mouse)
│   └── pages/
│       ├── product-page.js         ← Galeria, scroll-spy do índice, copiar endereço / abrir no Maps
│       ├── how-it-works-page.js    ← Tab switch + validação do formulário Fale Conosco
│       └── register-page.js        ← Wizard de 5 etapas + validação dos campos
├── fonts/                          ← Cal Sans UI (7 arquivos .woff2)
└── images/                         ← logos, ícones e fotos (produto, local, fornecedor)
```

---

## Design System

### Fontes

| Família | Uso | Pesos |
|---|---|---|
| `Cal Sans UI` | Corpo de texto | Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700 |
| `Cal Sans UI Text` | Títulos (display) | SemiBold 600, Bold 700 |

`var(--font-body)` = "Cal Sans UI" · `var(--font-display)` = "Cal Sans UI Text"

### Paleta de cores (light mode — sem dark mode)

Paleta esverdeada (matiz 116). Cores em `hsl`, exceto branco puro e alerta.

| Token | Valor | Uso |
|---|---|---|
| `--color-white` | `hsl(116, 20%, 88%)` | Off-white esverdeado — fundo principal |
| `--color-pure-white` | `#ffffff` | Branco puro — botões de login social |
| `--color-black` | `hsl(116, 23%, 8%)` | Quase-preto — texto e botões primários |
| `--color-green-200` | `hsl(116, 21%, 74%)` | Fundos suaves, badges, cards claros |
| `--color-green-300` | `hsl(116, 22%, 57%)` | Bordas, hovers |
| `--color-green-400` | `hsl(116, 23%, 40%)` | Texto secundário (`.text-muted`) |
| `--color-green-800` | `hsl(116, 23%, 14%)` | Painéis escuros (login, menu mobile) |
| `--color-gold-400` | `hsl(41, 65%, 47%)` | Destaques e descrições em cards escuros |
| `--color-alert` | `#d22605` | Erros de formulário |

Os tokens `--color-gray-*` são aliases legados que apontam para a escala verde — preferir os nomes `--color-green-*` em código novo.

### Grid de espaçamento

Base 8px. Escala: `2 · 4 · 8 · 12 · 16 · 18 · 24 · 32 · 48 · 64 · 96 · 128` — todas via `var(--space-N)`.

### Tipografia de título

Classes `.title-*` usam `font-family: var(--font-display)`, `font-weight: bold`, `letter-spacing: var(--letter-spacing-tight)` (−0.06em).

| Classe | Tamanho |
|---|---|
| `.title-sm` | 16px |
| `.title-lg` | 20px |
| `.title-xl` | 24px |
| `.title-2xl` | 32px |
| `.title-3xl` | 36px |

### Ícones

SVGs inline, sempre com wrapper:

```html
<span class="icon icon-16">
  <svg viewBox="0 0 16 16"><path d="..."/></svg>
</span>
```

Tamanhos: 8, 10, 12, 16, 20, 24, 40 (px)

---

## Componentes e classes principais

### Navbar

```
.navbar
  .navbar-main
    .navbar-header         ← .navbar-logo + .navbar-actions
      .navbar-actions      ← .navbar-links + .button-nav + botão localização
    .navbar-search         ← .tab-group (Marketplace/Outlet) + .search-bar + .button-cart
  .categories-bar
    .categories-toggle     ← <summary> com ícone + label + seta
    .categories-panel      ← .categories-sidebar + .categories-content
  .button-hamburger        ← mobile: abre .navbar-mobile-overlay
```

### Footer

```
.page-bottom
  .pre-footer              ← CTA centralizado
  .footer
    .footer-left           ← .footer-nav + .footer-social + .footnotes
    .footer-right          ← .button-scroll-top + .footer-logo (SVG)
```

### Cards de produto

```
.product-card
  img.product-image
  .product-card-review
  p (nome do produto)
  .product-card-supplier-info
  .product-card-stock
  p (faixa de preço)
```

---

## Convenção de nomenclatura de classes CSS

- **kebab-case** e em **inglês**. Sem abreviações (nada de `btn`, `cf`, `forn`, `ong`).
- Padrão **`bloco-elemento`** (estilo BEM, mas sem `__` ou `--`). Ex: `bento-card-title`, `supplier-rating`.
- **Botões**: prefixo `button-` quando global (`button-add-to-cart`), ou sufixo `-button` quando é elemento de um bloco (`tab-button`).
- **Estados e variantes**: sufixo descritivo — `-active`, `-large`, `-open`, `-disabled`.
- **Prefixo por componente/feature**, não por página, quando o componente é reutilizável (`bento-`, `faq-`, `contact-`).
- Termos canônicos: fornecedor = `supplier`, ONG = `ngo`, comprador = `buyer`.

---

## O que já existe

- Design system completo (tokens, fontes Cal Sans UI, reset, utilitários) — responsivo (breakpoint 1280px), apenas light mode
- Navbar e footer renderizados via `js/components.js` — menu hamburger no mobile, popup de localização, toggle Marketplace/Outlet, botão "voltar ao topo" e barra de aviso do vídeo pitch
- `index.html` — home com carrosséis de produtos funcionais (navegação por setas + arraste com o mouse)
- `pages/login-page.html` — cover com imagem + form de email + social login
- `pages/product-page.html` — galeria de imagens funcional, preços, índice de seções com scroll-spy (clica e rola até a seção), localização com copiar endereço / abrir no Maps, avaliações e perfil do fornecedor
- `pages/how-it-works-page.html` — bento por público (compradores/fornecedores/ONGs) com tab switch + barra de abas sticky + FAQ + formulário Fale Conosco **com validação em JS** (nome, e-mail, mensagem)
- `pages/register-page.html` — cadastro de produto em **wizard de 5 etapas** com validação de campos e revisão final antes de publicar

---

## Status — Fase 4 (entregue)

Requisitos obrigatórios da FIAP concluídos:

- **Validação em JS do formulário Fale Conosco** — nome (não vazio, nome + sobrenome, mín. 2 letras cada), e-mail (formato válido), mensagem (não vazia, máx. 500 caracteres)
- **Novas funcionalidades** além do formulário: carrossel de produtos, índice com scroll-spy na product-page, copiar endereço / abrir no Maps, popup de localização na navbar, botão voltar ao topo, galeria de imagens, wizard de cadastro de produto em 5 etapas
- **Responsividade** — mobile, tablet e desktop
- **Deploy em produção** — GitHub Pages (https://grupo-glyffs.github.io/Altterra/)

Decisões de design fechadas: somente light mode (sem dark mode), paleta verde + dourado, logo na navbar.

### Ideias para fases futuras

- Carregar produtos via arquivo JSON e busca/categorias funcionais
- Login e cadastro de usuário com localStorage
- Carrinho: adicionar produto e visualizar
- Pilar AgroLink (hub de doações para ONGs)
