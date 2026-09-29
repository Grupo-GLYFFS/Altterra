import placeholderProduto from '../assets/images/placeholder-produto.svg'
import fotoSatelite from '../assets/images/foto-satelite.png'
import { currentUser } from '../data/currentUser'

// Sufixo de preço e rótulo plural por unidade — os <option value="..."> do
// campo "unidade" no RegisterForm usam esses códigos curtos (kg, t, saca,
// caixa, duzia).
const UNIT_PRICE_SUFFIX = {
  kg: '/kg',
  t: '/t',
  saca: '/saca',
  caixa: '/caixa',
  duzia: '/dúzia',
}

const UNIT_LABEL_PLURAL = {
  kg: 'kg',
  t: 'toneladas',
  saca: 'sacas',
  caixa: 'caixas',
  duzia: 'dúzias',
}

// Gera um id de URL a partir do nome do produto + um sufixo aleatório
// (evita colisão se dois fornecedores cadastrarem produtos com nome
// parecido, ou o mesmo nome do catálogo semente).
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateProductId(name) {
  const base = slugify(name) || 'produto'
  const suffix = Math.floor(Math.random() * 10000)
  return `${base}-${suffix}`
}

// O .value de um <input type="number"> SEMPRE vem com ponto decimal
// ("4.5"), independente do idioma do navegador. Isso não pode ir direto
// pra tela nem pro carrinho: "R$ 4.5" ficaria fora do padrão do resto do
// projeto ("R$ 3,20/kg") e, pior, o parsePriceBRL trata ponto como
// separador de milhar — leria "R$ 4.5" como 45, deixando o preço no
// carrinho 10x maior. Por isso todo número vindo do formulário passa por
// aqui antes de virar texto.
function formatNumberPtBR(rawValue, { decimals = 0 } = {}) {
  const number = Number(String(rawValue).replace(',', '.'))
  if (Number.isNaN(number)) return String(rawValue)
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: Math.max(decimals, 2),
  })
}

// Recebe o objeto `values` que o RegisterForm já coleta e devolve um
// Product completo, no MESMO formato que src/data/products.js usa — por
// isso a ProductPage não precisa de nenhum tratamento especial pra
// exibir um produto publicado pelo formulário: pra ela, é só mais um
// produto do catálogo.
//
// Como o formulário não coleta tudo que a ficha completa tem (fotos reais,
// avaliações, histórico do fornecedor), os campos que faltam recebem
// valores neutros e honestos: 0 avaliações, foto placeholder, fornecedor
// marcado como "Novo no Altterra" — nada é inventado como se já
// existisse.
export function buildProductFromRegisterValues(values) {
  const unitSuffix = UNIT_PRICE_SUFFIX[values.unidade] || ''
  const unitLabel = UNIT_LABEL_PLURAL[values.unidade] || values.unidade
  // "Título do anúncio" é o campo pensado como nome de exibição (ex.:
  // "Excelente Tomate Carmem Orgânico") — "Espécie" e "Tipo" são mais
  // taxonômicos/internos e não têm um slot próprio na ficha do produto
  // ainda, então ficam coletados no formulário mas não exibidos por
  // enquanto.
  const name = values.titulo
  const supplierLocation = `${values.cidade} - ${values.estado}`

  // Preços sempre com 2 casas ("4,50"); demais medidas sem casas
  // forçadas ("6,8", "90").
  const priceMin = formatNumberPtBR(values['preco-min'], { decimals: 2 })
  const priceMax = formatNumberPtBR(values['preco-max'], { decimals: 2 })
  const ph = formatNumberPtBR(values.ph)
  const umidade = formatNumberPtBR(values.umidade)
  const avarias = formatNumberPtBR(values.avarias)
  const altitude = formatNumberPtBR(values.altitude)

  return {
    id: generateProductId(name),
    name,

    breadcrumb: [
      { label: 'Mercado padrão', href: '' },
      { label: values.categoria, href: '' },
    ],

    // Sem upload de foto no formulário ainda — mesmo placeholder já usado
    // pelo produto de demonstração do catálogo (Alface Crespa).
    gallery: [{ src: placeholderProduto, alt: 'Foto do produto em breve' }],

    description: values.descricao,

    cultivation: [
      { label: 'Modo de cultivo', value: values['modo-cultivo'] },
      { label: 'Tipo de solo', value: values['tipo-solo'] },
      { label: 'PH do solo', value: ph },
      { label: 'Umidade na colheita', value: `${umidade}%` },
      { label: 'Avarias', value: `${avarias}%` },
      { label: 'Altitude', value: `${altitude} m` },
    ],

    location: {
      image: fotoSatelite,
      address: `${values.endereco}, ${values.cidade} - ${values.estado}, CEP ${values.cep}`,
    },

    // Produto novo: zero avaliações de verdade, não inventamos nenhuma.
    ratingsSummary: {
      average: '0.0',
      totalLabel: 'Ainda sem avaliações',
      bars: [5, 4, 3, 2, 1].map((stars) => ({ stars, value: 0 })),
      max: 1,
    },
    reviews: [],

    supplier: {
      name: currentUser.nome,
      logo: placeholderProduto,
      rating: '0.0',
      reviewCount: 0,
      memberSince: new Date().getFullYear(),
      location: supplierLocation,
      description: `${currentUser.nome} é um fornecedor cadastrado na Altterra.`,
      badges: ['Novo no Altterra'],
      highlights: [
        { label: 'Modo de cultivo', value: values['modo-cultivo'] },
        { label: 'Tipo de solo', value: values['tipo-solo'] },
        { label: 'Localização', value: supplierLocation },
      ],
    },

    summary: {
      rating: '0.0',
      reviewCount: 0,
      soldStat: '0 unidades vendidas',
    },

    // O formulário só coleta 1 faixa (mínimo/máximo), diferente do
    // catálogo semente que tem 3 faixas por volume — por isso só 2 itens
    // aqui. O componente já lida com qualquer quantidade.
    prices: [
      { label: 'Preço mínimo', price: `R$ ${priceMin}${unitSuffix}` },
      { label: 'Preço máximo', price: `R$ ${priceMax}${unitSuffix}` },
    ],

    details: [
      { label: 'Disponível:', value: `${values.disponivel} ${unitLabel}` },
      { label: 'Pedido mínimo:', value: `${values.minimo} ${unitLabel}` },
      { label: 'Origem:', value: supplierLocation },
    ],

    deliveryText:
      'Método, taxa e data de entrega a serem combinados. Mande mensagem para o fornecedor para mais detalhes.',

    cta: {
      responseTime: 'Responde em até 24h',
    },

    cardSummary: {
      supplierName: currentUser.nome,
      rating: '0.0',
      distance: 'Novo',
      available: `${values.disponivel} ${unitLabel}`,
      minimum: `${values.minimo} ${unitLabel}`,
      priceRangeLabel: `R$ ${priceMin} - R$ ${priceMax}${unitSuffix}`,
      image: placeholderProduto,
    },
  }
}