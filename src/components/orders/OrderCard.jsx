import { ORDER_STATUS_LABEL } from '../../data/orderStatus'
import { formatPriceBRL, formatDateBRL } from '../../utils/price'
import OrderItemRow from './OrderItemRow'

function OrderCard({ order }) {
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
    </article>
  )
}

export default OrderCard