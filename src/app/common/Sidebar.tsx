'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Home,
  ClipboardList,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
  ParkingCircle,
  Box,
  Wrench,
  CalendarPlus,
  Search,
  History,
  Car,
} from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('')

  useEffect(() => {
    // Met à jour automatiquement l'élément actif en fonction du pathname
    if (pathname === '/appointments/dashboard') {
      setActiveItem('Dashboard')
    } else if (pathname === '/appointments') {
      setActiveItem('Liste des Rendez-vous')
    } else if (pathname === '/page') {
      setActiveItem('Rendez-vous')
    } else if (pathname === '/parking') {
      setActiveItem('Stationnement')
    } else if (pathname === '/stock') {
      setActiveItem('Stock')
    } else if (pathname === '/stock/order') {
      setActiveItem('Commande')
    } else if (pathname === '/progress') {
      setActiveItem('Intervention')
    } else if (pathname === '/progress/vehicle-progress-client') {
      setActiveItem('Rechercher un rendez-vous')
    } else if (pathname === '/history') {
      setActiveItem('Historique des rendez-vous')
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { icon: <Home size={20} className="text-pink-500" />, title: 'Dashboard', url: '/appointments/dashboard' },
    { icon: <ClipboardList size={20} className="text-green-500" />, title: 'Liste des Rendez-vous', url: '/appointments' },
    { icon: <CalendarPlus size={20} className="text-yellow-500" />, title: 'Prendre un rendez-vous', url: '/users' },
    { icon: <Car size={20} className="text-blue-700" />, title: 'Ajouter un véhicule', url: '/users/vehicle' },
    { icon: <Search size={20} className="text-teal-500" />, title: 'Rechercher un rendez-vous', url: '/progress/vehicle-progress-client' },
    { icon: <History size={20} className="text-cyan-500" />, title: 'Historique des rendez-vous', url: '/history' },
    { icon: <Users size={20} className="text-blue-500" />, title: 'Clients', url: '#' },
    { icon: <ParkingCircle size={20} className="text-orange-500" />, title: 'Stationnement', url: '/parking' },
    { icon: <Box size={20} className="text-purple-500" />, title: 'Stock', url: '/stock' },
    { icon: <Box size={20} className="text-purple-500" />, title: 'Commande', url: '/stock/order' }, // Ajout du bouton Commande
    { icon: <Wrench size={20} className="text-red-500" />, title: 'Intervention', url: '/progress' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <motion.div
        initial={{ width: isOpen ? 280 : 72 }}
        animate={{ width: isOpen ? 280 : 72 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="h-screen bg-gradient-to-br from-white via-gray-100 to-gray-50 shadow-lg flex flex-col border-r border-gray-300 relative"
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 bg-gradient-to-r from-gray-200 to-gray-300 border border-gray-300 rounded-full p-1.5 shadow-md z-10 hover:bg-gray-400"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Profile Section */}
        <div
          className={`p-6 border-b border-gray-300 flex items-center ${
            !isOpen ? 'justify-center' : 'justify-between'
          }`}
        >
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-300 to-indigo-500 border-2 border-indigo-500 shadow-md">
                  <UserCircle2 size={32} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-base">Espace Prestataire</h1>
                <p className="text-sm text-gray-500">Marie Dupont</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-300 to-indigo-500 border-2 border-indigo-500 shadow-md">
                <UserCircle2 size={20} className="text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-200 
                    ${activeItem === item.title ? 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 shadow-xl' : 'text-gray-700 hover:bg-gray-200 hover:shadow-md'} 
                    ${!isOpen && 'justify-center'}`}
                  onClick={() => setActiveItem(item.title)}
                >
                  <div
                    className={`${activeItem === item.title ? 'text-indigo-700' : 'text-gray-500'} ${
                      !isOpen && 'mx-auto'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {isOpen && <span className="ml-4">{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default Sidebar
