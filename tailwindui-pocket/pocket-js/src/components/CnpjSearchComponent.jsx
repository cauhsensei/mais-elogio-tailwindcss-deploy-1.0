// components/CnpjSearchComponent.jsx
import Image from 'next/image';
import personcnpj from '../images/personcnpj.png';
import receiptIcon from '../images/receiptIcon.png'; // Substitua pelo caminho correto do ícone de nota fiscal
import billIcon from '../images/billIcon.png'; // Substitua pelo caminho correto do ícone de boleto
import websiteIcon from '../images/websiteIcon.png'; // Substitua pelo caminho correto do ícone de site da empresa

export default function CnpjSearchComponent() {
  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto my-4 md:my-8 flex flex-col md:grid md:grid-cols-2 md:gap-8 items-center">
      <div className="flex flex-col justify-center items-center mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600 text-center">Você tem o CNPJ da empresa?</h1>
        <div className="w-full flex justify-center">
          <Image
            src={personcnpj}
            width={300}
            height={300}
            alt="Usuário com smartphone"
            layout="intrinsic"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-700 text-center mb-6">
          O CNPJ é um número deste jeito: <br />
          <span className="font-mono text-2xl text-indigo-500 font-bold">11.111.111/0001-11</span>
        </p>
        <p className="text-gray-700 mb-4 text-center">
          Você pode encontrar o CNPJ da empresa desejada nesses lugares:
        </p>
        <div className="grid grid-cols-3 gap-4 place-items-center">
          <div className="text-center">
            <Image src={receiptIcon} width={64} height={64} alt="Nota fiscal" />
            <p className="mt-2">Nota fiscal</p>
          </div>
          <div className="text-center">
            <Image src={billIcon} width={64} height={64} alt="Boleto ou orçamento" />
            <p className="mt-2">Boletos</p>
          </div>
          <div className="text-center">
            <Image src={websiteIcon} width={64} height={64} alt="Site da empresa" />
            <p className="mt-2">Site</p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-4">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4">
            Achei o CNPJ!
          </button>
          <p className="underline cursor-pointer">Não sei o CNPJ</p>
        </div>
      </div>
    </div>
  );
}
