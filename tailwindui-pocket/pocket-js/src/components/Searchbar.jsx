'use client'

import { useState, useEffect, useRef } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/20/solid';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import Image from 'next/image';

export function Searchbar() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState(null);
  const [isCompany, setIsCompany] = useState(null);

  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        setIsCompany(userSnap.exists() ? userSnap.data().isCompany : null);
      } else {
        setIsCompany(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesRef = collection(db, 'users');
      const q = query(companiesRef, where('isCompany', '==', true));
      const querySnapshot = await getDocs(q);
      const fetchedCompanies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(fetchedCompanies);
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = searchValue === ''
    ? companies
    : companies.filter(company => 
        company.company_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        company.company_cnpj.includes(searchValue)
      );

  const handleCardClick = (event, uid) => {
    event.stopPropagation();
    console.log(`Card clicked: ${uid}`);
    router.push(`/empresas/${uid}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
      <div ref={searchRef}>
      <div className="relative z-0 flex justify-center px-4 py-2 border-b">
        <div className="w-full max-w-md">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full rounded-md border bg-white py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              placeholder="Pesquise por empresa, CNPJ ou site"
              type="search"
              autoComplete="off"
              onFocus={() => setSearchFocus(true)}
              
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </div>
        </div>
      </div>

      {/* Dropdown de sugestões */}
      {searchFocus && (
        <div className="fixed inset-x-0 z-50">
          <div className="bg-white shadow-lg">
            {/* Título para as sugestões de empresas */}
            <h3 className="text-center font-semibold py-4">Confira as empresas mais pesquisadas</h3>
            <div className="flex overflow-x-auto space-x-4 p-4 justify-center">
              {/* Adiciona padding nas laterais para centralizar os cards */}
              <div className="w-full max-w-4xl px-8">
                <div className="flex space-x-4">
                {filteredCompanies.map((company) => (
                    <div key={company.uid} 
                    onClick={(e) => handleCardClick(e, company.uid)}
                    className="flex-none w-36 rounded-lg bg-gray-100 p-4 hover:bg-gray-200 cursor-pointer">
                        {company.iconUrl ? (
                          <Image src={company.iconUrl} alt="" width={30} height={30} className="mx-auto rounded-full object-cover" />
                        ) : (
                          <UserCircleIcon className="h-12 w-12 mx-auto text-gray-400" aria-hidden="true" />
                        )}
                        <div className="text-center mt-2">
                          <div className="text-sm font-semibold">{company.company_name}</div>
                          <div className="text-xs text-gray-600">{company.category}</div>
                          <div className="text-xs text-gray-500">{company.company_cnpj}</div>
                        </div>
                      </div>
                  // teste

                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}