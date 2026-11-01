// Compressão de imagens no navegador (sem bibliotecas).
//
// Por que existe: o localStorage tem cota pequena (~5 MB por origem) e uma
// foto de celular tem 3–8 MB. Guardar o arquivo cru em Base64 estouraria a
// cota com UMA foto. Aqui cada foto é redimensionada e recomprimida em
// JPEG antes de ser guardada — fica em dezenas de KB.

export const MAX_PHOTOS = 5 // 1 capa + 4 extras
export const MAX_EXTRA_PHOTOS = MAX_PHOTOS - 1
export const MAX_FILE_BYTES = 8 * 1024 * 1024 // arquivo ORIGINAL, antes de comprimir
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Tamanho máximo (lado maior, em px) e qualidade JPEG de cada uso.
const COVER = { maxSize: 800, quality: 0.75 }
const EXTRA = { maxSize: 640, quality: 0.7 }
const THUMB = { maxSize: 160, quality: 0.7 } // carrinho e pedidos

// Devolve a mensagem de erro, ou '' se o arquivo é aceitável.
export function validateImageFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" não é uma imagem válida. Use JPG, PNG ou WebP.`
  }
  if (file.size > MAX_FILE_BYTES) {
    return `"${file.name}" é maior que 8 MB. Escolha uma foto menor.`
  }
  return ''
}

// Decodifica o arquivo respeitando a rotação EXIF (fotos de celular).
async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // cai no <img> abaixo
    }
  }

  const url = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('decode'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

// Desenha a imagem num canvas reduzido (nunca amplia) e exporta como
// JPEG em Base64 (data URL). Fundo branco: PNGs com transparência
// ficariam pretos em JPEG.
function drawToDataUrl(source, { maxSize, quality }) {
  const width = source.width
  const height = source.height
  const scale = Math.min(1, maxSize / Math.max(width, height))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', quality)
}

// Processa UMA foto escolhida pelo usuário. Devolve:
//   src   — versão principal (capa 800 px, ou extra 640 px)
//   thumb — miniatura 160 px, usada pelo carrinho e pelos pedidos
// `role` é 'cover' ou 'extra'.
export async function processPhoto(file, role) {
  const error = validateImageFile(file)
  if (error) throw new Error(error)

  let source
  try {
    source = await decodeImage(file)
  } catch {
    throw new Error(`Não foi possível ler "${file.name}". O arquivo pode estar corrompido.`)
  }

  const main = role === 'cover' ? COVER : EXTRA
  const result = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    src: drawToDataUrl(source, main),
    thumb: drawToDataUrl(source, THUMB),
  }

  if (typeof source.close === 'function') source.close() // libera o ImageBitmap
  return result
}