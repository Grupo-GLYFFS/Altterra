import { forwardRef, useEffect, useRef, useState } from 'react';

// Port do bloco "Ações de localização: copiar endereço e abrir no Google Maps"
// de product-page.js. O original trocava o innerHTML do botão por um ícone
// de check por 1.5s via setTimeout; aqui isso vira um estado `copied`
// (mesmo efeito visual, sem manipular innerHTML na mão).
const ProductLocation = forwardRef(function ProductLocation({ image, address }, ref) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback para contextos sem Clipboard API — mesmo fallback do original.
      const temp = document.createElement('textarea');
      temp.value = address;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    }

    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener');
  };

  return (
    <div className="location-section" ref={ref}>
      <h2 className="title-2xl">Localização</h2>

      <div className="location-container">
        <img className="location-image" src={image} alt="Foto Localização" />

        <div className="location-info">
          <address>{address}</address>

          <div className="location-buttons">
            <hr className="vertical-line" />

            <button
              className="button-location-action"
              type="button"
              onClick={handleCopyAddress}
              aria-label="Copiar endereço"
            >
              {copied ? (
                <span className="icon icon-20">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.42z" />
                  </svg>
                </span>
              ) : (
                <span className="icon icon-20">
                  <svg viewBox="0 0 14 16">
                    <path d="M4.5 13C4.0875 13 3.73437 12.8531 3.44062 12.5594C3.14687 12.2656 3 11.9125 3 11.5V1.5C3 1.0875 3.14687 0.734376 3.44062 0.440626C3.73437 0.146876 4.0875 0 4.5 0H12.5C12.9125 0 13.2656 0.146876 13.5594 0.440626C13.8531 0.734376 14 1.0875 14 1.5V11.5C14 11.9125 13.8531 12.2656 13.5594 12.5594C13.2656 12.8531 12.9125 13 12.5 13H4.5ZM4.5 11.5H12.5V1.5H4.5V11.5ZM1.5 16C1.0875 16 0.734375 15.8531 0.440625 15.5594C0.146875 15.2656 0 14.9125 0 14.5V3H1.5V14.5H11V16H1.5Z" />
                  </svg>
                </span>
              )}
            </button>

            <hr className="vertical-line" />

            <button
              className="button-location-action"
              type="button"
              onClick={handleOpenMaps}
              aria-label="Abrir no Google Maps"
            >
              <span className="icon icon-20">
                <svg viewBox="0 0 16 16">
                  <path d="M1.47826 16L0 14.5217L12.4348 2.08696H5.56522V0H16V10.4348H13.913V3.56522L1.47826 16Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductLocation;
