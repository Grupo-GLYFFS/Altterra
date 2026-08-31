# Altterra 🌱🛒

**Projeto Publicado:** https://grupo-glyffs.github.io/Altterra/

> **Altterra** é uma plataforma B2B que atua como um *marketplace* de commodities agrícolas. Seu objetivo é conectar produtores e cooperativas diretamente a distribuidores, varejistas e ONGs, sem intermediários. Os usuários podem explorar produtos por região, comprar safras e excedentes, anunciar seus próprios produtos e acessar o *Outlet Sustentável* (itens fora do padrão estético, com desconto).

---

## Como o Projeto Funciona

O **Altterra** foi desenvolvido utilizando **React**, com **Vite** como ferramenta de desenvolvimento e build. A aplicação foi estruturada de forma componentizada, buscando manter o código organizado, reutilizável e de fácil manutenção.

A arquitetura utiliza componentes React para elementos compartilhados da interface, além de Context API e `useReducer` para gerenciamento de estados relacionados às funcionalidades da aplicação.

### Sistema de Componentes

A interface foi dividida em componentes reutilizáveis para evitar a repetição de código entre as páginas.

Elementos compartilhados, como navbar, footer, cards, formulários e outros elementos da interface, são organizados dentro de `src/components/`.

Isso permite que alterações em um componente sejam refletidas em todas as páginas que o utilizam, facilitando a manutenção e a evolução do projeto.

### Sistema de Estilização

O projeto utiliza **CSS3** para a estilização da interface, mantendo os estilos organizados dentro de `src/styles/`.

A estrutura de estilos preserva a organização visual do projeto original, utilizando variáveis CSS (*custom properties*) para centralizar decisões de design como cores, espaçamentos, tipografia e outros valores reutilizáveis.

A fonte **Cal Sans UI** continua sendo carregada localmente por meio de arquivos `.woff2`.

### Navegação e Páginas

A aplicação utiliza **React Router** para controlar a navegação entre as diferentes páginas do projeto.

As páginas principais da aplicação ficam organizadas em `src/pages/`, enquanto componentes e elementos compartilhados ficam separados em `src/components/`.

### Gerenciamento de Estado

O projeto utiliza **Context API** e `useReducer` para gerenciamento de estados compartilhados da aplicação, principalmente para as funcionalidades relacionadas ao carrinho de compras.

O sistema permite adicionar produtos, alterar quantidades, remover itens, calcular o total e manter o estado do carrinho durante a navegação entre as páginas.

---

## Arquitetura de Arquivos e Pastas

* **`/public`**

  * `images/`: imagens, logos, ícones e demais recursos estáticos.
  * `fonts/`: arquivos `.woff2` da fonte Cal Sans UI.
  * Outros arquivos públicos, como favicon e ícones.

* **`/src`**

  * `App.jsx`: componente principal da aplicação.
  * `main.jsx`: ponto de entrada da aplicação React.
  * **`/components`**: componentes reutilizáveis da interface.
  * **`/context`**: Context API e gerenciamento de estados compartilhados.
  * **`/data`**: dados utilizados pela aplicação.
  * **`/pages`**: páginas da aplicação.
  * **`/styles`**: arquivos CSS e estilos do projeto.
  * **`/utils`**: funções utilitárias e lógica auxiliar.
  * **`/assets`**: recursos utilizados diretamente pelos componentes da aplicação.

* **`/` (Raiz)**

  * `index.html`: documento HTML principal utilizado pelo Vite.
  * `package.json`: dependências e scripts do projeto.
  * `package-lock.json`: versões das dependências instaladas.
  * `vite.config.js`: configuração do Vite.
  * `eslint.config.js`: configuração do ESLint.
  * `README.md`: este documento.
  * `.gitignore`: arquivos e pastas que não devem ser enviados ao Git.

---

## Tecnologias Utilizadas

* **React** — biblioteca utilizada para construção da interface e componentização da aplicação.
* **Vite** — ferramenta utilizada para desenvolvimento e build do projeto.
* **JavaScript ES6+** — linguagem utilizada na lógica da aplicação.
* **CSS3** — estilização da interface, incluindo Grid, Flexbox e *custom properties*.
* **React Router** — gerenciamento da navegação entre páginas.
* **Context API & useReducer** — gerenciamento de estados compartilhados da aplicação.
* **Cal Sans UI** — fonte tipográfica principal, carregada localmente em `.woff2`.
* **Ícones SVG** — utilizados na interface.
* **GitHub Pages** — hospedagem do site em produção.


