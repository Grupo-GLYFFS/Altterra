import { useState } from 'react'

import RegisterHeader from '../components/register/RegisterHeader'
import RegisterSteps from '../components/register/RegisterSteps'
import RegisterForm from '../components/register/RegisterForm'
import RegisterSuccess from '../components/register/RegisterSuccess'

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  // Faltava por completo: no HTML original, publicar troca form+stepper
  // pela seção de sucesso (form.hidden = true; successSection.hidden = false).
  // Sem esse estado, RegisterSuccess ficava com `hidden` fixo pra sempre —
  // clicar em "Publicar" simplesmente não tinha efeito visível nenhum.
  const [submitted, setSubmitted] = useState(false)

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

  function handlePublish() {
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="register">

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
          />
        </>
      )}

      {submitted && <RegisterSuccess />}

    </main>
  )
}

export default RegisterPage