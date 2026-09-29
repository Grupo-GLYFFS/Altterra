import { Link } from 'react-router-dom'
import { useOrders } from '../context/useOrders'
import OrderCard from '../components/orders/OrderCard'

function OrdersPage() {
  const { orders } = useOrders()

  return (
    <div className="orders-page">
      <h1 className="title-2xl">Meus pedidos</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p className="text-muted">Você ainda não fez nenhum pedido.</p>
          <Link className="button-primary" to="/">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage