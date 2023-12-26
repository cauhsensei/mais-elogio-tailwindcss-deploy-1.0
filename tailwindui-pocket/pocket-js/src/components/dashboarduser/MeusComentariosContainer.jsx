'use client'


import { useState, useEffect } from "react";
import { auth, db } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, getDocs } from "firebase/firestore";
import { StarIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/navigation";
import Image from "next/image";

function RatingStarsUser ({ rating }) {
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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleElogioClick = () => {
    router.push('/elogio'); // Redireciona para a rota /elogio
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserComments(user.uid);
      } else {
        console.log("Usuário não está autenticado");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserComments = async (uid) => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const userComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(userComments);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="px-4 sm:px-6 lg:px-8">Carregando...</p>;
  }

  if (comments.length === 0) {
    return <p className="px-4 sm:px-6 lg:px-8">Você ainda não fez nenhum comentário.</p>;
  }

    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Meus comentários</h1>
            <p className="mt-2 text-sm text-gray-700">
              Aqui você pode visualizar todos os elogios realizados por você!
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
            onClick={handleElogioClick}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Fazer Elogio
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Nome
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Título
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estrelas
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comments.map((comment) => (
                  <tr key={comment.uid}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{comment.createdBy}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{comment.title}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{comment.description}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><RatingStarsUser rating={comment.rating} /></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Image src={comment.imageURL} alt="Comentário" width={16} height={16} className="rounded-full" />
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