'use client'

import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    ChartBarSquareIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

const pages = [
    { name: 'Área do consumidor', href: '#', current: false },
    // { name: 'Project Nero', href: '#', current: true },
]

const statuses = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
    Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}

const activityItems = [
    {
        user: {
            name: 'Michael Foster',
            imageUrl:
                'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        projectName: 'ios-app',
        commit: '2d89f0c8',
        branch: 'main',
        date: '1h',
        dateTime: '2023-01-23T11:00',
    },
    // More items...
]

const rankingItems = [
    {
        position: 1,
        companyName: 'Megalink Telecom',
        category: 'Tecnologia',
        imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQkha1Ap9eI0D_h640yhGQ7aea5EaXnUrzg5KZmsLsJpZTz0TDN',
    },
    {
        position: 2,
        companyName: 'Beta Soluções',
        category: 'Financeiro',
        imageUrl: 'https://media.licdn.com/dms/image/C4D0BAQGY0KysTclQhA/company-logo_200_200/0/1669643098859?e=2147483647&v=beta&t=Ehkj5DlYfiM4q_Ql4jrVOhyDVqUHNaiY5sFwwLSFvhc',
    },
    {
        position: 3,
        companyName: 'Pet Care',
        category: 'Saúde Pet',
        imageUrl: 'https://petcare.com.br/wp-content/uploads/2023/11/Logo_novembro_azul_PC.jpeg',
    },
    {
        position: 4,
        companyName: 'Pet Care',
        category: 'Saúde Pet',
        imageUrl: 'https://petcare.com.br/wp-content/uploads/2023/11/Logo_novembro_azul_PC.jpeg',
    },
    {
        position: 5,
        companyName: 'Pet Care',
        category: 'Saúde Pet',
        imageUrl: 'https://petcare.com.br/wp-content/uploads/2023/11/Logo_novembro_azul_PC.jpeg',
    },
    {
        position: 6,
        companyName: 'Pet Care',
        category: 'Saúde Pet',
        imageUrl: 'https://petcare.com.br/wp-content/uploads/2023/11/Logo_novembro_azul_PC.jpeg',
    },
];


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function AreaDoConsumidorContainer() {

    return (
        <>
            <div className='px-4 sm:px-6 lg:px-8'>

                {/* Sticky search header */}
                <main className="lg:pr-96">
                    <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                        <h1 className="text-base font-semibold leading-7 text-black">Área do consumidor</h1>
                    </header>

                    {/* Deployment list */}
                    {/* Decidir o que colocar aqui ainda */}

                </main>

                {/* Activity feed */}
                {/* <aside className="bg-indigo-600 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/10">
                    <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                        <h2 className="text-base font-semibold leading-7 text-white">Ranking das Empresas</h2>
                        <a href="#" className="text-sm font-semibold leading-6 text-gray-300">
                            Ver tudo
                        </a>
                    </header>
                    <ul role="list" className="divide-y divide-white/5">
                        {rankingItems.map((item, index) => (
                            <li key={item.position} className={`px-4 py-4 sm:px-6 lg:px-8 ${index < 3 ? 'bg-indigo-600' : ''}`}>
                                <div className="flex flex-col gap-y-1">
                                    <div className="flex items-center gap-x-3">
                                        <span className={`text-lg font-semibold ${index < 3 ? 'text-yellow-400' : 'text-white'}`}>{`${item.position}º`}</span>
                                        <img src={item.imageUrl} alt="" className="h-10 w-10 flex-none rounded-full bg-gray-800" />
                                        <div>
                                            <h3 className={`truncate text-lg font-semibold leading-6 ${index < 3 ? 'text-yellow-400' : 'text-white'}`}>{item.companyName}</h3>
                                            <span className="flex-none text-sm text-gray-300">{item.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside> */}
            </div>
        </>
    )
}
