const LABELS = ['Sobre o produto', 'Localização', 'Avaliações', 'Fornecedor'];

function ProductDescriptionToggle({ toggleWrapperRef, activeIndex, onSelect }) {
  return (
    <div className="description-toggle-wrapper" ref={toggleWrapperRef}>
      <div className="description-toggle">
        {LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`button-description-toggle${index === activeIndex ? ' active' : ''}`}
            onClick={() => onSelect(index)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductDescriptionToggle;
