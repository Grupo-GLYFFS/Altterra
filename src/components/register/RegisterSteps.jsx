function RegisterSteps({ currentStep, onStepChange }) {
  const steps = [
    {
      number: 1,
      title: 'Básico',
      subtitle: 'Informações gerais'
    },
    {
      number: 2,
      title: 'Localização',
      subtitle: 'Onde está o lote'
    },
    {
      number: 3,
      title: 'Preço',
      subtitle: 'Defina seus preços'
    },
    {
      number: 4,
      title: 'Cultivo',
      subtitle: 'Dados técnicos'
    },
    {
      number: 5,
      title: 'Revisão',
      subtitle: 'Antes de publicar'
    }
  ]

  return (
    <ol className="wizard-steps">

      {steps.map((step) => (

        <li
          key={step.number}
          className={`wizard-step ${
            currentStep === step.number ? 'is-active' : ''
          }`}
          data-step={step.number}
          onClick={() => onStepChange(step.number)}
        >

          <span className="wizard-step-number">
            {step.number}
          </span>

          <span className="wizard-step-info">

            <span className="wizard-step-title">
              {step.title}
            </span>

            <span className="wizard-step-subtitle">
              {step.subtitle}
            </span>

          </span>

        </li>

      ))}

    </ol>
  )
}

export default RegisterSteps