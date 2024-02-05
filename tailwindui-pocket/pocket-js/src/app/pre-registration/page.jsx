'use client'

// components/NewCompanyForm.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import Image from 'next/image';
import registeredImage from '../../images/registeredImage.png'
import erroricon from '../../images/error-icon.png'
import useAuthentication from '@/hooks/useAuthentication';

export default function NewCompanyForm() {
  const [cnpj, setCnpj] = useState('');
  const [cnpjNum, setCnpjNum] = useState('');
  const [companyData, setCompanyData] = useState({});
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuthentication();

  // Função para gerar uma senha aleatória
  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const saveCompanyDataToFirestore = async (companyInfo, userId) => {
    if (!companyInfo || !userId) {
      console.error("Dados da empresa ou ID do usuário estão faltando.");
      return;
    }
    try {
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: companyInfo.email || 'default@example.com',
        company_cnpj: cnpjNum || 'CNPJ',
        company_name: companyInfo.fantasia || 'Nome Fantasia',
        official_name: companyInfo.nome || 'Nome Oficial',
        isCompany: true,
        category: companyInfo.category || 'Categoria Padrão', // Verifique se este campo é necessário
        // Outros campos necessários
      });
    } catch (error) {
      console.error("Erro ao salvar dados da empresa no Firestore: ", error);
      throw new Error("Falha ao salvar no Firestore");
    }
};

const handleRegisterCompany = async () => {
    const password = generateRandomPassword();
    if (!companyData || !cnpjNum) {
      alert("Dados da empresa não estão completos.");
      return;
    }

    try {
      const registrationResult = await register({
        email: companyData.email || 'default@example.com',
        password,
        isCompany: true,
        additionalData: {
          company_cnpj: cnpjNum || 'CNPJ',
          company_name: companyData.fantasia || 'Nome Fantasia',
          official_name: companyData.nome || 'Nome Oficial',
          category: companyData.category || 'Categoria Padrão', // Verifique se este campo é necessário
        }
      });

      if (registrationResult.user) {
        await saveCompanyDataToFirestore(companyData, registrationResult.user.uid);
      }

      alert("Empresa registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar empresa: ", error);
      alert("Erro ao registrar a empresa.");
    }
};

  

  const formatCnpj = (value) => {
    const numericCnpj = value.replace(/\D/g, ''); // CNPJ apenas com números
    setCnpjNum(numericCnpj); // Atualizar CNPJ numérico

    return numericCnpj
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2')
      .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCnpjChange = (e) => {
    const formattedCnpj = formatCnpj(e.target.value);
    setCnpj(formattedCnpj);
    const numericCnpj = formattedCnpj.replace(/\D/g, '');
    setCnpjNum(numericCnpj); // Garantindo que o CNPJ numérico seja atualizado corretamente
  };

  const isCnpjValid = (cnpj) => {
    return /^[0-9]{14}$/.test(cnpj.replace(/[^\d]+/g, ''));
  };

  const handleContinue = async () => {
    const formattedCnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos para consulta
    if (isCnpjValid(cnpj)) {
      const exists = await checkCnpjExists(formattedCnpj);
      if (exists) {
        setStep('alreadyRegistered'); // Definir um novo estado para CNPJ já registrado
      } else {
        await fetchCompanyData(cnpj);
      }
    }
  };

  const fetchCompanyData = async (cnpj) => {
    const formattedCnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    try {
      const response = await fetch(`/api/companydata?cnpj=${encodeURIComponent(formattedCnpj)}`);
      if (!response.ok) {
        throw new Error('Não foi possível encontrar os dados da empresa. O CNPJ inserido é inválido ou inexistente.'); // Mensagem de erro quando a resposta não é ok
      }
      const data = await response.json();
      if (data.status === 'ERROR') {
        throw new Error('O CNPJ inserido é inválido ou inexistente.'); // Mensagem de erro quando o CNPJ é inválido
      }
      setCompanyData(data);
      setStep(2); // Avança para o próximo passo após obter os dados
    } catch (error) {
      setErrorMessage(error.message);
      setStep('error'); // Define o step como 'error' em caso de erro
    }
  };

  const checkCnpjExists = async (formattedCnpj) => {
    const q = query(collection(db, 'users'), where('company_cnpj', '==', formattedCnpj));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna true se encontrar algum documento, indicando que o CNPJ já existe
  };

  const handleBackToSearch = () => {
    setCnpj('');
    setStep(1);
  };

  useEffect(() => {
    console.log('Current step:', step);
  }, [step]);

  return (
    <div className="flex justify-center p-4">
      <form className="space-y-8 max-w-lg w-full" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <div className="border-b border-gray-900/10 pb-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Digite o CNPJ da nova empresa</h2>
            <div className="mt-10">
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium leading-6 text-gray-900">
                  CNPJ
                </label>
                <div className="mt-2">
                  <input
                    type="text" 
                    name="cnpj"
                    id="cnpj"
                    autoComplete="off"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    placeholder="11.111.111/0001-11"
                    value={cnpj}
                    onChange={handleCnpjChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={`mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600`}
                onClick={handleContinue}
                disabled={!isCnpjValid(cnpj)}
              >
                Continuar
              </button>
              <p className="underline mt-4 cursor-pointer">Não sei o CNPJ</p>
            </div>
          </div>
        )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Encontramos!</h2>
          
          <div className="border border-gray-300 p-4 rounded-md mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nome Fantasia</h3>
            <p className="text-gray-600 mb-2">{companyData.fantasia || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">Razão Social</h3>
            <p className="text-gray-600 mb-2">{companyData.nome || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">CNPJ</h3>
            <p className="text-gray-600 mb-2">{cnpjNum || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600 mb-2">{companyData.email || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">Telefone</h3>
            <p className="text-gray-600 mb-2">{companyData.telefone || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">Setor</h3>
            <p className="text-gray-600 mb-2">{companyData.atividadePrincipal || 'Não informado'}</p>

            <h3 className="text-lg font-semibold text-gray-900">Situação</h3>
            <p className="text-gray-600">{companyData.situacao || 'Não informado'}</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 mb-4 w-1/1 mx-auto"
              onClick={handleRegisterCompany}
            >
              Esta é a empresa que procuro
            </button>
            <button className="text-gray-600 hover:text-gray-800 underline w-full text-center">
              Não é a empresa que procuro
            </button>
          </div>
        </div>
      )}

        {step === 'alreadyRegistered' && (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CNPJ já cadastrado</h2>
            <p className="mb-2">O CNPJ fornecido já está registrado em nosso sistema.</p>
          <Image
            src={registeredImage}
            alt="Registro confirmado"
            width={300} // Ajuste conforme necessário
            height={300} // Ajuste conforme necessário
            className="mx-auto "
          />
          
          <div className="flex flex-col items-center">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 mb-4 w-1/1 mx-auto">
              Ir para o perfil da empresa
            </button>
            <button
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={handleBackToSearch}
              >
                Voltar e verificar novamente
              </button>
          </div>
          
          
        </div>
        )}

        {step === 'error' && (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Houve um erro</h2>
            <p className="mb-4">{errorMessage}</p>
            <Image
              src={erroricon} // Substitua pelo caminho correto da imagem de erro
              alt="Erro"
              width={300} // Ajuste conforme necessário
              height={300} // Ajuste conforme necessário
              className="mx-auto mb-4"
            />
            <div className="flex flex-col items-center">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 mb-4 w-1/1 mx-auto">
              Voltar para tela principal
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 underline"
              onClick={() => setStep(1)}
            >
              Tentar novamente
            </button>
          </div>
            
            
          </div>
        )}

      </form>
    </div>
  );
}



