import { Container } from '@/components/Container'

const faqs = [
  [
    {
      question: 'Como sei que os elogios são autênticos?',
      answer:
        'Garantimos a autenticidade de nossos elogios, pois todas as empresas e usuários cadastrados em nosso site são reais. Cada conta de empresa é verificada com base no CNPJ, enquanto os usuários normais contribuem com elogios autênticos.',
    },
    {
      question: 'Como você mantém os dados seguros?',
      answer:
        'Sua segurança é nossa prioridade. Utilizamos criptografia avançada para proteger todos os dados em nosso site, garantindo que as informações de empresas e usuários estejam protegidas.',
    },
    {
      question: 'Existe um processo de verificação de conta?',
      answer:
        'Sim, temos um processo de verificação de conta para empresas com base no CNPJ, o que nos ajuda a manter a integridade de nossa plataforma. Os usuários normais também podem se cadastrar e participar de nossa comunidade de elogios.',
    },
  ],
  [
    {
      question: 'Como você evita falsas representações de empresas?',
      answer:
        'Somente CNPJ válidos são aceitos para o registro de empresas em nossa plataforma, o que garante que ninguém possa se passar por uma empresa que não é legítima. Os usuários normais podem contribuir com elogios genuínos.',
    },
    {
      question: 'Onde a plataforma está sediada?',
      answer:
        'Podemos garantir que estamos localizados em um ambiente seguro e seguimos todas as regulamentações necessárias para proteger nossos usuários.',
    },
    {
      question: 'Como faço para me inscrever no site e começar a elogiar empresas?',
      answer:
        'É fácil! Basta criar uma conta e começar a elogiar empresas. Sua participação na construção da reputação empresarial começa aqui.',
    },
  ],
  [
    {
      question: 'Como o site protege dados sensíveis dos usuários?',
      answer:
        'Utilizamos criptografia avançada para garantir total confidencialidade e prevenir acesso não autorizado.',
    },
    {
      question: 'Qual a abordagem legal e segura na integração com a API da Receita Federal?',
      answer:
        'Mantemos integração legal e segura, seguindo normativas e criptografando dados para total conformidade.',
    },
    {
      question: 'Quais protocolos de segurança são adotados durante operações no site?',
      answer:
        'Adotamos protocolos robustos, como criptografia de ponta a ponta, para garantir operações seguras e conformidade com regulamentações.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            Perguntas frequentes
          </h2>
          <p className="mt-2 text-lg text-gray-600">
          Se você tiver mais alguma pergunta,{' '}
            <a
              href="mailto:info@example.com"
              className="text-gray-900 underline"
            >
               entre em contato conosco
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}