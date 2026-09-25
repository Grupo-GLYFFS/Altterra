import alfaceCrespa from '../assets/images/alface-crespa.png'
import tomateCarmem from '../assets/images/tomate-carmem.png';
import tomateCarmem2 from '../assets/images/tomate-carmem-2.png';
import tomateCarmem3 from '../assets/images/tomate-carmem-3.png';
import tomateCarmem4 from '../assets/images/tomate-carmem-4.png';
import tomateCarmem5 from '../assets/images/tomate-carmem-5.png';
import fotoSatelite from '../assets/images/foto-satelite.png';
import cooperativaLogo from '../assets/images/cooperativa-logo.png';
import distribuidoraSaoJoao from '../assets/images/distribuidora-saojoao.png';
import placeholderProduto from '../assets/images/placeholder-produto.svg';

// Catálogo de produtos — substitui o antigo productData.js, que só tinha
// 1 produto fixo (Tomate Carmem). Cada objeto aqui segue EXATAMENTE o
// mesmo formato que a ProductPage já esperava: para cadastrar um produto
// novo, basta adicionar mais um objeto a este array com esses mesmos
// campos preenchidos — nenhum componente da página precisa mudar.
//
// `cardSummary` existe à parte porque é um resumo mais enxuto, usado nos
// cards de listagem (Home, Produtos similares) — que mostram só nome,
// fornecedor, nota, distância, estoque e faixa de preço, não a ficha
// completa.
export const products = [
  {
    id: 'tomate-carmem',
    name: 'Tomate Carmem',
    breadcrumb: [
      { label: 'Mercado padrão', href: '' },
      { label: 'Frutas', href: '' },
    ],
    gallery: [
      { src: tomateCarmem, alt: 'Vista 1 do Tomate Carmem' },
      { src: tomateCarmem2, alt: 'Vista 2 do Tomate Carmem' },
      { src: tomateCarmem3, alt: 'Vista 3 do Tomate Carmem' },
      { src: tomateCarmem4, alt: 'Vista 4 do Tomate Carmem' },
      { src: tomateCarmem5, alt: 'Vista 5 do Tomate Carmem' },
    ],
    description:
      'Tomate de mesa cultivado com práticas agroecológicas focadas em regeneração do solo. Excelente calibre médio (padronizado), coloração vermelho intenso e alta resistência pós-colheita, ideal para distribuição em grandes redes de varejo ou processamento industrial premium.',
    cultivation: [
      { label: 'Modo de cultivo', value: 'Orgânico certificado' },
      { label: 'PH do solo', value: '6,4 (ideal)' },
      { label: 'Umidade na colheita', value: '92%' },
      { label: 'Avarias', value: 'Menos de 2%' },
      { label: 'Altitude', value: '800m' },
      { label: 'Tipo de solo', value: 'Argilo-arenoso' },
    ],
    location: {
      image: fotoSatelite,
      address: 'Rodovia Dom Pedro I, km 74 - Pinhal, Atibaia, SP, 12940-000',
    },
    ratingsSummary: {
      average: '4.23',
      totalLabel: 'Baseado em 211 avaliações',
      bars: [
        { stars: 5, value: 100 },
        { stars: 4, value: 100 },
        { stars: 3, value: 100 },
        { stars: 2, value: 100 },
        { stars: 1, value: 100 },
      ],
      max: 211,
    },
    reviews: [
      {
        id: 'review-1',
        reviewer: 'Distribuidora São João',
        image: distribuidoraSaoJoao,
        stars: 5,
        date: '2026-03-12',
        dateLabel: '12 Mar 2026',
        text: 'Excelente padrão de qualidade. Tomates chegaram firmes e com ótima coloração. Compraremos novamente.',
      },
      {
        id: 'review-2',
        reviewer: 'Distribuidora São João',
        image: distribuidoraSaoJoao,
        stars: 5,
        date: '2026-03-12',
        dateLabel: '12 Mar 2026',
        text: 'Excelente padrão de qualidade. Tomates chegaram firmes e com ótima coloração. Compraremos novamente.',
      },
    ],
    supplier: {
      name: 'Cooperativa Vale Verde',
      logo: cooperativaLogo,
      rating: '4.89',
      reviewCount: 396,
      memberSince: 2021,
      location: 'Atibaia - SP',
      description:
        'Fundada em 2010, a Cooperativa Vale Verde reúne mais de 50 famílias de pequenos produtores da região bragantina, com foco em agricultura regenerativa e orgânica.',
      badges: ['Pequeno produtor', 'Doador ativo'],
      highlights: [
        { label: 'Certificações', value: 'IBD, GlobalGAP' },
        { label: 'Área plantada', value: '120 hectares' },
        { label: 'Capacidade anual', value: '2.500 toneladas' },
      ],
    },
    summary: {
      rating: '4.3',
      reviewCount: 211,
      soldStat: '50.000 toneladas vendidas',
    },
    prices: [
      { label: 'De 50 a 100t', price: 'R$ 3,20/kg' },
      { label: 'De 100 a 300t', price: 'R$ 3,00/kg' },
      { label: '300t ou mais', price: 'R$ 2,80/kg' },
    ],
    details: [
      { label: 'Disponível:', value: '500 toneladas' },
      { label: 'Pedido mínimo:', value: '50 toneladas' },
      { label: 'Origem:', value: 'Atibaia - SP (a 12 km de você)' },
      { label: 'Próxima safra:', value: 'Agosto/2026' },
    ],
    deliveryText:
      'Método, taxa e data de entrega a serem combinados. Mande mensagem para o fornecedor para mais detalhes.',
    cta: {
      responseTime: 'Responde em até 2h',
    },
    cardSummary: {
      supplierName: 'Cooperativa Vale Verde',
      rating: '4.89',
      distance: '12km',
      available: '500t',
      minimum: '50t',
      priceRangeLabel: 'R$2,80 - R$3,20/kg',
      image: tomateCarmem,
    },
  },

  // Segundo produto do catálogo — usado para PROVAR que o template da
  // ProductPage funciona com dados diferentes, não só com o Tomate Carmem.
  // As fotos ainda são um placeholder (ver placeholder-produto.svg): o
  // projeto só tem fotografia real do tomate por enquanto. Tudo o mais
  // (fornecedor, avaliações, localização) reaproveita ativos genéricos já
  // existentes, porque são plausivelmente os mesmos independente do
  // produto (a mesma cooperativa vende vários vegetais, o mesmo comprador
  // pode avaliar produtos diferentes).
  {
    id: 'alface-crespa',
    name: 'Alface Crespa',
    breadcrumb: [
      { label: 'Mercado padrão', href: '' },
      { label: 'Verduras e folhas', href: '' },
    ],
    gallery: [
      { src: placeholderProduto, alt: 'Foto do produto em breve' },
      { src: alfaceCrespa, alt: 'Vista 1 da Alface Crespa' },
      { src: alfaceCrespa, alt: 'Vista 1 da Alface Crespa' },
      { src: alfaceCrespa, alt: 'Vista 1 da Alface Crespa' },
      { src: alfaceCrespa, alt: 'Vista 1 da Alface Crespa' },
    ],
    description:
      'Alface crespa fresca, colhida sob encomenda para garantir folhas crocantes e coloração viva. Cultivo em sistema hidropônico com controle rigoroso de temperatura, ideal para redes de varejo e food service que exigem padrão constante durante o ano todo.',
    cultivation: [
      { label: 'Modo de cultivo', value: 'Hidropônico' },
      { label: 'PH da solução', value: '6,0 (ideal)' },
      { label: 'Umidade na colheita', value: '95%' },
      { label: 'Avarias', value: 'Menos de 1%' },
      { label: 'Altitude', value: '820m' },
      { label: 'Tipo de substrato', value: 'Espuma fenólica' },
    ],
    location: {
      image: fotoSatelite,
      address: 'Estrada Municipal SP-360, km 12 - Zona Rural, Atibaia, SP, 12943-000',
    },
    ratingsSummary: {
      average: '4.6',
      totalLabel: 'Baseado em 2 avaliações',
      bars: [
        { stars: 5, value: 2 },
        { stars: 4, value: 0 },
        { stars: 3, value: 0 },
        { stars: 2, value: 0 },
        { stars: 1, value: 0 },
      ],
      max: 2,
    },
    reviews: [
      {
        id: 'review-1',
        reviewer: 'Distribuidora São João',
        image: distribuidoraSaoJoao,
        stars: 5,
        date: '2026-05-02',
        dateLabel: '02 Mai 2026',
        text: 'Folhas bem crocantes e chegaram sem nenhuma murcha. Padrão consistente lote a lote.',
      },
    ],
    supplier: {
      name: 'Cooperativa Vale Verde',
      logo: cooperativaLogo,
      rating: '4.89',
      reviewCount: 396,
      memberSince: 2021,
      location: 'Atibaia - SP',
      description:
        'Fundada em 2010, a Cooperativa Vale Verde reúne mais de 50 famílias de pequenos produtores da região bragantina, com foco em agricultura regenerativa e orgânica.',
      badges: ['Pequeno produtor', 'Doador ativo'],
      highlights: [
        { label: 'Certificações', value: 'IBD, GlobalGAP' },
        { label: 'Área plantada', value: '120 hectares' },
        { label: 'Capacidade anual', value: '2.500 toneladas' },
      ],
    },
    summary: {
      rating: '4.6',
      reviewCount: 2,
      soldStat: '8.000 unidades vendidas',
    },
    prices: [
      { label: 'De 500 a 2.000 un.', price: 'R$ 1,90/un' },
      { label: 'De 2.000 a 5.000 un.', price: 'R$ 1,70/un' },
      { label: '5.000 un. ou mais', price: 'R$ 1,50/un' },
    ],
    details: [
      { label: 'Disponível:', value: '6.000 unidades' },
      { label: 'Pedido mínimo:', value: '500 unidades' },
      { label: 'Origem:', value: 'Atibaia - SP (a 14 km de você)' },
      { label: 'Próxima colheita:', value: 'Semanal' },
    ],
    deliveryText:
      'Método, taxa e data de entrega a serem combinados. Mande mensagem para o fornecedor para mais detalhes.',
    cta: {
      responseTime: 'Responde em até 4h',
    },
    cardSummary: {
      supplierName: 'Cooperativa Vale Verde',
      rating: '4.6',
      distance: '14km',
      available: '6.000 un.',
      minimum: '500 un.',
      priceRangeLabel: 'R$1,50 - R$1,90/un',
      image: placeholderProduto,
    },
  },
];

// Busca um produto pelo id (usado pela rota dinâmica /product/:productId).
// Devolve undefined se não existir — quem chama decide o que fazer nesse
// caso (a ProductPage mostra uma mensagem de "produto não encontrado").
export function getProductById(id) {
  return products.find((product) => product.id === id);
}