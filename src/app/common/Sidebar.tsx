'use client'

import { useState } from 'react'

import {
  Home,
  ClipboardList,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  UserCircle2,
  Calendar,
  ParkingCircle
} from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('Dashboard')

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { icon: <Home size={20} />, title: 'Dashboard', url: '#', badge: null },
    { icon: <Calendar size={20} />, title: 'Rendez-vous', url: '/page', badge: '5' },
    { icon: <ClipboardList size={20} />, title: 'Liste des Rendez-vous', url: '#', badge: null },
    { icon: <Users size={20} />, title: 'Clients', url: '#', badge: '12' },
    { icon: <ParkingCircle size={20} />, title: 'Stationnement', url: '#', badge: null }
  ]

  const settingsItems = [
    { icon: <Settings size={20} />, title: 'Paramètres', url: '#', badge: null },
    { icon: <LogOut size={20} />, title: 'Déconnexion', url: '#', badge: null }
  ]

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`h-screen bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72' : 'w-20'
        } flex flex-col border-r border-gray-200 relative`}
      >
        {/* Toggle button - positioned absolutely */}
        <button
          onClick={toggleSidebar}
          className='absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md z-10 hover:bg-gray-50'
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Header with profile icon  */}
        <div className={`p-4 border-b border-gray-200 ${!isOpen && 'justify-center'} flex items-center`}>
          {isOpen ? (
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-500'>
                  <UserCircle2 size={24} className='text-indigo-600' />
                </div>
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
              </div>
              <div>
                <h1 className='font-bold text-gray-800'>Espace Prestataire</h1>
                <p className='text-xs text-gray-500'>Marie Dupont</p>
              </div>
            </div>
          ) : (
            <div className='mx-auto relative'>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500'>
                <UserCircle2 size={16} className='text-indigo-600' />
              </div>
              <span className='absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full'></span>
            </div>
          )}
        </div>

        {/* Notification and quick actions */}
        {isOpen && (
          <div className='px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='relative'>
                <Bell size={18} className='text-gray-600' />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                  2
                </span>
              </div>
              <span className='text-sm font-medium text-gray-600'>Notifications</span>
            </div>
            <span className='text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer'>Voir tout</span>
          </div>
        )}

        {/* Menu Items */}
        <div className='flex-1 overflow-y-auto py-4'>
          <div className='px-4 mb-2'>
            <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen && 'text-center'}`}>
              {isOpen ? 'Menu Principal' : '•••'}
            </h2>
          </div>
          <ul className='space-y-1 px-2'>
            {menuItems.map(item => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group transition-all duration-200 
                    ${activeItem === item.title ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'} 
                    ${!isOpen && 'justify-center'}`}
                  onClick={() => setActiveItem(item.title)}
                >
                  <div
                    className={`${activeItem === item.title ? 'text-indigo-700' : 'text-gray-500'} ${!isOpen && 'mx-auto'}`}
                  >
                    {item.icon}
                  </div>

                  {isOpen && (
                    <div className='ml-3 flex-1 flex justify-between items-center'>
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className='bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full'>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className='absolute left-20 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50 w-max'>
                      <div className='flex items-center space-x-2'>
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className='bg-indigo-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full'>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Active indicator */}
                  {activeItem === item.title && (
                    <div className='absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-lg'></div>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Separator */}
          <div className='my-4 px-4'>
            <div className={`h-px bg-gray-200 ${!isOpen && 'mx-2'}`}></div>
          </div>

          {/* Settings section */}
          <div className='px-4 mb-2'>
            <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen && 'text-center'}`}>
              {isOpen ? 'Paramètres' : '•••'}
            </h2>
          </div>
          <ul className='space-y-1 px-2'>
            {settingsItems.map(item => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group transition-all duration-200 
                    ${activeItem === item.title ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'} 
                    ${!isOpen && 'justify-center'}`}
                  onClick={() => setActiveItem(item.title)}
                >
                  <div
                    className={`${activeItem === item.title ? 'text-indigo-700' : 'text-gray-500'} ${!isOpen && 'mx-auto'}`}
                  >
                    {item.icon}
                  </div>

                  {isOpen && <span className='ml-3'>{item.title}</span>}

                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className='absolute left-20 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50 w-max'>
                      {item.title}
                    </div>
                  )}

                  {/* Active indicator */}
                  {activeItem === item.title && (
                    <div className='absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-lg'></div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
