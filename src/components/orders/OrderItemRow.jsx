import { formatPriceBRL } from '../../utils/price'

// Espelha a estrutura visual de CartItem (imagem + info + valor à direita),
// mas sem stepper de quantidade nem botão de remover — um pedido já
// finalizado é somente leitura, diferente do carrinho.
function OrderItemRow({ item }) {
  return (
    <li className="order-item">
      <img className="cart-item-image" src={item.productImage} alt={item.productName} />

      <div className="cart-item-info">
        <p className="text-semibold">{item.productName}</p>
        <p className="text-xs text-muted-dark">
          {item.unitLabel} · Qtd: {item.quantity}
        </p>
      </div>

      <div className="cart-item-side">
        <p className="text-semibold">{formatPriceBRL(item.unitPrice * item.quantity)}</p>
      </div>
    </li>
  )
}

export default OrderItemRow