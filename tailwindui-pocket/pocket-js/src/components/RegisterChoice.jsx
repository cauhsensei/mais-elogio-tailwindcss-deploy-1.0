import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Cadastro como usuário',
    id: 'tier-hobby',
    href: '/registeruser',

    description:
      'Descubra elogios sobre diversas empresas, tome decisões embasadas na experiência de outros usuários e elogie os produtos ou serviços que você aprecia.',
    features: [
      'Elogios',
      'Buscar empresas',
      'Ler avaliaçoes',
      'Escrever avaliações',
      'Ranking das melhores',
    ],
  },
  {
    name: 'Cadastro como empresa',
    id: 'tier-team',
    href: '/registercompany',
    description:
      'Receba elogios, exiba-os em sua página aprimore a qualidade de seus serviços. Acompanhe seu desempenho e obtenha insights.',
    features: [
      'Receba elogios',
      'Exibi-los no seu perfil',
      'Analise de dados',
      'Monitore desempenho',
      'Marketing ',
    ],
  },
]

export default function RegisterChoice() {
  return (
    <div className="isolate bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-96 text-center sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mt-2 text-sm font-bold tracking-tight text-white sm:text-5xl">
            Escolha como deseja se cadastrar{' '}
            <br className="hidden sm:inline lg:hidden" />
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
            Registre-se como usuário para elogiar serviços ou como empresa para
            receber elogios, feedback e gerenciar a qualidade do serviço
            prestado.
          </p>
          <svg
            viewBox="0 0 1208 768"
            className="absolute -top-10 left-1/2 -z-10 h-[48rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse
              cx={604}
              cy={512}
              fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                <stop stopColor="#4B0082" />
                <stop offset={1} stopColor="#7B68EE" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-60">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-900/10 sm:p-8"
                >
                  <div>
                    <span
                      id={tier.id}
                      className="text-2xl font-semibold leading-7 text-indigo-600"
                    >
                      {tier.name}
                    </span>
                    <div className="mt-4 flex items-baseline gap-x-2"></div>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      {tier.description}
                    </p>
                    <ul
                      role="list"
                      className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                     Escolha esta opção
                  </a>
                </div>
              ))}
              <div className="flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                <div className="lg:min-w-0 lg:flex-1">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
                    Já tem uma conta?
                  </h3>
                </div>
                <a
                  href="/login"
                  className="rounded-md px-3.5 py-2 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Clique aqui e faça seu login{' '}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}