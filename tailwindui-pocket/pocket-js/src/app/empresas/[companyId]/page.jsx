'use client'

import { useState, useEffect } from 'react'
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/firebaseConfig'
import { useParams } from 'next/navigation'
import avatarDefault from '@/images/avatar.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faGlobe,
  faPhone,
  faMapLocationDot,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import { Header } from '@/components/Header'
import Image from 'next/image'
import { useCallback } from 'react'

function CompanyPage() {
  const [activeTab, setActiveTab] = useState('Últimos elogios')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [companyData, setCompanyData] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsStats, setCommentsStats] = useState({
    average: 0,
    counts: [0, 0, 0, 0, 0],
    totalCount: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [commentsPerPage] = useState(3)

  // Calcula os índices para os comentários da página atual
  const indexOfLastComment = currentPage * commentsPerPage
  const indexOfFirstComment = indexOfLastComment - commentsPerPage
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment,
  )

  // Muda a página atual
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const params = useParams()
  const companyId = params ? params.companyId : null

  const fetchUserPhoto = useCallback(async (uid) => {
    const photoRef = ref(storage, `userPhotos/${uid}/userPhoto.jpg`)
    try {
      const url = await getDownloadURL(photoRef)
      return url
    } catch (error) {
      return avatarDefault // Utilize a imagem de avatar padrão importada
    }
  }, []);

  useEffect(() => {
    if (!companyId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const docRef = doc(db, 'users', companyId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists() && docSnap.data().isCompany) {
        setCompanyData(docSnap.data())
      } else {
        setCompanyData(null)
      }
      setLoading(false)
    }

    fetchData()
  }, [companyId])

  useEffect(() => {
    const cnpj = companyData?.company_cnpj

    if (cnpj) {
      const commentsRef = collection(db, 'comments')
      const q = query(commentsRef, where('cnpj', '==', cnpj))

      getDocs(q)
        .then(async (querySnapshot) => {
          let fetchedComments = []
          let ratingSum = 0
          let ratingCounts = Array(5).fill(0)

          for (const doc of querySnapshot.docs) {
            const data = doc.data()
            const userPhotoUrl = await fetchUserPhoto(data.uid)
            fetchedComments.push({
              ...data,
              userPhotoUrl, // Adiciona URL da foto
              // fullName removido, usando createdBy diretamente
            })
            ratingSum += data.rating
            ratingCounts[data.rating - 1] += 1
          }

          const averageRating = ratingSum / fetchedComments.length || 0
          setComments(fetchedComments)
          setCommentsStats({
            average: averageRating.toFixed(1),
            counts: ratingCounts,
            totalCount: fetchedComments.length,
          })
        })
        .catch((error) => {
          console.error('Error getting documents: ', error)
          setError('Erro ao buscar comentários.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [companyData?.company_cnpj, fetchUserPhoto])

  if (loading) return <p>Carregando...</p>

  if (!companyData) {
    return <p>Não existe nenhuma empresa com este ID.</p>
  }

  // Função para mudar a aba ativa
  const handleTabClick = (tabName) => {
    setActiveTab(tabName)
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const generateWhatsAppLink = (phone) => {
    // Remover caracteres não numéricos, como parênteses, hífens e espaços
    const phoneNumber = phone.replace(/[^\d]/g, '')

    // Adicionar código do país se necessário (por exemplo, '55' para Brasil)
    const countryCode = '55' // Altere conforme necessário
    const formattedPhone = phoneNumber.startsWith(countryCode)
      ? phoneNumber
      : countryCode + phoneNumber

    return `https://wa.me/${formattedPhone}`
  }

  // Função para gerar URL do Google Maps
  const generateGoogleMapsLink = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`

  return (
    <>
    <Header />
    <main className="profile-page ">
      <section className="relative block" style={{ height: '500px' }}>
        <div
          className="absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              companyData.coverUrl ||
              'linear-gradient(to right, #ffffff, #e5e5e5)'
            })`,
          }}
        >
          <span
            id="blackOverlay"
            className="absolute h-full w-full bg-black opacity-50"
          ></span>
        </div>
        <div
          className="h-70-px pointer-events-none absolute bottom-0 left-0 right-0 top-auto w-full overflow-hidden"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-current text-gray-200"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="relative bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative" style={{ marginTop: '1rem' }}>
                    <Image
                      alt="Profile"
                      src={companyData.iconUrl || avatarDefault}
                      className="rounded-full border-none align-middle shadow-xl"
                      height={150}
                      width={150}
                      style={{
                        maxWidth: '150px',
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full px-4 lg:order-1">
                <div className=" mt-6 text-center">
                  <h3 className="mt-20 text-4xl font-semibold leading-normal text-gray-700">
                    {companyData.company_name}
                  </h3>
                  <div className="text-sm font-bold uppercase leading-normal text-gray-400">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-400"></i>
                    {companyData.category}
                  </div>
                </div>
                <div className="mt-2 py-4 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4 lg:w-9/12">
                      <p className="text-x-1 mb-4 leading-relaxed text-gray-700">
                        {companyData.about}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full px-4 lg:order-1">
                  <div className="flex justify-center py-4 pt-8 lg:pt-4">
                    <div className="mr-4 text-center">
                      <span
                        className="block cursor-pointer text-xs font-bold uppercase tracking-wide text-gray-600 sm:text-sm"
                        onClick={() => handleTabClick('Últimos elogios')}
                        style={{
                          fontWeight:
                            activeTab === 'Últimos elogios' ? 'bold' : 'normal',
                        }}
                      >
                        Últimos elogios
                      </span>
                    </div>
                    <div className="mr-4 text-center">
                      <span
                        className="block cursor-pointer text-xs font-bold uppercase tracking-wide text-gray-600 sm:text-sm"
                        onClick={() => handleTabClick('Desempenho')}
                        style={{
                          fontWeight:
                            activeTab === 'Desempenho' ? 'bold' : 'normal',
                        }}
                      >
                        Desempenho
                      </span>
                    </div>
                    <div className="text-center lg:mr-4">
                      <span
                        className="block cursor-pointer text-xs font-bold uppercase tracking-wide text-gray-600 sm:text-sm"
                        onClick={() => handleTabClick('Contato')}
                        style={{
                          fontWeight:
                            activeTab === 'Contato' ? 'bold' : 'normal',
                        }}
                      >
                        Contato
                      </span>
                    </div>
                    <div className="ml-auto px-3 text-center lg:text-base">
                      <button
                        className="mb-1 rounded bg-indigo-600 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:bg-indigo-500 hover:shadow-md focus:outline-none sm:mr-2 sm:text-sm lg:text-base"
                        type="button"
                      >
                        ELOGIAR ESTÁ EMPRESA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-left">
                {activeTab === 'Últimos elogios' && (
                  <div className="bg-white">
                    <div className="px-4">
                      {' '}
                      {/* Adiciona o espaçamento lateral aqui */}
                      <div className="mx-auto max-w-2xl px-2 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                        <div className="lg:col-span-4">
                          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
                            Avaliações de Clientes
                          </h3>
                          <div className="mt-3 flex items-center">
                            <div>
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={classNames(
                                      parseFloat(commentsStats.average) > rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300',
                                      'h-5 w-5 flex-shrink-0',
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">
                                {commentsStats.average} out of 5 stars
                              </p>
                            </div>
                            <p className="ml-2 text-sm text-gray-900">
                              Baseado em {commentsStats.totalCount} elogios
                            </p>
                          </div>
                          <div className="mt-6">
                            <h3 className="sr-only">Review data</h3>
                            <dl className="space-y-3">
                              {[...commentsStats.counts]
                                .reverse()
                                .map((count, index) => {
                                  // Calcula a porcentagem para o rating atual
                                  const rating =
                                    commentsStats.counts.length - index // Ajuste o rating baseado na ordem invertida
                                  const percentage =
                                    commentsStats.totalCount > 0
                                      ? (count / commentsStats.totalCount) * 100
                                      : 0
                                  return (
                                    <div
                                      key={`rating-count-${rating}`}
                                      className="flex items-center text-sm"
                                    >
                                      <dt className="flex flex-1 items-center">
                                        <p className="w-3 font-medium text-gray-900">
                                          {rating}
                                          <span className="sr-only">
                                            {' '}
                                            star reviews
                                          </span>
                                        </p>
                                        <div
                                          aria-hidden="true"
                                          className="ml-1 flex flex-1 items-center"
                                        >
                                          <StarIcon
                                            className={`h-5 w-5 flex-shrink-0 ${
                                              percentage > 0
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                            aria-hidden="true"
                                          />

                                          <div className="relative ml-3 flex-1">
                                            <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                            {percentage > 0 && (
                                              <div
                                                className="absolute inset-y-0 rounded-full bg-yellow-400"
                                                style={{
                                                  width: `${percentage}%`,
                                                }}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </dt>
                                      <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                                        {percentage.toFixed(0)}%
                                      </dd>
                                    </div>
                                  )
                                })}
                            </dl>
                          </div>
                          <div className="mt-10">
                            <h3 className="text-lg font-medium text-gray-900">
                              Compartilhe suas experiências
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              Se você usou este produto ou os serviços dessa
                              empresa, compartilhe sua experiência positiva com
                              outros clientes.
                            </p>
                          </div>
                        </div>
                        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                          <h3 className="sr-only">Recent reviews</h3>
                          <div className="flow-root">
                            <div className="-my-12 divide-y divide-gray-200">
                              {currentComments.map((comment) => (
                                <div key={comment.id} className="py-12">
                                  <div className="flex items-center">
                                    <Image
                                      src={comment.userPhotoUrl}
                                      alt={`Avatar de ${comment.createdBy}`}
                                      width={45}
                                      height={45}
                                      className=" rounded-full"
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = avatarDefault
                                      }} // Use a imagem padrão se userPhotoUrl não carregar
                                    />
                                    <div className="ml-4">
                                      <h4 className="text-sm font-bold text-gray-900">
                                        {comment.createdBy}
                                      </h4>
                                      <div className="mt-1 flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                          <StarIcon
                                            key={rating}
                                            className={classNames(
                                              comment.rating > rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300',
                                              'h-5 w-5 flex-shrink-0',
                                            )}
                                            aria-hidden="true"
                                          />
                                        ))}
                                      </div>
                                      <p className="sr-only">
                                        {comment.rating} out of 5 stars
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className="mt-4 space-y-6 text-base italic text-gray-600"
                                    dangerouslySetInnerHTML={{
                                      __html: comment.description,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Componente de paginação */}
                          <div className="mt-20 flex justify-center">
                            <div className="flex items-center">
                              <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <ChevronLeftIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Previous</span>
                              </button>
                              {[
                                ...Array(
                                  Math.ceil(comments.length / commentsPerPage),
                                ).keys(),
                              ].map((number) => (
                                <button
                                  key={number + 1}
                                  onClick={() => paginate(number + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    currentPage === number + 1
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {number + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={
                                  currentPage ===
                                  Math.ceil(comments.length / commentsPerPage)
                                }
                                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <ChevronRightIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Next</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Desempenho' && (
                  <div className="flex h-96 items-start justify-center pt-10">
                    <div className="relative w-full max-w-2xl rounded-lg border border-gray-300 bg-white/30 p-10 shadow-xl backdrop-blur-sm">
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="mr-4 text-2xl text-gray-700"
                        />
                        <p className="text-xl font-semibold text-gray-700">
                          Esse recurso ainda não está disponível
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Contato' && (
                  <div className="bg-white py-24 sm:py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
                        {Object.values(companyData).some((value) => value) ? (
                          <>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                              <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                  Redes Sociais
                                </h2>
                                <p className="mt-4 leading-7 text-gray-600">
                                  Confira todas nossas redes sociais.
                                </p>
                              </div>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                                {companyData.instagram && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faInstagram}
                                        className="mr-2"
                                      />
                                      Instagram
                                    </h3>
                                    <a
                                      href={companyData.instagram}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Visitar Instagram
                                    </a>
                                  </div>
                                )}
                                {companyData.whatsapp && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faWhatsapp}
                                        className="mr-2"
                                      />
                                      WhatsApp
                                    </h3>
                                    <a
                                      href={generateWhatsAppLink(
                                        companyData.whatsapp,
                                      )}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Iniciar conversa
                                    </a>
                                  </div>
                                )}
                                {companyData.facebook && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faFacebookF}
                                        className="mr-2"
                                      />
                                      Facebook
                                    </h3>
                                    <a
                                      href={companyData.facebook}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Visitar Facebook
                                    </a>
                                  </div>
                                )}
                                {companyData.twitter && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="mr-2"
                                      />
                                      Twitter
                                    </h3>
                                    <a
                                      href={companyData.twitter}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Visitar Twitter
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
                              <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                  Contato
                                </h2>
                                <p className="mt-4 leading-7 text-gray-600">
                                  Confira nossos meios de contato.
                                </p>
                              </div>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                                {companyData.email && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="mr-2"
                                      />
                                      Email
                                    </h3>
                                    <a
                                      href={`mailto:${companyData.email}`}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Enviar Email
                                    </a>
                                  </div>
                                )}
                                {companyData.phone && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className="mr-2"
                                      />
                                      Telefone
                                    </h3>
                                    <a
                                      href={`tel:${companyData.phone}`}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Ligar agora
                                    </a>
                                  </div>
                                )}
                                {companyData.website && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faGlobe}
                                        className="mr-2"
                                      />
                                      Site
                                    </h3>
                                    <a
                                      href={companyData.website}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Visitar Site
                                    </a>
                                  </div>
                                )}
                                {companyData.address && (
                                  <div className="rounded-2xl bg-gray-50 p-10">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                                      <FontAwesomeIcon
                                        icon={faMapLocationDot}
                                        className="mr-2"
                                      />
                                      Endereço
                                    </h3>
                                    <a
                                      href={generateGoogleMapsLink(
                                        companyData.address,
                                      )}
                                      className="font-semibold text-indigo-600"
                                    >
                                      Ver no mapa
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <p className="text-lg font-medium text-gray-600">
                              Essa empresa ainda não informou esses dados.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}

export default CompanyPage
