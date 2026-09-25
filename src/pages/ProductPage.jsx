import { useParams, Link } from 'react-router-dom'

import ProductBreadcrumb from '../components/product/ProductBreadcrumb'
import ProductGallery from '../components/product/ProductGallery'
import ProductDescriptionToggle from '../components/product/ProductDescriptionToggle'
import ProductAbout from '../components/product/ProductAbout'
import ProductLocation from '../components/product/ProductLocation'
import ProductReviews from '../components/product/ProductReviews'
import SupplierProfile from '../components/product/SupplierProfile'
import ProductHeader from '../components/product/ProductHeader'
import ProductPrices from '../components/product/ProductPrices'
import ProductDetails from '../components/product/ProductDetails'
import ProductDelivery from '../components/product/ProductDelivery'
import ProductCTA from '../components/product/ProductCTA'
import SimilarProducts from '../components/product/SimilarProducts'

import { useScrollSpyTabs } from '../components/product/useScrollSpyTabs'
import { useCart } from '../context/useCart'
import { parsePriceBRL } from '../utils/price'

import { getProductById } from '../data/products'
import { similarProducts } from '../data/similarProducts'

function ProductPage() {
  const { productId } = useParams()
  const product = getProductById(productId)

  // useScrollSpyTabs precisa ser chamado incondicionalmente (regra dos
  // hooks do React), então roda antes do guard clause abaixo — mesmo que
  // o produto não exista, isso não tem efeito colateral nenhum.
  const {
    toggleWrapperRef,
    sectionRefs,
    activeIndex,
    goToSection
  } = useScrollSpyTabs(4)

  const { addItem } = useCart()

  // product.prices[0] é a faixa de menor volume, a mais próxima de um
  // "preço unitário" para fins de carrinho — o produto em si não tem um
  // preço único (é vendido por faixa de volume).
  function handleAddToCart() {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      image: product.gallery[0].src,
      unitPrice: parsePriceBRL(product.prices[0].price),
      unitLabel: product.prices[0].price,
    })
  }

  // Produto não encontrado (id inválido na URL, ou link antigo apontando
  // pra um produto removido do catálogo). Reaproveita o mesmo padrão
  // visual do estado vazio de "Meus pedidos" (.orders-empty, definida em
  // orders.css), em vez de criar uma tela nova só pra isso.
  if (!product) {
    return (
      <main className="orders-page">
        <h1 className="title-2xl">Produto não encontrado</h1>
        <div className="orders-empty">
          <p className="text-muted">Esse produto não existe ou não está mais disponível.</p>
          <Link className="button-primary" to="/">
            Ver produtos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="product-page-container">

        <ProductBreadcrumb
          items={product.breadcrumb}
          current={product.name}
        />

        <div className="product-page">

          <div className="left-side">

            <ProductGallery
              images={product.gallery}
            />

            <div className="product-details">

              <ProductDescriptionToggle
                toggleWrapperRef={toggleWrapperRef}
                activeIndex={activeIndex}
                onSelect={goToSection}
              />

              {/* eslint-disable react-hooks/refs -- estamos PASSANDO os objetos
                  ref (padrão correto de forwardRef), não lendo `.current`
                  deles durante o render. A regra ainda não reconhece bem
                  refs vindos de um array (só libera o índice [0] sozinho);
                  é uma limitação conhecida da versão atual do plugin, não
                  um bug real neste código. */}
              <ProductAbout
                ref={sectionRefs[0]}
                description={product.description}
                cultivation={product.cultivation}
              />

              <ProductLocation
                ref={sectionRefs[1]}
                image={product.location.image}
                address={product.location.address}
              />

              <ProductReviews
                ref={sectionRefs[2]}
                summary={product.ratingsSummary}
                reviews={product.reviews}
              />

              <SupplierProfile
                ref={sectionRefs[3]}
                supplier={product.supplier}
              />
              {/* eslint-enable react-hooks/refs */}

            </div>

          </div>

          <div className="right-side">

            <div className="right-side-container">

              <ProductHeader
                name={product.name}
                summary={product.summary}
              />

              <ProductPrices
                prices={product.prices}
              />

              <ProductDetails
                details={product.details}
                supplier={product.supplier}
              />

              <ProductDelivery
                text={product.deliveryText}
              />

              <ProductCTA
                responseTime={product.cta.responseTime}
                onAddToCart={handleAddToCart}
              />

            </div>

          </div>

        </div>

      </div>

      <SimilarProducts
        title="Produtos similares"
        products={similarProducts}
      />
    </main>
  )
}

export default ProductPage