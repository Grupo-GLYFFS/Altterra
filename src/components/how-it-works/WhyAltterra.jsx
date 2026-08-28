// No HTML original, <section class="section-why"> é o container ÚNICO que
// envolve os 3 painéis .bento (compradores/fornecedores/ongs) — só os
// painéis internos trocam de visibilidade por aba, a section em si é fixa.
// A versão anterior deste arquivo reimplementava o painel de "compradores"
// inteiro aqui dentro (duplicando BuyerBenefits.jsx byte a byte) e ainda
// tinha um erro de sintaxe no SVG de uma das tags ("171-171" em vez de
// "171 171", que muda a interpretação do path). Como o conteúdo já existe
// em BuyerBenefits.jsx, este componente virou só o wrapper estrutural.
function WhyAltterra({ children }) {
  return (
    <section className="section-why">
      {children}
    </section>
  )
}

export default WhyAltterra
