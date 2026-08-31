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

import { product } from '../data/productData'
import { similarProducts } from '../data/similarProducts'

function ProductPage() {
  const {
    toggleWrapperRef,
    sectionRefs,
    activeIndex,
    goToSection
  } = useScrollSpyTabs(4)

  const { addItem } = useCart()

  // product.prices[0] é a faixa de menor volume ("De 50 a 100t"), a mais
  // próxima de um "preço unitário" para fins de carrinho — o produto em si
  // não tem um preço único (é vendido por faixa de volume).
  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      image: product.gallery[0].src,
      unitPrice: parsePriceBRL(product.prices[0].price),
      unitLabel: product.prices[0].price,
    })
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