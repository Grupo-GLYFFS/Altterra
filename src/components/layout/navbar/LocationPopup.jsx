import { useEffect } from 'react'
import { locationCities } from '../../../data/categories'

// Port de #location-popup em js/components.js. O original travava o scroll
// do body via document.body.style.overflow = 'hidden' enquanto aberto —
// reproduzido aqui num useEffect disparado quando `open` muda.
function LocationPopup({ open, selectedCity, onSelectCity, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={`location-popup-overlay${open ? ' open' : ''}`}
      id="location-popup"
      onClick={(event) => {
        // Clique no fundo escurecido (fora do card) fecha — igual ao original.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="location-popup">
        <div className="location-popup-header">
          <button
            className="button-close"
            id="button-close-location"
            aria-label="Fechar"
            type="button"
            onClick={onClose}
          >
            <span className="icon icon-24">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
              </svg>
            </span>
          </button>
        </div>

        <h2 className="title-xl location-popup-title">Escolha sua localização</h2>

        <ul className="location-list">
          {locationCities.map((city) => (
            <li key={city}>
              <button
                className={`location-option${city === selectedCity ? ' active' : ''}`}
                type="button"
                onClick={() => onSelectCity(city)}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LocationPopup
