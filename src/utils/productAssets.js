import placeholderProduto from '../assets/images/placeholder-produto.svg'
import fotoSatelite from '../assets/images/foto-satelite.png'

// Imagens do projeto (placeholder, foto de satélite) NÃO podem ser gravadas
// no localStorage como URL: o Vite coloca um hash no nome do arquivo
// (placeholder-produto-AbC123.svg) que muda a cada build, e a URL salva
// deixaria de existir depois de um novo deploy.
//
// Por isso um produto publicado guarda só uma CHAVE estável
// ('asset:placeholder', 'asset:satellite') e a URL real é resolvida na
// hora de ler (hydrateProduct). Fotos enviadas pelo usuário são Base64 e
// continuam sendo guardadas como estão.
export const ASSET_KEYS = {
  placeholder: 'asset:placeholder',
  satellite: 'asset:satellite',
}

const ASSET_URLS = {
  [ASSET_KEYS.placeholder]: placeholderProduto,
  [ASSET_KEYS.satellite]: fotoSatelite,
}

// Converte uma chave (ou uma URL antiga já gravada pelas fases anteriores,
// com o hash de um build passado) na URL atual. Qualquer outro valor
// (Base64 enviado pelo usuário, URL externa) passa sem alteração.
export function resolveAsset(src) {
  if (typeof src !== 'string') return src
  if (ASSET_URLS[src]) return ASSET_URLS[src]
  if (src.includes('placeholder-produto')) return placeholderProduto
  if (src.includes('foto-satelite')) return fotoSatelite
  return src
}

// Devolve o produto com todas as imagens resolvidas para URLs utilizáveis.
export function hydrateProduct(product) {
  return {
    ...product,
    gallery: product.gallery.map((image) => ({ ...image, src: resolveAsset(image.src) })),
    location: { ...product.location, image: resolveAsset(product.location.image) },
    supplier: { ...product.supplier, logo: resolveAsset(product.supplier.logo) },
    cardSummary: {
      ...product.cardSummary,
      image: resolveAsset(product.cardSummary.image),
    },
  }
}