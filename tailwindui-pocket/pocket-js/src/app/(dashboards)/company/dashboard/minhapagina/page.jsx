"use client"

import { PhotoIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';


export default function EditCompany() {
  const [iconPreview, setIconPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [iconUrl, setIconUrl] = useState(""); 
  const [coverUrl, setCoverUrl] = useState("");
  const [formData, setFormData] = useState({
    pageLink: "",
    about: "",
    email: "",
    address: "",
    instagram: "",
    whatsapp: "",
    otherContact: "",
    twitter: "",
    facebook: "",
    website: "", 
    phone: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        console.log("Usuário não está autenticado");
      }
    });

    return () => unsubscribe(); // Limpeza ao desmontar o componente
  }, []);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFormData({
          pageLink: userData.pageLink || "",
          about: userData.about || "",
          email: userData.email || "",
          address: userData.address || "",
          instagram: userData.instagram || "",
          whatsapp: userData.whatsapp || "",
          otherContact: userData.otherContact || "",
          twitter: userData.twitter || "",
          facebook: userData.facebook || "",
          website: userData.website || "",
          phone: userData.phone || "",
        });
        console.log("Dados carregados:", userData);
        setIconUrl(userData.iconUrl || "");
        setCoverUrl(userData.coverUrl || "");
        setIconPreview(userData.iconUrl || null);
        setCoverPreview(userData.coverUrl || null);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  const handleImageUpload = async (file, imageType) => {
    const currentUser = auth.currentUser;
    if (file && currentUser) {
      const uid = currentUser.uid;
      const imageRef = ref(storage, `companyImages/${uid}/${imageType}/${file.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null;
      }
    }
    return null;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      const updatedFormData = {
        ...formData,
        iconUrl, // Inclua a URL do ícone
        coverUrl // Inclua a URL da capa
      };
    
      const userRef = doc(db, "users", uid);
      try {
        await updateDoc(userRef, updatedFormData);
        alert("Informações atualizadas com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar informações:", error);
      }
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleIconChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
      const url = await handleImageUpload(file, 'icon');
      setIconUrl(url); // Atualize o estado com a URL do ícone
    }
  };
  
  const handleCoverChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      const url = await handleImageUpload(file, 'cover');
      setCoverUrl(url); // Atualize o estado com a URL da capa
    }
  };
  

  return (
    <form className=" px-4 sm:px-6 lg:px-8" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Edite a pagina de perfil da sua empresa</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
          Informações públicas da sua empresa. <span className="font-semibold">Não é obrigatório preencher todos os campos!</span>
        </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Link para página
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">maiselogio.com.br/</span>
                  <input
                    type="text"
                    name="pageLink"
                    id="pageLink"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="devcore"
                    value={formData.pageLink}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                Sobre sua empresa, nos de um breve resumo
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.about}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Esse resumo ficará no seu perfil!</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Sua logo ou foto da sua empresa
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {iconPreview ? (
                  <Image src={iconPreview} alt="Icon Preview" width={144} height={144} className="rounded-full" />

                ) : (
                  <UserCircleIcon className="h-36 w-36 text-gray-300" aria-hidden="true" />
                )}
                <label
                  htmlFor="icon-upload"
                  className="relative cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Upload
                  <input id="icon-upload" name="icon" type="file" className="sr-only" onChange={handleIconChange} />
                </label>
                {iconPreview && (
                  <button
                    type="button"
                    className="bg-white rounded-full p-1 text-red-600 hover:text-red-700"
                    onClick={() => setIconPreview(null)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Foto de capa da sua empresa
              </label>
              <div className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${coverPreview ? 'relative' : ''}`}>
                {coverPreview ? (
                  <>
                    <Image src={coverPreview} alt="Cover Preview" width={500} height={250} className="mx-auto"  />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-600 hover:text-red-700"
                      onClick={() => setCoverPreview(null)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="cover-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        Busque em seus arquivos
                        <input id="cover-upload" name="cover" type="file" className="sr-only" onChange={handleCoverChange} />
                      </label>
                      <p className="pl-1">ou arraste a foto</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Informações de contato e redes sociais</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Essas informações aparecerão na sua página pública.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Número de telefone comercial */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Número de telefone comercial
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Outro contato */}
            <div className="sm:col-span-3">
              <label htmlFor="otherContact" className="block text-sm font-medium leading-6 text-gray-900">
                Outro contato de sua preferência
              </label>
              <input
                type="tel"
                name="otherContact"
                id="otherContact"
                autoComplete="phone-number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.otherContact}
                onChange={handleChange}
              />
            </div>

            {/* Instagram e Facebook */}
            <div className="sm:col-span-3">
              <label htmlFor="instagram" className="block text-sm font-medium leading-6 text-gray-900">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                autoComplete="username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="facebook" className="block text-sm font-medium leading-6 text-gray-900">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                id="facebook"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>

            {/* Twitter e Site */}
            <div className="sm:col-span-3">
              <label htmlFor="twitter" className="block text-sm font-medium leading-6 text-gray-900">
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                id="twitter"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="instagram" className="block text-sm font-medium leading-6 text-gray-900">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                id="instagram"
                pattern="https?://.+"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email comercial
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                Site
              </label>
              <input
                type="url"
                name="website"
                id="website"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Endereço */}
            <div className="sm:col-span-6">
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                id="address"
                autoComplete="address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.address}
                onChange={handleChange}
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
    </form>
  )
}
