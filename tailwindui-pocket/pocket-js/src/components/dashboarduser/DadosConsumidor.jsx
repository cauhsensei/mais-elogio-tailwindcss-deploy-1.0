'use client'

import React, { useState, useEffect } from 'react';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import Image from 'next/image';

export default function DadosConsumidor() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            streetAddress: data.streetAddress || '',
            city: data.city || '',
            region: data.region || '',
            postalCode: data.postalCode || '',
          });
          setUserPhoto(data.photoURL || null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoRemove = async () => {
    if (user && userPhoto) {
      const userPhotoRef = ref(storage, `userPhotos/${user.uid}/userPhoto.jpg`);
      try {
        // Remover a foto do Storage
        await deleteObject(userPhotoRef);
        // Atualizar o usuário no Firestore para remover a URL da foto
        await updateDoc(doc(db, 'users', user.uid), { photoURL: null });
        // Redefinir a foto do perfil para nulo no estado local
        setUserPhoto(null);
      } catch (error) {
        console.error("Erro ao remover foto do perfil:", error);
      }
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file && user) {
      const userPhotoRef = ref(storage, `userPhotos/${user.uid}/userPhoto.jpg`);
      const snapshot = await uploadBytes(userPhotoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUserPhoto(downloadURL);
      await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), userData);
    }
  };

  return (
      <div className="w-3/4 max-h-[500px] overflow-auto mt-6 ml-16"> {/* Container do formulário com largura e altura máxima */}
        <form className='px-4 sm:px-6 lg:px-8' onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Informações Pessoais</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use um endereço permanente onde você possa receber correspondências.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

          <div className="col-span-full">
            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
              Foto de Perfil
            </label>
            <div className="mt-2 flex relative items-center gap-x-3">
        {userPhoto ? (
          <>
            <Image 
              src={userPhoto} 
              alt="User profile" 
              width={150} 
              height={150} 
              className="rounded-full border-none align-middle shadow-xl"
            />
            <div className="flex items-center gap-x-2">
              <label
                htmlFor="photo"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Alterar
              </label>
              <button
                type="button"
                onClick={handlePhotoRemove}
                className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-x-2">
            <UserCircleIcon className="h-36 w-36 text-gray-300" aria-hidden="true" />
            <label
              htmlFor="photo"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Alterar
            </label>
          </div>
        )}
        <input
          type="file"
          id="photo"
          name="photo"
          className="sr-only"
          onChange={handlePhotoChange}
        />
      </div>
    
          </div>

            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Nome
              </label>
              <div className="mt-2">
              <input
                type="text"
                name="first_name"
                id="first-name"
                autoComplete="given-name"
                value={userData.first_name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Sobrenome
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last_name"
                  id="last-name"
                  autoComplete="family-name"
                  value={userData.last_name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Endereço de Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Endereço Residencial
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="streetAddress"
                  id="street-address"
                  autoComplete="street-address"
                  value={userData.streetAddress}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                Cidade
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  value={userData.city}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                Estado 
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  value={userData.region}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                CEP
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  value={userData.postalCode}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
    </div>

  );
}