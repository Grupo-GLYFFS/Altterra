// Path exato do SVG de estrela usado no HTML original (icon-16/icon-20/icon-12
// mudam só a classe wrapper). Extraído para evitar colar o mesmo <path> ~30x.
function StarIcon({ size = 16 }) {
  return (
    <span className={`icon icon-${size}`}>
      <svg viewBox="0 0 16 16">
        <path d="M5.875 11.9792L8 10.3542L10.125 11.9792L9.33333 9.39583L11.7083 7.5H8.85417L8 4.875L7.16667 7.5H4.29167L6.6875 9.39583L5.875 11.9792ZM3.0625 16L4.9375 9.9375L0 6H6.0625L8 0L9.9375 6H16L11.0625 9.9375L12.9375 16L8 12.25L3.0625 16Z" />
      </svg>
    </span>
  );
}

export default StarIcon;
