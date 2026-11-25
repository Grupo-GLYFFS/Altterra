import { caminhoImagem } from '../logica/imagens.js';

// Opções de público exibidas no segmentado do topo e nos passos de Como funciona.
export const PUBLICOS = [
  { valor: 'compradores', rotulo: 'Compradores', icone: 'store' },
  { valor: 'fornecedores', rotulo: 'Fornecedores', icone: 'local_shipping' },
  { valor: 'instituicoes', rotulo: 'Instituições', icone: 'volunteer_activism' },
];

// Blocos do mosaico bento (6 peças: fotos com véu escuro ou blocos sólidos verde 8/9, nada clicável).
export const BENTO_POR_PUBLICO = {
  compradores: {
    altoEsquerda: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-comprador-direto.webp'),
      titulo: 'Compre direto de quem planta',
      texto: 'Preço por kg combinado com o produtor, sem atravessador no meio.',
    },
    topoMeio: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-comprador-rede.webp'),
      numero: '380',
      texto: 'fornecedores em 9 estados',
    },
    topoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-comprador-origem.webp'),
      titulo: 'Origem em cada lote',
      texto: 'Fazenda, data da colheita e transporte ficam no anúncio.',
    },
    meioSolido: {
      tipo: 'solido9',
      titulo: 'Do quilo à tonelada',
      texto: 'Cada fornecedor define o pedido mínimo, em kg, caixa ou t.',
    },
    altoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-comprador-outlet.webp'),
      titulo: 'Outlet Sustentável',
      texto: 'Excedente e fora do padrão de tamanho, com a mesma qualidade e preço menor.',
    },
    baseLarga: {
      tipo: 'solido8',
      numero: '1.240',
      texto: 'anúncios ativos nesta semana',
    },
  },
  fornecedores: {
    altoEsquerda: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-fornecedor-venda.webp'),
      titulo: 'Venda sua colheita sem intermediários',
      texto: 'Defina faixas de preço por volume e receba pedidos de mercados e restaurantes.',
    },
    topoMeio: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-fornecedor-galpao.webp'),
      numero: '94%',
      texto: 'dos pedidos confirmados no mesmo dia',
    },
    topoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-fornecedor-excedente.webp'),
      titulo: 'Escoe excedentes no Outlet',
      texto: 'Lotes fora do calibre vendem mais rápido com selo de desconto.',
    },
    meioSolido: {
      tipo: 'solido9',
      titulo: 'Controle na sua mão',
      texto: 'Pause, edite preço ou atualize estoque em segundos pelo painel.',
    },
    altoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-fornecedor-safra.webp'),
      titulo: 'Safra que Alimenta',
      texto: 'Doe o que sobrar para instituições cadastradas e mostre o selo na sua loja.',
    },
    baseLarga: {
      tipo: 'solido8',
      numero: '0%',
      texto: 'de custo para anunciar na plataforma',
    },
  },
  instituicoes: {
    altoEsquerda: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-instituicao-doacao.webp'),
      titulo: 'Alimento doado por quem produz',
      texto: 'Fornecedores da sua região doam frutas, verduras e legumes que não foram vendidos.',
    },
    topoMeio: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-instituicao-cozinha.webp'),
      numero: '38 t',
      texto: 'doadas desde março de 2026',
    },
    topoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-instituicao-retirada.webp'),
      titulo: 'Retirada combinada',
      texto: 'Dia e horário acertados com o fornecedor pela plataforma.',
    },
    meioSolido: {
      tipo: 'solido9',
      titulo: 'Cadastro sem custo',
      texto: 'CNPJ, endereço e público atendido enviados pelo Fale conosco.',
    },
    altoDireita: {
      tipo: 'foto',
      imagem: caminhoImagem('cf-instituicao-alimentos.webp'),
      titulo: 'Frutas, verduras e legumes',
      texto: 'O que chega depende da safra de cada região.',
    },
    baseLarga: {
      tipo: 'solido8',
      numero: '57',
      texto: 'cidades com instituições atendidas',
    },
  },
};

// Quatro passos por público, sem botão depois.
export const PASSOS_POR_PUBLICO = {
  compradores: [
    { numero: 1, titulo: 'Crie sua conta', texto: 'Use o CNPJ da empresa e o endereço de entrega. O acesso entra na hora.' },
    { numero: 2, titulo: 'Encontre o produto', texto: 'Busque por nome, categoria ou região. Ligue o filtro Outlet para excedentes.' },
    { numero: 3, titulo: 'Monte o pedido', texto: 'Adicione a partir do pedido mínimo de cada fornecedor, em kg, t ou caixa.' },
    { numero: 4, titulo: 'Combine o frete e receba', texto: 'Retire na origem ou use o frete do fornecedor. Acompanhe em Meus pedidos.' },
  ],
  fornecedores: [
    { numero: 1, titulo: 'Cadastre a produção', texto: 'Informe o CNPJ, o tipo de negócio e o endereço da fazenda ou cooperativa.' },
    { numero: 2, titulo: 'Publique o anúncio', texto: 'Escolha a categoria, coloque as faixas de preço por volume e o estoque.' },
    { numero: 3, titulo: 'Receba os pedidos', texto: 'Acompanhe em Pedidos recebidos e avance o status conforme separa e envia.' },
    { numero: 4, titulo: 'Doe o excedente', texto: 'No Safra que Alimenta, escolha uma instituição próxima para retirar a sobra.' },
  ],
  instituicoes: [
    { numero: 1, titulo: 'Peça o cadastro', texto: 'Envie o nome da instituição, CNPJ e cidade pelo formulário Fale conosco.' },
    { numero: 2, titulo: 'Informe o que recebe', texto: 'Conte quais alimentos a cozinha usa e os horários disponíveis para retirada.' },
    { numero: 3, titulo: 'Combine a retirada', texto: 'Quando um fornecedor registra uma doação, a retirada é feita no galpão dele.' },
    { numero: 4, titulo: 'Acompanhe o impacto', texto: 'Cada lote retirado entra no total de quilos doados pelo programa.' },
  ],
};

// Perguntas frequentes com filtro por público.
export const PERGUNTAS_FAQ = [
  {
    id: 'cadastro-comprador',
    publico: 'compradores',
    titulo: 'Como faço meu cadastro como comprador?',
    conteudo: 'O cadastro é gratuito. Informe o CNPJ, a razão social e o endereço de entrega. A conta entra liberada na hora.',
  },
  {
    id: 'pedido-minimo',
    publico: 'compradores',
    titulo: 'Qual é o pedido mínimo?',
    conteudo: 'Cada anúncio mostra o mínimo por produto, como 50 kg ou 100 kg. Quanto maior o volume, menor o preço por quilo.',
  },
  {
    id: 'outlet',
    publico: 'compradores',
    titulo: 'O que é o Outlet Sustentável?',
    conteudo: 'É o filtro para lotes com excedente de colheita ou fora do padrão visual de tamanho, com a mesma qualidade e preço reduzido.',
  },
  {
    id: 'anunciar',
    publico: 'fornecedores',
    titulo: 'Como publico um produto como fornecedor?',
    conteudo: 'Com uma conta de fornecedor, abra "Anunciar produto", preencha os dados do lote, as faixas de preço e o CEP de origem.',
  },
  {
    id: 'frete-fornecedor',
    publico: 'fornecedores',
    titulo: 'Quem cuida da entrega dos pedidos?',
    conteudo: 'O fornecedor informa o prazo e o frete por região, e o comprador também pode optar por retirar o lote diretamente na origem.',
  },
  {
    id: 'instituicao-cadastro',
    publico: 'instituicoes',
    titulo: 'Como minha instituição entra no Safra que Alimenta?',
    conteudo: 'Envie uma mensagem pelo Fale conosco nesta página informando o CNPJ, a cidade e os dias de retirada disponíveis.',
  },
];

export const ASSUNTOS_CONTATO = [
  'Dúvida sobre compras',
  'Dúvida sobre anúncios',
  'Cadastro de instituição no Safra que Alimenta',
  'Problema com pedido',
  'Outro assunto',
];
