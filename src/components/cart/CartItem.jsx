import { useCart } from '../../context/useCart'
import { formatPriceBRL } from '../../utils/price'

function CartItem({ item }) {
  const { incrementItem, decrementItem, removeItem } = useCart()

  return (
    <li className="cart-item">
      <img className="cart-item-image" src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <p className="text-semibold">{item.name}</p>
        <p className="text-xs text-muted-dark">{item.unitLabel}</p>

        <div className="cart-item-quantity">
          <button
            className="cart-quantity-button"
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => decrementItem(item.id)}
          >
            <span className="icon icon-12">
              <svg viewBox="0 0 12 12">
                <path d="M1 5.5H11V6.5H1V5.5Z" />
              </svg>
            </span>
          </button>

          <span className="cart-quantity-value">{item.quantity}</span>

          <button
            className="cart-quantity-button"
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => incrementItem(item.id)}
          >
            <span className="icon icon-12">
              <svg viewBox="0 0 12 12">
                <path d="M5.5 1H6.5V5.5H11V6.5H6.5V11H5.5V6.5H1V5.5H5.5V1Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="cart-item-side">
        <p className="text-semibold">{formatPriceBRL(item.unitPrice * item.quantity)}</p>

        <button
          className="cart-remove-button"
          type="button"
          aria-label={`Remover ${item.name} do carrinho`}
          onClick={() => removeItem(item.id)}
        >
          <span className="icon icon-16">
            <svg viewBox="0 0 14 16">
              <path d="M3 16C2.45 16 1.97917 15.8042 1.5875 15.4125C1.19583 15.0208 1 14.55 1 14V3H0V1H4V0H10V1H14V3H13V14C13 14.55 12.8042 15.0208 12.4125 15.4125C12.0208 15.8042 11.55 16 11 16H3ZM11 3H3V14H11V3ZM5 12H7V5H5V12ZM7 12H9V5H7V12Z" />
            </svg>
          </span>
        </button>
      </div>
    </li>
  )
}

export default CartItem
