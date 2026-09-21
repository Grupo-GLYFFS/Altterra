import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { useOrders } from '../../context/useOrders'
import { formatPriceBRL } from '../../utils/price'
import CartItem from './CartItem'

// O projeto original não tem nenhuma tela/painel de carrinho — só o ícone
// na navbar (.button-cart) e o botão "Adicionar ao carrinho" na ProductPage,
// sem nenhum comportamento em JS. Este painel reaproveita o mesmo padrão
// visual de .location-popup-overlay/.location-popup (mesmo overlay com
// blur, mesmo botão de fechar, mesmos tokens de espaçamento/cor), só com
// classes próprias em cart.css para o conteúdo (lista de itens, stepper de
// quantidade, total) — que não tinha equivalente no HTML original.
function CartPanel() {
  const { items, isOpen, totalItems, totalPrice, closeCart, clearCart } = useCart()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  // Converte o carrinho em pedido, esvazia o carrinho (que já fecha o
  // painel) e leva o usuário para a lista de pedidos, onde ele vê a
  // confirmação do que acabou de fazer.
  function handleCheckout() {
    if (items.length === 0) return
    createOrder(items)
    clearCart()
    navigate('/pedidos')
  }

  return (
    <div
      className={`cart-overlay${isOpen ? ' open' : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCart()
      }}
    >
      <div className="cart-panel" role="dialog" aria-label="Carrinho de compras">
        <div className="cart-panel-header">
          <h2 className="title-xl">Carrinho{totalItems > 0 ? ` (${totalItems})` : ''}</h2>

          <button className="button-close" aria-label="Fechar carrinho" type="button" onClick={closeCart}>
            <span className="icon icon-24">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
              </svg>
            </span>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty text-muted">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>

            <div className="cart-panel-footer">
              <div className="cart-total">
                <span className="text-semibold">Total</span>
                <span className="title-xl">{formatPriceBRL(totalPrice)}</span>
              </div>

              <button className="cart-checkout-button" type="button" onClick={handleCheckout}>
                Finalizar pedido
              </button>

              <button className="button-primary" type="button" onClick={closeCart}>
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPanel
