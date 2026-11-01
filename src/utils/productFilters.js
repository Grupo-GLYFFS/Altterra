import { ALL_REGIONS } from '../data/categories'

// Funções puras de filtro/agrupamento do catálogo. Não guardam estado:
// quem decide a região escolhida é o FiltersContext, e a categoria aberta
// no painel é estado local do CategoriesPanel.
//
// Categoria e UF são DERIVADAS de campos que todo produto já tem (os do
// catálogo inicial e os publicados pelo formulário), então nenhum produto
// antigo precisa ser migrado:
//   - categoria = breadcrumb[1].label  (o formulário grava aqui o campo
//     "Categoria" escolhido ao anunciar)
//   - estado    = sufixo " - UF" de supplier.location ("Atibaia - SP")

export function getProductCategory(product) {
  return product.breadcrumb?.[1]?.label ?? ''
}

// Extrai a UF de textos como "Atibaia - SP" ou "São Paulo - SP". Devolve ''
// se não houver (ex.: "Todas as regiões").
function extractState(text) {
  const match = String(text ?? '').match(/-\s*([A-Za-z]{2})\s*$/)
  return match ? match[1].toUpperCase() : ''
}

export function getProductState(product) {
  return extractState(product.supplier?.location)
}

// Região = uma cidade da lista do popup ("São Paulo - SP"). Como o
// formulário pede a cidade em texto livre ("Ibiúna"), comparar a cidade
// exata deixaria quase tudo de fora; por isso o filtro casa pelo ESTADO
// (UF): escolher "São Paulo - SP" mostra os produtos de qualquer cidade de SP.
export function filterProductsByRegion(products, region) {
  if (region === ALL_REGIONS) return products
  const state = extractState(region)
  if (!state) return products
  return products.filter((product) => getProductState(product) === state)
}

// [{ name, products }] na ordem da lista de categorias, uma entrada por
// categoria (inclusive as sem produtos — quem renderiza decide se esconde).
export function groupProductsByCategory(products, categories) {
  return categories.map((category) => ({
    name: category.name,
    products: products.filter((product) => getProductCategory(product) === category.name),
  }))
}