import { ORDER_STATUS_LABEL, isCancellable } from '../../data/orderStatus'
import { formatPriceBRL, formatDateBRL } from '../../utils/price'
import { useOrders } from '../../context/useOrders'
import OrderItemRow from './OrderItemRow'

function OrderCard({ order }) {
  const { cancelOrder } = useOrders()

  function handleCancel() {
    const confirmed = window.confirm(
      `Cancelar o pedido ${order.id}? Essa ação não pode ser desfeita.`
    )
    if (confirmed) cancelOrder(order.id)
  }

  return (
    <article className="order-card">
      <div className="order-card-header">
        <div>
          <p className="text-semibold">Pedido {order.id}</p>
          <p className="text-xs text-muted-dark">{formatDateBRL(order.createdAt)}</p>
        </div>

        <span className={`order-status order-status-${order.status}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <ul className="order-items">
        {order.items.map((item) => (
          <OrderItemRow key={item.productId} item={item} />
        ))}
      </ul>

      <div className="order-card-footer">
        <span className="text-semibold">Total</span>
        <span className="title-lg">{formatPriceBRL(order.total)}</span>
      </div>

      {isCancellable(order.status) && (
        <button className="order-cancel-button" type="button" onClick={handleCancel}>
          Cancelar pedido
        </button>
      )}
    </article>
  )
}

export default OrderCard