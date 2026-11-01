import { useState } from 'react'
import {
  ACCEPTED_TYPES,
  MAX_EXTRA_PHOTOS,
  MAX_PHOTOS,
  processPhoto,
} from '../../utils/imageCompress'
import { getStorageUsageRatio } from '../../utils/storage'

// Bloco "Fotos do produto" da etapa 1. O estado das fotos mora no
// RegisterForm (`photos` = { cover, extras }) — este componente só mostra
// e pede alterações. Fica FORA do formRef/`elements`, porque um arquivo
// precisa ser processado (comprimido) antes de virar dado do produto.
//
// Tudo é opcional. Cada arquivo é validado e comprimido no navegador
// (ver utils/imageCompress.js) antes de entrar no estado.
function RegisterPhotos({ photos, onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const usageRatio = getStorageUsageRatio()
  const extrasFull = photos.extras.length >= MAX_EXTRA_PHOTOS

  async function handleCover(event) {
    const file = event.target.files[0]
    event.target.value = '' // permite escolher o mesmo arquivo de novo depois
    if (!file) return

    setError('')
    setBusy(true)
    try {
      const cover = await processPhoto(file, 'cover')
      onChange((current) => ({ ...current, cover }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleExtras(event) {
    const files = Array.from(event.target.files)
    event.target.value = ''
    if (files.length === 0) return

    setError('')
    setBusy(true)

    const messages = []
    const added = []
    for (const file of files) {
      try {
        added.push(await processPhoto(file, 'extra'))
      } catch (err) {
        messages.push(err.message)
      }
    }

    // O limite é aplicado sobre o estado MAIS RECENTE (dentro do setState),
    // para não ultrapassar 4 extras nem se o usuário clicar duas vezes.
    let discarded = 0
    onChange((current) => {
      const room = MAX_EXTRA_PHOTOS - current.extras.length
      discarded = Math.max(0, added.length - room)
      return { ...current, extras: [...current.extras, ...added.slice(0, room)] }
    })
    if (discarded > 0) {
      messages.push(`O limite é de ${MAX_PHOTOS} fotos por produto. ${discarded} foto(s) não foi(ram) adicionada(s).`)
    }

    setError(messages.join(' '))
    setBusy(false)
  }

  function removeCover() {
    setError('')
    onChange((current) => ({ ...current, cover: null }))
  }

  function removeExtra(id) {
    setError('')
    onChange((current) => ({ ...current, extras: current.extras.filter((photo) => photo.id !== id) }))
  }

  return (
    <div className="register-fieldset register-photos">
      <h3 className="text-semibold">Fotos do produto (opcional)</h3>

      <p className="text-muted text-sm">
        Até {MAX_PHOTOS} fotos: 1 capa, que aparece no marketplace e nos pedidos, e {MAX_EXTRA_PHOTOS}{' '}
        adicionais, que aparecem na página do produto. JPG, PNG ou WebP, até 8 MB cada. As
        fotos são reduzidas automaticamente e guardadas neste navegador.
      </p>

      <div className="photo-group">
        <p className="text-semibold">Foto de capa</p>

        {photos.cover ? (
          <div className="photo-preview photo-preview-cover">
            <img src={photos.cover.src} alt="Pré-visualização da capa" />
            <button type="button" className="photo-remove" onClick={removeCover}>
              Remover
            </button>
          </div>
        ) : (
          <label className="photo-upload-button">
            Escolher foto de capa
            <input type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleCover} disabled={busy} />
          </label>
        )}
      </div>

      <div className="photo-group">
        <p className="text-semibold">
          Fotos adicionais ({photos.extras.length}/{MAX_EXTRA_PHOTOS})
        </p>

        {photos.extras.length > 0 && (
          <div className="photo-grid">
            {photos.extras.map((photo, index) => (
              <div className="photo-preview" key={photo.id}>
                <img src={photo.src} alt={`Pré-visualização da foto adicional ${index + 1}`} />
                <button type="button" className="photo-remove" onClick={() => removeExtra(photo.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {!extrasFull && (
          <label className="photo-upload-button">
            Adicionar fotos
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              multiple
              onChange={handleExtras}
              disabled={busy}
            />
          </label>
        )}
      </div>

      {busy && <p className="text-muted text-sm" role="status">Processando fotos...</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {usageRatio >= 0.8 && (
        <p className="form-error" role="alert">
          O espaço de armazenamento deste navegador está quase cheio. Remova fotos ou
          produtos antigos se a publicação falhar.
        </p>
      )}
    </div>
  )
}

export default RegisterPhotos