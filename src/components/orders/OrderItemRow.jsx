import { useState } from 'react'
import placeholderProduto from '../../assets/images/placeholder-produto.svg'
import { useProducts } from '../../context/useProducts'
import { formatPriceBRL } from '../../utils/price'

// Espelha a estrutura visual de CartItem (imagem + info + valor à direita),
// mas sem stepper de quantidade nem botão de remover — um pedido já
// finalizado é somente leitura, diferente do carrinho.
//
// A imagem do pedido é uma cópia (snapshot) gravada no localStorage. Para
// produtos do catálogo inicial essa cópia é uma URL com hash do build, que
// pode deixar de existir depois de um novo deploy. Se a imagem falhar ao
// carregar, buscamos a imagem atual do produto pelo productId (e, em último
// caso, o placeholder) — sem mudar o que o pedido guarda.
function OrderItemRow({ item }) {
  const { getProductById } = useProducts()
  const [imageSrc, setImageSrc] = useState(item.productImage)

  function handleImageError() {
    const product = getProductById(item.productId)
    const fallback = product?.cardSummary.thumb ?? product?.cardSummary.image ?? placeholderProduto
    if (imageSrc !== fallback) setImageSrc(fallback)
  }

  return (
    <li className="order-item">
      <img
        className="cart-item-image"
        src={imageSrc}
        alt={item.productName}
        onError={handleImageError}
      />

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