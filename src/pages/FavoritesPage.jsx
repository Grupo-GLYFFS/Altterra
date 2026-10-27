import { Link } from 'react-router-dom'
import { useFavorites } from '../context/useFavorites'
import { buildProductCard } from '../data/homeProducts'
import ProductCard from '../components/product/ProductCard'

// Lista os produtos favoritados. Reaproveita o ProductCard (o mesmo das
// seções de produtos) — cada card já leva para /product/:productId.
// Funciona para produtos do catálogo inicial e para os publicados pelo
// formulário, porque o favorito guarda só o productId e o produto é
// buscado no catálogo atual (ver FavoritesContext).
function FavoritesPage() {
  const { favoriteProducts } = useFavorites()

  return (
    <div className="favorites-page">
      <h1 className="title-2xl">Meus favoritos</h1>

      {favoriteProducts.length === 0 ? (
        <div className="orders-empty">
          <p className="text-muted">
            Você ainda não favoritou nenhum produto. Abra um produto e toque no coração para guardá-lo aqui.
          </p>
          <Link className="button-primary" to="/">
            Ver produtos
          </Link>
        </div>
      ) : (
        <ul className="products-grid favorites-grid">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={buildProductCard(product, `favorite-${product.id}`)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default FavoritesPage