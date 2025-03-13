'use client'

import React, { useState } from 'react'

import {
  Bell,
  Search,
  UserCircle2,
  X,
  ChevronDown,
  MessageSquare,
  LogOut,
  Settings,
  Calendar,
  Mail
} from 'lucide-react'

const notifications = [
  {
    id: 1,
    icon: <Calendar className='h-6 w-6 text-green-500' />,
    message: 'Nouvelle demande de rendez-vous de John Doe',
    avatar: 'https://i.pravatar.cc/40?img=1', // Utilisation d'une URL valide pour les avatars
    time: 'Il y a 2 heures'
  },
  {
    id: 2,
    icon: <Calendar className='h-6 w-6 text-blue-500' />,
    message: 'Rappel : rendez-vous avec Jane Smith demain',
    avatar: 'https://i.pravatar.cc/40?img=2', // Utilisation d'une URL valide pour les avatars
    time: 'Il y a 1 jour'
  },
  {
    id: 3,
    icon: <Mail className='h-6 w-6 text-yellow-500' />,
    message: 'Nouveau message de Paul Brown',
    avatar: 'https://i.pravatar.cc/40?img=3', // Utilisation d'une URL valide pour les avatars
    time: 'Il y a 3 jours'
  }
]

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)

  return (
    <nav className='bg-white shadow-none'>
      <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-20'>
          <div
            className={`${isSearchOpen ? 'flex' : 'hidden md:flex'} flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end`}
          >
            <div className='max-w-lg w-full'>
              <label htmlFor='search' className='sr-only'>
                Rechercher
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-6 w-6 text-gray-400' />
                </div>
                <input
                  id='search'
                  name='search'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  placeholder='Rechercher...'
                  type='search'
                />
              </div>
            </div>
            <button className='ml-2 md:hidden' onClick={() => setIsSearchOpen(false)}>
              <X className='h-6 w-6 text-gray-500' />
            </button>
          </div>

          <div className='flex items-center'>
            <button
              className='p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden'
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className='h-6 w-6' />
            </button>

            <div className='relative'>
              <button
                className='ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative'
                onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
              >
                <Bell className='h-6 w-6' />
                <span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500'></span>
              </button>
              {isNotificationMenuOpen && (
                <div className='absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
                  <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                    <span className='font-bold text-gray-700'>Notifications</span>
                    <button onClick={() => setIsNotificationMenuOpen(false)}>
                      <X className='h-6 w-6 text-gray-500' />
                    </button>
                  </div>
                  <ul className='max-h-80 overflow-y-auto'>
                    {notifications.map(notification => (
                      <li key={notification.id} className='px-4 py-2 hover:bg-gray-100 flex items-center space-x-2'>
                        <img src={notification.avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>{notification.message}</span>
                          <span className='text-sm text-gray-500'>{notification.time}</span>
                        </div>
                        {notification.icon}
                      </li>
                    ))}
                  </ul>
                  <div className='p-2 border-t border-gray-200 text-center'>
                    <button className='text-sm text-indigo-500 hover:text-indigo-600'>
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className='ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative'>
              <MessageSquare className='h-6 w-6' />
              <span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-indigo-500'></span>
            </button>

            <div className='ml-3 relative'>
              <button
                className='flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100'
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500'>
                  <UserCircle2 size={24} className='text-indigo-600' />
                </div>
                <div className='hidden md:flex items-center'>
                  <span className='text-sm font-medium text-gray-700'>Marie Dupont</span>
                  <ChevronDown className='ml-1 h-4 w-4 text-gray-500' />
                </div>
              </button>
              {isProfileMenuOpen && (
                <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10'>
                  <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    <Settings className='inline mr-2' /> Paramètres
                  </a>
                  <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    <LogOut className='inline mr-2' /> Déconnexion
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
