'use client'

import { Fragment, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import useAuthentication from '@/hooks/useAuthentication';


import { Dialog, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UserIcon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    StarIcon
} from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Header } from '../Header';
import Image from 'next/image';

const navigation = [
    { name: 'Área de empresa', href: '/company/dashboard', icon: HomeIcon, current: false },
    { name: 'Elogios recebidos', href: '/company/dashboard/elogios', icon: StarIcon, current: false },
    { name: 'Minha página', href: '/company/dashboard/minhapagina', icon: UserIcon, current: false },
    //   { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    //   { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    //   { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const teams = [
    { name: 'Configurações', href: '/company/dashboard/configuracoes', icon: Cog6ToothIcon, current: false },
    { name: 'Sair', href: '#', icon: ArrowRightOnRectangleIcon, current: false },
    //   { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    //   { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function SidebarCompany() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { logout } = useAuthentication();
    const [companyData, setCompanyData] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const companyRef = doc(db, 'users', currentUser.uid);
                const companySnap = await getDoc(companyRef);
                if (companySnap.exists()) {
                    setCompanyData(companySnap.data());
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Função para lidar com o logout
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <>
        <Header />
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-2">
                                        <div className="flex h-16 shrink-0 items-center">
                                            
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'bg-indigo-700 text-white'
                                                                            : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <item.icon
                                                                        className={classNames(
                                                                            item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                                            'h-6 w-6 shrink-0'
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div className="text-xs font-semibold leading-6 text-indigo-200">Conta</div>
                                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                    {teams.map((team) => (
                                                            <li key={team.name}>
                                                                <a
                                                                href={team.href}
                                                                onClick={team.name === 'Sair' ? handleLogout : undefined} // Adiciona ação de logout ao botão 'Sair'
                                                                className={classNames(
                                                                    team.current
                                                                    ? 'bg-indigo-700 text-white'
                                                                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                                >
                                                                <team.icon
                                                                    className={classNames(
                                                                    team.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                                    'h-6 w-6 shrink-0'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {team.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                 {/* Static sidebar for desktop */}
                 <div className='flex'>
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col mt-32">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
                    <div className="flex h-16 shrink-0 items-center">
                            
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-indigo-700 text-white'
                                                            : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-indigo-200">Conta</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                    {teams.map((team) => (
                                                            <li key={team.name}>
                                                                <a
                                                                href={team.href}
                                                                onClick={team.name === 'Sair' ? handleLogout : undefined} // Adiciona ação de logout ao botão 'Sair'
                                                                className={classNames(
                                                                    team.current
                                                                    ? 'bg-indigo-700 text-white'
                                                                    : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                                >
                                                                <team.icon
                                                                    className={classNames(
                                                                    team.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                                    'h-6 w-6 shrink-0'
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {team.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="-mx-6 mt-auto">
                            <a
                                href="#"
                                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
                            >
                                {companyData.iconUrl ? (
                                    <Image
                                        width={30}
                                        height={30}
                                        className=" rounded-full"
                                        src={companyData.iconUrl}
                                        alt="Company Profile"
                                    />
                                ) : (
                                    <UserCircleIcon className="h-8 w-8 text-white" aria-hidden="true" />
                                )}
                                <span className="sr-only">Your profile</span>
                                <span aria-hidden="true">{companyData.company_name || 'Company Name'}</span>
                            </a>
                        </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                </div>

                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button type="button" className="-m-2.5 p-2.5 text-indigo-200 lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-white">Área de empresa</div>
                <a href="#">
                    <span className="sr-only">Your profile</span>
                    {companyData.iconUrl ? (
                        <Image
                            width={30}
                            height={30}
                            className="rounded-full"
                            src={companyData.iconUrl}
                            alt="Company Icon"
                        />
                    ) : (
                        <UserCircleIcon className="h-8 w-8 text-white" aria-hidden="true" />
                    )}
                </a>
            </div>

            <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Your content */ }
        
            </div>
          </main>
            </div>
        </>
    )
}
