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
  { name: 'Área da Empresa', href: '#', current: false },
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
  // More items...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function AreaDaEmpresa() {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">


        <main className="lg:pr-96">
          <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-black">Área da Empresa</h1>
          </header>

          {/* Deployment list */}
          {/* Decidir o que colocar aqui ainda */}

        </main>

        {/* Activity feed */}
        
      </div>
    </>
  )
}
