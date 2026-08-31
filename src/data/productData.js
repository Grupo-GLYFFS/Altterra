import tomateCarmem from '../assets/images/tomate-carmem.png';
import tomateCarmem2 from '../assets/images/tomate-carmem-2.png';
import tomateCarmem3 from '../assets/images/tomate-carmem-3.png';
import tomateCarmem4 from '../assets/images/tomate-carmem-4.png';
import tomateCarmem5 from '../assets/images/tomate-carmem-5.png';
import fotoSatelite from '../assets/images/foto-satelite.png';
import cooperativaLogo from '../assets/images/cooperativa-logo.png';
import distribuidoraSaoJoao from '../assets/images/distribuidora-saojoao.png';

// Espelha 1:1 o conteúdo estático que estava em pages/product-page.html.
// Nenhum valor foi inventado ou alterado — apenas extraído do HTML para dado.

export const product = {
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
    // valores originais do <meter> (min 0, max 211, value 100 para todas as barras)
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
};
