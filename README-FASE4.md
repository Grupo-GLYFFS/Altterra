# Altterra — Fase 4 (entrega)

Marketplace B2B do agronegócio. Site estático em **HTML/CSS/JS puro**, sem framework e sem build.

## Como rodar
O carregamento dos produtos usa `fetch` no `data/produtos.json`, então **precisa de um servidor local** (abrir via `file://` quebra).
- **VS Code:** instale a extensão *Live Server* e clique em **Go Live**.
- **Ou pelo terminal**, na raiz do projeto: `python -m http.server` e abra `http://localhost:8000`.

## Páginas (são 5)
- `index.html` — Home: busca, categorias, resultados e carrossel das seções.
- `pages/product-page.html` — página de produto, **dinâmica via `?id=`** (ex.: `product-page.html?id=alface-crespa`).
- `pages/cadastro-page.html` — cadastro de produto (tabs + validação).
- `pages/como-funciona-page.html` — Como funciona (tabs *Fornecedores* / *ONGs*) + formulário de ajuda.
- `pages/login-page.html` — login.

## O que foi feito nesta fase (Linear)
- **AGTECH-24/25** — produtos em `data/produtos.json`, carregados por JS (`js/produtos.js`).
- **AGTECH-27** — busca funcional (`js/home.js`).
- **AGTECH-28/29** — categorias no dropdown + clique que filtra.
- **AGTECH-30** — carrossel das seções (paginação de 6 em 6 nos botões de seta).
- **AGTECH-31** — clicar numa categoria leva para os resultados.
- **AGTECH-13** — página de produto dinâmica (`js/produto.js`).
- **AGTECH-21/23** — paleta clara/escura + toggle (`js/tema.js`; tokens no `css/variables.css`).
- **AGTECH-14/15/16** — Cadastro: tabs, tabs funcionais e validação dos campos.
- **AGTECH-17/18/19/20** — Como funciona: design, tabs e validação do formulário.
- **AGTECH-22** — responsividade (`css/fase4.css`).

## O que falta fazer 
- **AGTECH-26 — fotos dos produtos:** 
- **AGTECH-33 — pitch vídeo:**

## Arquivos novos / alterados / removidos
- **Novos:** `js/home.js`, `js/produto.js`, `js/tema.js`, `js/validacao.js`, `js/cadastro.js`, `js/como-funciona.js`, `css/fase4.css`, `pages/cadastro-page.html`, `pages/como-funciona-page.html`.
- **Alterados:** `js/produtos.js` (virou biblioteca de dados; a Home agora é controlada pelo `home.js`), `css/variables.css` (tema escuro + correção da variável `--color-gray-600`), `index.html`, `pages/product-page.html`, `pages/login-page.html`.
- **Removido:** `pages/contact-page.html` (o formulário de contato virou a seção de ajuda do *Como funciona*; os links de "Ajuda" agora apontam pra lá).
