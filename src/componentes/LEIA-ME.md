# Componentes da base — Altterra

Guia rápido para a fase 2 (telas). Veja exemplos interativos na rota `/componentes`.
Todas as cores, espaçamentos e raios vêm de `src/tema.js` e `src/estilos/global.css`. Nunca escreva hex nos CSS Modules.

## Layout (`src/componentes/layout/`)
- **`Pagina`**: envolve toda tela com `Navbar`, container único de 1200 px e `Rodape`. Props: `titulo`, `mostrarNavbar`, `mostrarRodape`, `itensCarrinho`, `usuario`.
- **`Navbar`**: barra escura responsiva (computador com Categorias, Região, Busca e Carrinho; celular com Categorias + Busca no topo, barra fixa Início/Busca/Mais embaixo, gavetas de baixo e carrinho flutuante só quando `itensCarrinho > 0`).
- **`Rodape`**: pré-rodapé com busca + rodapé verde 8 com Páginas, Social, notas e "Subir ao topo".

## Ícones e marca
- **`Icone`**: `<Icone nome="shopping_cart" tamanho={16|20|24|28|32} preenchido />` (Material Symbols Rounded).
- **`LogoAltterra`**: SVG inline com `variante="claro"` (fundo escuro) ou `variante="escuro"` (fundo claro) e `tamanho="sm"|"md"|"lg"`.

## Ações e controles
- **`Botao`**: variantes `principal`, `secundario`, `terciario`, `perigo`, `icone` (`sobreFoto` para favorito na foto); tamanhos `lg` (64), `md` (56), `sm` (44); props `larguraTotal`, `carregando`, `desabilitado`, `iconeEsquerda`, `iconeDireita`, `para`.
- **`SeletorQuantidade`**: pill editável com menos/lixeira e mais. `tamanho="md"` (56) na página do produto e `tamanho="sm"` (44) na linha do carrinho (`permitirRemover` + `aoRemover`).
- **`Chip`**: filtro em pill de 44 px (`ativo`, `comBorda`, `contagem`, `icone`, `iconeDireita`, `aoRemover`).
- **`ControleSegmentado`**: pill em trilho cinza 1 com ativo verde 7 (`opcoes`, `valor`, `aoAlterar`, `tamanho="md"|"sm"`).
- **`Abas`**: abas sublinhadas em verde 7 com contador em pill (`itens`, `ativa`, `aoAlterar`).
- **`IndiceProduto`**: barra fixa de seções da página do produto com preço e botão compacto.
- **`Acordeao`**: lista recolhível com divisórias (`itens`, `abertoInicial`, `multiplo`).

## Formulários (`Campo.jsx`, padrão C5)
- **`BlocoFormulario`**: card branco (`fieldset`) com título e descrição para formulários longos.
- **`CampoTexto`**: rótulo em cima, `opcional` acrescenta "(opcional)", `prefixo`/`sufixo` em segmento cinza 1, `erro`, `dica`, `carregando`, `sucesso`, `somenteLeitura`.
- **`CampoSelect`** e **`CampoArea`**: mesmo padrão visual (56 px / raio 8 / borda cinza 5).
- **`GrupoRadio`** (`cartao` para Radio.Card), **`Checkbox`** (24 px) e **`Interruptor`** (52x32).
- **`IndicadorEtapas`**: trilho de etapas em pílulas no computador e círculos no celular.

## Produtos e miúdos
- **`CardProduto`** (K4): fornecedor primeiro + foto 4:3 + selos + favorito + nome/nota/preço/estoque. Sem "+ Adicionar". Props: `produto`, `favoritado`, `aoAlternarFavorito`, `ocultarFornecedor`, `carregando`.
- **`CardProdutoHorizontal`** (K5): card em linha para listas, 404 e carrinho (`mostrarSeletor` habilita o `SeletorQuantidade` exclusivamente na linha do carrinho).
- **`Selo`**: pill com ícone (`outlet`, `organico`, `novo`, `verificado`, `doador`, `sucesso`, `aviso`, `erro`, `info`, `neutro`).
- **`Avatar`** e **`IdentidadeFornecedor`**: avatar redondo sem borda (32/44/56/96) com fallback para iniciais; `verified` preenchido após o nome.
- **`NotaCompacta`**, **`Estrelas`**, **`ResumoAvaliacoes`**, **`SeletorNota`**: estrelas em dourado 8 (`#876b1c`) com nota numérica sempre visível.
- **`Contador`** e **`PontoIndicador`**: círculo 24 px (`md`) ou 28 px (`lg`) com `99+` em pill; variantes `claro` (verde 7) e `barra` (branco/verde 8).
- **`Divisor`**, **`CabecalhoSecao`** e **`LinkTexto`**.

## Feedback e sobreposições
- **`Aviso`**: card branco com cor só no ícone (`sucesso`, `aviso`, `erro`, `info`).
- **`EstadoVazio`**, **`EstadoErro`**, **`Carregando`**: estados padronizados para todas as telas.
- **`ModalBase`** e **`Gaveta`**: modal no computador vira gaveta branca de baixo no celular; `Gaveta` aceita `escura` só para a navbar.
- **`MenuOrdenar`**: gatilho sempre em pill com lista de rádio (gaveta no celular).
- **`TooltipBase`** e **`PopoverBase`**: claros, com sombra e sem seta.
- **`ToastCarrinho`**, **`ProvedorToast`** e **`useToast`**: notificação de item adicionado ao carrinho.
