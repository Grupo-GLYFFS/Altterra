import { useState } from 'react'

import RegisterHeader from '../components/register/RegisterHeader'
import RegisterSteps from '../components/register/RegisterSteps'
import RegisterForm from '../components/register/RegisterForm'
import RegisterSuccess from '../components/register/RegisterSuccess'

import { useProducts } from '../context/useProducts'
import { buildProductFromRegisterValues } from '../utils/registerToProduct'

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  // Faltava por completo: no HTML original, publicar troca form+stepper
  // pela seção de sucesso (form.hidden = true; successSection.hidden = false).
  // Sem esse estado, RegisterSuccess ficava com `hidden` fixo pra sempre —
  // clicar em "Publicar" simplesmente não tinha efeito visível nenhum.
  const [submitted, setSubmitted] = useState(false)

    // Guarda o id do produto recém-publicado, pra RegisterSuccess conseguir
  // linkar direto pra ele ("Ver meu produto").
  const [publishedProductId, setPublishedProductId] = useState(null)

  const [publishError, setPublishError] = useState('')

  const { addProduct } = useProducts()

  function handleNext() {
    if (currentStep < 5) {
      setCurrentStep((step) => step + 1)
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
    }
  }

  function handleStepChange(step) {
    setCurrentStep(step)
  }

  // Antes ignorava por completo os dados coletados pelo formulário — só
  // trocava a tela pra "sucesso", sem o produto ir a lugar nenhum. Agora
  // constrói um Product de verdade a partir dos valores e adiciona ao
  // catálogo global (ProductsContext), persistido em localStorage.

  function handlePublish(values, photos) {
    const newProduct = buildProductFromRegisterValues(values, photos)

    // addProduct devolve false se não conseguiu gravar no localStorage
    // (cota cheia — o risco real com fotos). Nesse caso o formulário
    // continua aberto, com as fotos, para o usuário remover alguma e
    // tentar de novo, em vez de "publicar" algo que sumiria no reload.
    const saved = addProduct(newProduct)
    if (!saved) {
      setPublishError(
        'Não foi possível salvar o produto: o armazenamento do navegador está cheio. Remova algumas fotos (ou produtos antigos) e tente publicar de novo.',
      )
      return
    }

    setPublishError('')
    setPublishedProductId(newProduct.id)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="register">

      <RegisterHeader />

      {!submitted && (
        <>
          <RegisterSteps
            currentStep={currentStep}
            onStepChange={handleStepChange}
          />

          <RegisterForm
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onStepChange={handleStepChange}
            onPublish={handlePublish}
            publishError={publishError}
          />
        </>
      )}

      {submitted && <RegisterSuccess productId={publishedProductId} />}

    </div>
  )
}

export default RegisterPage