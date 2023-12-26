'use client'

import React, { useState, useEffect, Fragment } from 'react';
import { CheckIcon, ChevronUpDownIcon, ArrowLeftIcon, StarIcon, PhotoIcon, XMarkIcon, MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition, Combobox, Dialog } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

// importações

import { useAuthValue } from '@/context/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { collection, getDocs, addDoc, doc, getDoc, query, where } from '@firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { Header } from '@/components/Header';
import Image from 'next/image';

const StepComponent = ({ currentStep, stepsCompleted }) => {
  const steps = [
    { id: '01', name: 'Dados da empresa', href: '#', status: currentStep > 1 ? 'complete' : (currentStep === 1 ? 'current' : 'upcoming') },
    { id: '02', name: 'Faça seu elogio', href: '#', status: currentStep > 2 ? 'complete' : (currentStep === 2 ? 'current' : 'upcoming') },
    { id: '03', name: 'Adicione fotos', href: '#', status: stepsCompleted >= 3 ? 'complete' : (currentStep === 3 ? 'current' : 'upcoming') },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === 'complete' ? (
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center px-6 py-4 text-sm font-medium">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                  <span className="text-indigo-600">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                <svg
                  className="h-full w-full text-gray-300"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vectorEffect="non-scaling-stroke"
                    stroke="currentcolor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    cnpj: '',
    companyName: '',
    categoryId: '',
    categoryName: '',
    title: '',
    description: '',
    rating: 0, // Inicialize como 0 ou outro valor apropriado
  });

  // query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [open, setOpen] = useState(true);
  const [showOptions, setShowOptions] = useState(false);



  const handleInputFocus = () => {
    // Só mostra as opções se nenhuma empresa estiver selecionada
    if (selectedCompany === null) {
      setShowOptions(true);
      if (companies.length > 0) {
        setActiveCompany(companies[0]); // Define a primeira empresa como ativa quando o input é focado
      }
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setFormData(prev => ({ ...prev, categoryId: selectedCategory.id, categoryName: selectedCategory.name }));
    }
  }, [selectedCategory]);



  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesRef = collection(db, 'users')
      const q = query(companiesRef, where('isCompany', '==', true))
      const querySnapshot = await getDocs(q)
      const fetchedCompanies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCompanies(fetchedCompanies)
    }

    fetchCompanies()
  }, [])

  const filteredCompanies = searchQuery === ''
    ? companies.slice(0, 5) // Retorna os 5 primeiros CNPJs cadastrados quando não há pesquisa
    : companies.filter((company) => {
      return company.company_cnpj.includes(searchQuery);
    });

  //

  useEffect(() => {
    // Observador de estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Agora user contém o objeto do usuário logado
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  }, [file]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, categoryId: category.id }));
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    setFormData(prev => ({ ...prev, rating: newRating }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setStepsCompleted(Math.max(stepsCompleted, currentStep));
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishForm = async () => {
    try {
      // Primeiro, verificar se temos um usuário e buscar seus dados na coleção 'users'
      if (!user) throw new Error("Nenhum usuário está logado.");

      // Buscar dados do usuário na coleção 'users'
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("Documentos do usuário não encontrados.");
      }

      // Agora temos os dados do usuário, incluindo o first_name e last_name
      const userData = userDocSnap.data();

      let imageURL = null;
      if (file) {
        const storage = getStorage();
        const imageId = Math.random().toString(36).substring(2);
        const imageRef = ref(storage, `images/${imageId}`);

        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      const categoryName = selectedCategory ? selectedCategory.name : '';

      const newComment = {
        ...formData,
        categoryName,
        rating,
        uid: user.uid, // UID do usuário logado
        createdBy: `${userData.first_name} ${userData.last_name}`, // Usamos os dados do documento do usuário
        imageURL, // Isso será null se nenhum arquivo foi carregado
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'comments'), newComment);

      console.log("Documento escrito com ID: ", docRef.id);
      setFormSubmitted(true);
      setStepsCompleted(3);
    } catch (error) {
      console.error('Erro ao inserir documento:', error);
      // Adicionar tratamento de erro aqui
    }
  };


  const resetForm = () => {
    setCurrentStep(1);
    setStepsCompleted(0);
    setFormSubmitted(false);
    setSelectedCategory(null); // Removendo a categoria selecionada
    setFile(null); // Removendo o arquivo selecionado
    setPreviewURL(null); // Removendo a URL de pré-visualização
    setRating(0); // Redefinindo a avaliação
    setSearchQuery('');
    setSelectedCompany(null);
    setActiveCompany(null);
    setShowOptions(false);

    // Redefinindo todos os campos do formData para valores iniciais vazios
    setFormData({
      cnpj: '',
      companyName: '',
      categoryId: '',
      categoryName: '',
      title: '',
      description: '',
    });
  };

  return (
    <>
    <Header />
    <div className="main-container w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-center justify-center h-screen mx-auto">
        <div className="form-container w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 text-center border border-gray-300 p-5 rounded-md shadow-lg">
        <StepComponent currentStep={currentStep} stepsCompleted={stepsCompleted} />

        <div className="mt-5 mx-auto max-w-4xl">
          {formSubmitted ? (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-12 w-12 text-green-600" aria-hidden="true" />
              </div>
              <div className="mt-3 sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Formulário Enviado com Sucesso
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Obrigado por preencher o formulário. Seu comentário é muito importante!
                </p>
              </div>
              <div className="mt-12">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
                  onClick={resetForm}
                >
                  Fazer outro elogio
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className="space-y-6 max-w-lg mx-auto">
                  {/* Título: Preencha dados da empresa */}
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Preencha dados da empresa</h3>
                  {/* Campo CNPJ */}
                  <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                    Procure pelo CNPJ da empresa
                  </label>
                  <Transition.Root show={open} as={Fragment} appear>
                    <div className="relative">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <div className="mx-auto max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                          <Combobox as="div" value={selectedCompany} onChange={(company) => {
                            setSelectedCompany(company);
                            setSearchQuery(company.company_cnpj);
                            setShowOptions(false); // Fecha a lista de opções
                            setActiveCompany(null);

                            // Atualiza o formData e o selectedCategory
                            setFormData(prevFormData => ({
                              ...prevFormData,
                              cnpj: company.company_cnpj,
                              companyName: company.company_name,
                              categoryId: '', // Limpa o categoryId atual
                              categoryName: company.category
                            }));

                            // Encontra a categoria correspondente e atualiza o selectedCategory
                            const category = categories.find(cat => cat.name === company.category);
                            setSelectedCategory(category || null);
                          }}>

                            <div className="relative">
                              <MagnifyingGlassIcon
                                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <Combobox.Input
                                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                onChange={(event) => setSearchQuery(event.target.value)}
                                onFocus={handleInputFocus}
                                value={searchQuery} // Bind o valor do input ao state searchQuery
                                placeholder="Digite o CNPJ"
                              />
                            </div>

                            {showOptions && (
                              <Combobox.Options as="div" static className="flex transform-gpu divide-x divide-gray-100">
                                <div className={classNames('max-h-60 min-w-0 flex-auto overflow-y-auto px-6 py-4', activeCompany && 'sm:h-60')}>
                                  {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company) => (
                                      <Combobox.Option
                                        key={company.id}
                                        value={company}
                                        onMouseEnter={() => setActiveCompany(company)}
                                        className={({ active }) => classNames('flex cursor-default select-none items-center rounded-md p-2', active && 'bg-gray-100 text-gray-900')}
                                      >
                                        <span className="ml-3 flex-auto truncate">{company.company_name}</span>
                                        {activeCompany && (
                                          <ChevronRightIcon
                                            className="ml-3 h-5 w-5 flex-none text-gray-400"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </Combobox.Option>
                                    ))
                                  ) : (
                                    <div
                                      className="flex cursor-pointer select-none items-center rounded-md p-2 text-gray-900"
                                      onClick={() => {
                                        // Adicione aqui a lógica para abrir o formulário de pré-cadastro
                                      }}
                                    >
                                      <span className="ml-3 flex-auto">
                                        Não encontrou a empresa que procurava? Faça um pré-cadastro dessa empresa clicando
                                        <a href="/caminho-para-pre-cadastro" className="text-indigo-600 hover:text-indigo-800"> aqui</a>.
                                      </span>

                                    </div>
                                  )}
                                </div>

                                {(activeCompany || selectedCompany) && (
                                  <div className="h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto">
                                    <div className="flex-none p-6 text-center">
                                      {(activeCompany || selectedCompany).iconUrl ? (
                                        <Image src={(activeCompany || selectedCompany).iconUrl} alt="" height={50} width={50} className="mx-auto rounded-full" />
                                      ) : (
                                        <UserCircleIcon className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
                                      )}
                                      <h2 className="mt-3 font-semibold text-gray-900">{(activeCompany || selectedCompany).company_name}</h2>
                                      <p className="text-sm text-gray-500">{(activeCompany || selectedCompany).category}</p>
                                    </div>
                                    <div className="flex flex-auto flex-col justify-between p-6">
                                      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                        <dt className="col-end-1 font-semibold text-gray-900">CNPJ</dt>
                                        <dd>{(activeCompany || selectedCompany).company_cnpj}</dd>
                                        {/* Outros detalhes da empresa */}
                                      </dl>
                                    </div>
                                  </div>
                                )}
                              </Combobox.Options>
                            )}
                          </Combobox>
                        </div>
                      </Transition.Child>
                    </div>
                  </Transition.Root>



                  {/* Campo Nome da Empresa */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                      Nome da Empresa
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Nome da Empresa"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Campo Categoria da Empresa */}
                  <Listbox value={selectedCategory} onChange={handleCategoryChange}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium text-gray-900 text-left mt-1">Categoria da Empresa</Listbox.Label>
                        <div className="relative">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selectedCategory ? selectedCategory.name : 'Selecione uma categoria'}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {categories.map((category) => (
                                <Listbox.Option
                                  key={category.id}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pl-3 pr-9'
                                    )
                                  }
                                  value={category}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                        {category.name}
                                      </span>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active ? 'text-white' : 'text-indigo-600',
                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Escreva seu elogio sobre os serviços da empresa</h3>

                  <form action="#" className="relative">
                    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
                        placeholder="Título"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      <textarea
                        rows={4}
                        name="description"
                        id="description"
                        className="block w-full resize-none border-0 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Escreva um comentário..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 text-left">Quantas estrelas você dá para essa empresa?</span>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-12 w-12 cursor-pointer ${rating >= star ? 'text-indigo-500' : 'text-gray-400'}`}
                          onClick={() => handleRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Adicione fotos para completar seu elogio</h3>

                  <div className="col-span-full">
                    <label htmlFor="file-upload" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                      Imagem
                    </label>
                    <div className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${previewURL ? 'relative' : ''}`}>
                      {previewURL ? (
                        <>
                          <Image src={previewURL} alt="Preview" className="mx-auto" width={800} height={450} />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-600 hover:text-red-700"
                            onClick={() => { setFile(null); setPreviewURL(null); }}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => setFile(e.target.files[0])}
                              />
                            </label>
                            <p className="pl-1">ou arraste e solte</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF até 10MB</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs leading-5 text-gray-600 mt-2 text-left">*Este campo não é obrigatório</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!formSubmitted && (
          <div className="form-navigation mt-5 flex justify-end"> {/* Ajusta para justificar à direita */}
            {currentStep > 1 && (
              <button onClick={previousStep} className="text-indigo-600">
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" /> {/* Ícone de seta */}
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="ml-4 inline-flex items-center rounded-md bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Próximo
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={finishForm}
                className="ml-4 inline-flex items-center rounded-md bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Concluir
              </button>
            )}
          </div>
        )}

      </div>
    </div>
    </>
  );
}

export default MultiStepForm;
