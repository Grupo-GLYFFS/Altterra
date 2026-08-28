// A estrutura (18 perguntas, 6 por aba) já estava correta. O que divergia
// era o texto das respostas — reescrito/resumido em vez de transcrito.
// Substituído pelo conteúdo exato de pages/how-it-works-page.html.
const faqData = {
  compradores: [
    {
      question: 'Como faço meu cadastro como comprador?',
      answer:
        'O cadastro é gratuito e leva cerca de 5 minutos. Você precisa informar dados básicos da sua empresa (CNPJ, razão social, endereço de entrega) e enviar um documento de comprovação. Após a aprovação, sua conta libera o acesso completo ao catálogo e à mesa de cotações.',
    },
    {
      question: 'Como funciona o processo de cotação?',
      answer:
        'Após encontrar o produto desejado, você envia uma solicitação de cotação diretamente ao fornecedor pela plataforma. O produtor confirma disponibilidade e retorna com condições de preço, prazo e volume. Toda a negociação acontece dentro do Altterra, com histórico registrado e confirmação formal antes do fechamento do pedido.',
    },
    {
      question: 'Posso comprar de mais de um produtor no mesmo pedido?',
      answer:
        'Sim. O Altterra funciona como um carrinho unificado: você seleciona produtos de diferentes produtores e fecha tudo em um só pedido. Cada lote mantém sua rastreabilidade independente, mas a gestão financeira e o acompanhamento são centralizados na sua conta.',
    },
    {
      question: 'Como a qualidade dos produtos é garantida?',
      answer:
        'Todo produtor passa por verificação documental antes de publicar no marketplace. Os produtos incluem ficha técnica com dados de cultivo, histórico de avaliações de compradores anteriores e, em alguns casos, certificações de terceiros (IBD, GlobalGAP, Rainforest Alliance). Você também pode solicitar amostras antes de fechar pedidos maiores.',
    },
    {
      question: 'O que é o Outlet Sustentável?',
      answer:
        'É uma seção dedicada a produtos fora do padrão estético — tamanho irregular, coloração atípica ou excedente de safra — que mantêm qualidade nutricional e técnica plena. Uma oportunidade de adquirir commodities com preços diferenciados enquanto reduz desperdício na cadeia.',
    },
    {
      question: 'Como funciona a logística e entrega?',
      answer:
        'A logística é negociada diretamente entre comprador e produtor dentro da plataforma. Você combina retirada na origem, frete por conta do produtor ou indica sua própria transportadora. O Altterra registra as condições acordadas e envia notificações de confirmação de despacho e entrega.',
    },
  ],

  fornecedores: [
    {
      question: 'Como faço meu cadastro como fornecedor?',
      answer:
        'O cadastro de fornecedor é gratuito. Você informa os dados da sua propriedade ou cooperativa (CNPJ ou CPF rural, localização, tipo de produção) e envia documentação de comprovação. Após a aprovação, libera o painel de gestão e pode publicar seus primeiros lotes no marketplace.',
    },
    {
      question: 'Como anuncio meus produtos no Altterra?',
      answer:
        'Pelo painel do fornecedor, você cadastra cada lote com foto, ficha técnica (umidade, pH, altitude, percentual de avarias), volume disponível e faixas de preço por quantidade. Quanto mais completa a ficha, maior a confiança do comprador e a velocidade da negociação.',
    },
    {
      question: 'Como recebo os pagamentos das vendas?',
      answer:
        'O Altterra registra todas as condições acordadas na cotação. O pagamento é combinado diretamente com o comprador dentro das regras da plataforma, e o histórico de cada transação fica documentado na sua conta para garantir segurança e previsibilidade financeira.',
    },
    {
      question: 'Posso vender produtos fora do padrão estético?',
      answer:
        'Sim. Produtos com pequenas imperfeições estéticas ou excedentes de safra podem ser anunciados no Outlet Sustentável. É uma forma de transformar o que seria descarte em receita, reduzindo perdas no campo.',
    },
    {
      question: 'Como funciona a logística e o frete?',
      answer:
        'A logística é negociada diretamente com o comprador. Você pode oferecer retirada na origem, frete por sua conta ou indicar uma transportadora parceira. As condições ficam registradas na plataforma com notificações de despacho e entrega.',
    },
    {
      question: 'O que é a rastreabilidade e como ela me ajuda a vender?',
      answer:
        'A rastreabilidade comprova a origem e o histórico de cada lote. Para o comprador B2B isso é um diferencial decisivo: lotes rastreados vendem mais rápido, alcançam melhores preços e habilitam filtros por certificações sustentáveis.',
    },
  ],

  ongs: [
    {
      question: 'Como minha ONG se cadastra no AgroLink?',
      answer:
        'O cadastro no AgroLink é gratuito. Sua ONG informa os dados institucionais (CNPJ, área de atuação, capacidade de armazenamento) e envia documentação que comprove a atividade social. Após a validação, você passa a visualizar as doações disponíveis na sua região.',
    },
    {
      question: 'Que tipo de produtos minha ONG pode receber?',
      answer:
        'Sua ONG pode receber alimentos fora do padrão estético — tamanho irregular, coloração atípica ou excedentes de safra — que mantêm qualidade nutricional plena. São produtos que seriam descartados no mercado convencional, mas estão perfeitos para consumo.',
    },
    {
      question: 'As doações têm algum custo?',
      answer:
        'As doações pelo AgroLink não têm custo de aquisição. Eventuais custos logísticos de retirada ou transporte são combinados caso a caso entre a ONG e o produtor doador, sempre de forma transparente na plataforma.',
    },
    {
      question: 'Como funciona a logística de retirada das doações?',
      answer:
        'Cada doação traz a localização do produtor e o volume disponível. A retirada é combinada diretamente entre a ONG e o doador — você organiza o transporte ou negocia o apoio do produtor. O Altterra registra o agendamento e confirma a entrega.',
    },
    {
      question: 'Como acompanho o impacto social das doações recebidas?',
      answer:
        'A cada lote recebido, a plataforma registra dados como volume resgatado e estimativa de refeições viabilizadas. Esses indicadores ajudam sua ONG na prestação de contas e na comunicação de impacto com parceiros e financiadores.',
    },
    {
      question: 'O que é o badge "Doador Ativo"?',
      answer:
        'É o selo de credibilidade que os fornecedores parceiros recebem ao doar pelo AgroLink. Ele reforça publicamente o compromisso do produtor com a ODS 2 (Fome Zero) e incentiva mais doações na cadeia.',
    },
  ],
}

function FAQ({ activeTab = 'compradores' }) {
  const questions = faqData[activeTab]

  return (
    <section className="section-faq">
      <h2 className="faq-title">
        Perguntas frequentes
      </h2>

      <div className="faq-list">
        {questions.map((item, index) => (
          <details className="faq-item" key={index}>
            <summary className="faq-summary">
              <span>{item.question}</span>

              <span className="icon icon-24" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </span>
            </summary>

            <p className="faq-answer">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FAQ
