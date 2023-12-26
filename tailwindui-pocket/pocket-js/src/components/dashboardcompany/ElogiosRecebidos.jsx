'use client'

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, collection, where, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { StarIcon } from '@heroicons/react/20/solid';

function RatingStars({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <StarIcon 
          key={index} 
          className={`h-5 w-5 ${index < rating ? 'text-indigo-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function MeusComentariosContainer() {
  const [comentarios, setComentarios] = useState([]);

  const handleDelete = async (commentId) => {
    // Alerta de confirmação
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      await deleteDoc(doc(db, "comments", commentId));
      setComentarios(comentarios.filter(comentario => comentario.id !== commentId));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.company_cnpj) { 
            const companyCNPJ = userData.company_cnpj;
            const commentsRef = collection(db, "comments");
            const q = query(commentsRef, where("cnpj", "==", companyCNPJ));
            const querySnapshot = await getDocs(q);
            const fetchedComentarios = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setComentarios(fetchedComentarios);
          }
        }
      } else {
        console.log("Usuário não está autenticado");
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Elogios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os elogios recebidos, incluindo o nome da pessoa, o elogio, um breve resumo e as estrelas dadas.
          </p>
        </div>

      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Nome da Pessoa
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Titúlo do Elogio
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Resumo do Elogio
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Estrelas
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Editar</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comentarios.map((comentario) => (
                  <tr key={comentario.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {comentario.createdBy}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{comentario.title}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{comentario.description}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><RatingStars rating={comentario.rating} /></td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button onClick={() => handleDelete(comentario.id)} className="text-red-600 hover:text-red-900">
                        Excluir<span className="sr-only">, {comentario.createdBy}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}