// Nenhum destes 3 botões tem listener em product-page.js — são apenas
// botões visuais no HTML original. Props onClick são opcionais e não
// adicionam nenhuma funcionalidade que não existisse antes.
function ProductCTA({ responseTime, onAddToCart, onRequestSample, onSendMessage }) {
  return (
    <div className="product-cta">
      <button className="button-add-to-cart" type="button" onClick={onAddToCart}>
        Adicionar ao carrinho
      </button>

      <button className="button-request-sample" type="button" onClick={onRequestSample}>
        Solicitar amostra
      </button>

      <button className="button-send-message" type="button" onClick={onSendMessage}>
        Mandar mensagem <span className="response-time">{responseTime}</span>
      </button>
    </div>
  );
}

export default ProductCTA;
