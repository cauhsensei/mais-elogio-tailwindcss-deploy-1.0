'use client'

// Importações necessárias
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebaseConfig'

const products = [
  {
    name: 'Recursos',
    description: 'Explore nossos recursos',
    href: '/#features',
    icon: ChartPieIcon, // Substitua pelo ícone desejado
  },
  {
    name: 'Elogios',
    description: 'Veja o que nossos clientes dizem',
    href: '/#reviews',
    icon: CursorArrowRaysIcon, // Substitua pelo ícone desejado
  },
  {
    name: 'Preços',
    description: 'Confira nossos planos de preços',
    href: '/#pricing',
    icon: FingerPrintIcon, // Substitua pelo ícone desejado
  },
  {
    name: 'FAQs',
    description: 'Perguntas frequentes',
    href: '/#faqs',
    icon: SquaresPlusIcon, // Substitua pelo ícone desejado
  },
]

const callsToAction = [
  { name: 'Assistir demonstração', href: '#', icon: PlayCircleIcon },
  { name: 'Contatar vendas', href: '#', icon: PhoneIcon },
  { name: 'Ver todos os produtos', href: '#', icon: RectangleGroupIcon },
]

// Função para agrupar classes CSS
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Componente da Header
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [companies, setCompanies] = useState([])
  const [user, setUser] = useState(null)
  const [isCompany, setIsCompany] = useState(null)
  const isDesktop = useIsDesktop();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const router = useRouter()
  const searchRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Buscar dados do usuário na coleção 'users'
        const userRef = doc(db, 'users', currentUser.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setIsCompany(userSnap.data().isCompany)
        }
      } else {
        setIsCompany(null)
      }
    })

    return unsubscribe // Desinscrever-se ao desmontar o componente
  }, [])

  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesRef = collection(db, 'users')
      const q = query(companiesRef, where('isCompany', '==', true))
      const querySnapshot = await getDocs(q)
      const fetchedCompanies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log(fetchedCompanies)
      setCompanies(fetchedCompanies)
    }

    fetchCompanies()
  }, [])

  // Filtro de empresas com base no valor da pesquisa
  const filteredCompanies =
    searchValue === ''
      ? companies
      : companies.filter(
          (company) =>
            company.company_name
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            company.company_cnpj.includes(searchValue),
        )

  const handleCardClick = (event, uid) => {
    event.stopPropagation()
    console.log(`Card clicked: ${uid}`) // Para depuração
    router.push(`/empresas/${uid}`)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false)
      }
    }

    // Adiciona o listener quando o componente é montado
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Remove o listener quando o componente é desmontado
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  // Função para verificar se está em uma visualização de desktop
  function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 800) // Altere esse valor conforme necessário
      }

      // Verifica o tamanho da tela no carregamento
      handleResize()

      // Adiciona um listener de redimensionamento para atualizar o estado
      window.addEventListener('resize', handleResize)

      // Remove o listener ao desmontar o componente
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isDesktop
  }
  
  const headerClasses = isDesktop ? 'relative isolate bg-white z-50' : 'relative isolate bg-white';


  return (
    <header className={headerClasses}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover>
          {({ open }) => (
            <>
              <Popover.Button
                className={`flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ${open ? 'z-50' : ''}`}
                onClick={() => setPopoverOpen(open)}
              >
                Sobre nós
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-white pt-20 shadow-lg ring-1 ring-gray-900/5">
                <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <a
                        href={item.href}
                        className="mt-6 block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-3 divide-x divide-gray-900/5 border-x border-gray-900/5">
                      {callsToAction.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                        >
                          <item.icon
                            className="h-5 w-5 flex-none text-gray-400"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
            </>
            )}
          </Popover>

          {user && (
            <a
              href="/elogio"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Faça um elogio
            </a>
          )}

          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Ranking
          </a>
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Área do consumidor
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Área da empresa
          </a> */}
          {user &&
            (isCompany ? (
              <a
                href="/company/dashboard"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Área da empresa
              </a>
            ) : (
              <a
                href="/user/dashboard"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Área do consumidor
              </a>
            ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end">
        {!user && (
      <>
        <a
          href="/choices"
          className="-mx-3 rounded-lg px-3 py-2.5 text-sm font-semibold leading-6 text-gray-100 bg-indigo-600 mr-4"
        >
          Registre-se 
        </a>
        <a
          href="/login"
          className="text-sm font-semibold leading-6 text-gray-900 "  
        >
          Faça login <span aria-hidden="true">&rarr;</span>
        </a>
      </>
    )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
              <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Sobre nós
                        <ChevronDownIcon
                          className={classNames(
                            open ? 'rotate-180' : '',
                            'h-5 w-5 flex-none',
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                
                <a
                  href="/elogio"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Faça um elogio
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Raking
                </a>
                {user &&
                  (isCompany ? (
                    <a
                      href="/company/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Área da empresa
                    </a>
                  ) : (
                    <a
                      href="/user/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Área do consumidor
                    </a>
                  ))}
              </div>
              <div className="py-6">
                {!user && (
                  <a
                    href="/choices"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Faça login <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}