import { useState } from 'react'

import AudienceTabs from '../components/how-it-works/AudienceTabs'
import WhyAltterra from '../components/how-it-works/WhyAltterra'
import BuyerBenefits from '../components/how-it-works/BuyerBenefits'
import SupplierBenefits from '../components/how-it-works/SupplierBenefits'
import FAQ from '../components/how-it-works/FAQ'
import ContactSection from '../components/how-it-works/ContactSection'
import NgoBenefits from '../components/how-it-works/NgoBenefits'

function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('compradores')

  return (
    <main className="how-it-works-container">

      <div className="explorer">

        <h1 className="why-title">
          Por quê o Altterra?
        </h1>

        <AudienceTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <WhyAltterra>
          <BuyerBenefits activeTab={activeTab} />

          <SupplierBenefits activeTab={activeTab} />

          <NgoBenefits activeTab={activeTab} />
        </WhyAltterra>

        <FAQ activeTab={activeTab} />

        <ContactSection />

      </div>

    </main>
  )
}

export default HowItWorksPage