# Altterra 🌱🛒

**Projeto Publicado:** [https://grupo-glyffs.github.io/Altterra/](https://grupo-glyffs.github.io/Altterra/)

> **Altterra** é uma plataforma B2B que atua como um *marketplace* de commodities agrícolas. Seu objetivo é conectar produtores e cooperativas diretamente a distribuidores, varejistas e ONGs, sem intermediários. Os usuários podem explorar produtos por região, comprar safras e excedentes, anunciar seus próprios produtos e acessar o *Outlet Sustentável* (itens fora do padrão estético, com desconto).

---

## Como o Projeto Funciona

Diferente de projetos pesados construídos com React ou Angular, o **Altterra** foi construído utilizando puramente **HTML5, CSS3 e JavaScript (Vanilla)** — zero frameworks, zero bibliotecas externas, zero etapa de compilação (*build*). Para manter o código limpo, organizado e reutilizável, criamos nossos próprios sistemas de componentização e de design tokens, inspirados nos frameworks modernos.

### O Sistema de Componentes (`js/components.js`)
Para evitar a repetição de código (DRY) — como copiar e colar o mesmo cabeçalho (`navbar`) e rodapé (`footer`) em todas as páginas — criamos um carregador de componentes.
Cada página possui marcações vazias, como `<div id="navbar-root"></div>` e `<div id="footer-root"></div>`. Quando a página termina de carregar, o `components.js` injeta nessas marcações o HTML completo do navbar e do footer gerado em JavaScript.
Isso significa que, se alterarmos um link do menu, ele é atualizado em **todas as páginas** instantaneamente. O carregador também resolve os caminhos de forma **relativa à profundidade da página**, garantindo que logos e links funcionem tanto abrindo o `index.html` localmente (`file://`) quanto no GitHub Pages (`/Altterra/`) ou no Live Server.

### O Sistema de Estilização (Design Tokens em CSS puro)
Em vez de um framework como Tailwind ou Bootstrap, usamos **CSS3 nativo com variáveis (*custom properties*)**. Todas as decisões de design — cores, espaçamentos, tipografia, arredondamentos e camadas (*z-index*) — ficam centralizadas em `css/variables.css`. Qualquer componente referencia esses tokens via `var(--...)`, nunca valores fixos.
- **Paleta:** escala verde (matiz 116) + escala dourada, em modo claro (*light*).
- **Espaçamento:** grid de 8px (`var(--space-8)`, `var(--space-16)`…).
- **Tipografia:** fonte própria **Cal Sans UI**, carregada localmente via `@font-face` (`css/reset.css`).
Cada página tem ainda seu CSS exclusivo em `css/pages/`, enquanto os estilos compartilhados (navbar, footer, cards, formulários) vivem em `css/components.css`.

### O Sistema de Validação de Formulários (`js/pages/`)
Atendendo ao requisito da Fase 4, os formulários têm validação inteiramente em JavaScript (sem back-end):
- **Fale Conosco** (`how-it-works-page.js`): valida nome (nome + sobrenome, mín. 2 letras cada), e-mail (formato válido) e mensagem (não vazia, máx. 500 caracteres), com mensagens de erro inline.
- **Cadastro de Produto** (`register-page.js`): *wizard* de 5 etapas que valida cada campo (preços, CEP, quantidades, etc.) e exibe uma revisão final antes de publicar.

### O Sistema de Interação Visual (JS puro)
Em vez de depender de bibliotecas pesadas para carrosséis, menus e galerias, escrevemos um núcleo focado apenas nas nossas necessidades de UI:
- **Carrossel** (`carousel.js`): navegação por setas e arraste com o mouse, com encaixe no card.
- **Product Page** (`product-page.js`): galeria de imagens, índice de seções com *scroll-spy* (clica e rola até a seção; ao rolar, destaca a seção atual) e botões de copiar endereço / abrir no Google Maps.
- **Navbar** (`components.js`): menu hambúrguer no mobile, popup de seleção de região, toggle Marketplace/Outlet e botão "voltar ao topo".

---

## Arquitetura de Arquivos e Pastas

*   **`/` (Raiz)**
    *   `index.html`: A *Home* / Marketplace, com carrosséis de produtos.
    *   `README.md`: Este documento.
*   **`/pages` (Páginas Internas)**
    *   `login-page.html`: Tela de acesso à conta (cover + login social + e-mail).
    *   `product-page.html`: Detalhe de um produto (galeria, preços, localização, avaliações e perfil do fornecedor).
    *   `how-it-works-page.html`: Página "Como Funciona", explicada por público (compradores, fornecedores e ONGs), com FAQ e formulário Fale Conosco.
    *   `register-page.html`: Cadastro de produto em *wizard* de 5 etapas.
*   **`/js` (Lógica do Projeto)**
    *   `components.js`: Gera e injeta o navbar e o footer em todas as páginas.
    *   `carousel.js`: Lógica do carrossel de produtos.
    *   `/pages`: Scripts exclusivos de cada página (`product-page.js`, `how-it-works-page.js`, `register-page.js`).
*   **`/css`**
    *   `variables.css`: Design tokens (cores, espaçamentos, tipografia, z-index).
    *   `reset.css`: `@font-face` da Cal Sans UI + reset global.
    *   `utilities.css`: Classes utilitárias (`.icon-*`, `.title-*`, `.text-*`, `.sr-only`).
    *   `components.css`: Estilos compartilhados (navbar, footer, categorias, cards, formulários).
    *   `/pages`: CSS exclusivo de cada página.
*   **`/fonts`**
    *   Arquivos `.woff2` da fonte **Cal Sans UI**.
*   **`/images`**
    *   Logos, ícones SVG e fotos de produtos, locais e fornecedores.

---

## Tecnologias Utilizadas

*   **HTML5 & CSS3** (Nativo / Vanilla — Grid, Flexbox e *custom properties*)
*   **JavaScript ES6+** (manipulação do DOM, *template literals* para componentização, sem dependências externas)
*   **Cal Sans UI** (fonte tipográfica principal, carregada localmente em `.woff2`)
*   **Ícones SVG** (inline, sem bibliotecas de ícones)
*   **GitHub Pages** (hospedagem do site em produção)

