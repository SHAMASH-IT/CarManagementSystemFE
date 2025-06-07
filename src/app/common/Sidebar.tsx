'use client'

import { useState, useEffect, useMemo } from 'react'
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
  UserCog,
  Package,
  ShoppingCart,
  LayoutDashboard,
  ClipboardCheck,
  Warehouse,
  PackageCheck,
  Settings,
  FileText,
  CarFront,
  CalendarClock,
  UserRound,
  Shield,
  Crown,
  UserCheck,
  BadgeCheck,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { authService } from '../login/services/auth.service'
import { getUserProfile } from '../profile/services/profileService'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          }).join(''))

          const userData = JSON.parse(jsonPayload)
          setUserRole(userData.role)

          // Récupérer le profil utilisateur pour obtenir le nom
          if (userData.sub) {
            try {
              const profile = await getUserProfile(userData.sub)
              setUserName(profile.name)
            } catch (error) {
              console.error('Erreur lors de la récupération du profil:', error)
            }
          }
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error)
        }
      }
      setIsLoading(false)
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    // Met à jour automatiquement l'élément actif en fonction du pathname
    if (pathname === '/appointments/dashboard') {
      setActiveItem('Tableau de bord')
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
    } else if (pathname === '/admin/users') {
      setActiveItem('Gestion Utilisateurs')
    } else if (pathname === '/profile') {
      setActiveItem('Modifier le profil')
    } else if (pathname === '/services') {
      setActiveItem('Services')
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Menu items pour les clients
  const clientMenuItems = [
    { 
      icon: <CalendarClock size={22} className="text-yellow-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Prendre un rendez-vous', 
      url: '/users' 
    },
    { 
      icon: <CarFront size={22} className="text-blue-700 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Ajouter un véhicule', 
      url: '/users/vehicle' 
    },
    { 
      icon: <Search size={22} className="text-teal-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Rechercher un rendez-vous', 
      url: '/progress/vehicle-progress-client' 
    },
    { 
      icon: <FileText size={22} className="text-cyan-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Historique des rendez-vous', 
      url: '/history' 
    }
  ]

  // Menu items pour les prestataires
  const providerMenuItems = [
    { 
      icon: <LayoutDashboard size={22} className="text-pink-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Tableau de bord', 
      url: '/appointments/dashboard' 
    },
    { 
      icon: <ClipboardCheck size={22} className="text-green-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Gestion des Rendez-vous', 
      url: '/appointments' 
    },
    { 
      icon: <ParkingCircle size={22} className="text-orange-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Stationnement', 
      url: '/parking' 
    },
    { 
      icon: <Warehouse size={22} className="text-purple-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Stock', 
      url: '/stock' 
    },
    { 
      icon: <ShoppingCart size={22} className="text-indigo-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Commande', 
      url: '/stock/order' 
    },
    { 
      icon: <PackageCheck size={22} className="text-emerald-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Ventes', 
      url: '/stock/orderSell' 
    },
    { 
      icon: <Wrench size={22} className="text-red-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Intervention', 
      url: '/progress' 
    },
    { 
      icon: <History size={22} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Historique des interventions', 
      url: '/history/historyProviderAdmin' 
    }
  ]

  // Menu items pour les administrateurs
  const adminMenuItems = [
    { 
      icon: <LayoutDashboard size={22} className="text-indigo-600 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Tableau de bord', 
      url: '/reports' 
    },
    { 
      icon: <UserCog size={22} className="text-indigo-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Gestion Utilisateurs', 
      url: '/admin/users' 
    },
    { 
      icon: <Wrench size={22} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Gestion des Services', 
      url: '/services' 
    },
    { 
      icon: <History size={22} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />, 
      title: 'Historique des interventions', 
      url: '/history/historyProviderAdmin' 
    }
  ]

  // Sélectionner les menu items en fonction du rôle
  const menuItems = useMemo(() => {
    if (isLoading) return []
    
    return userRole === 'ADMIN' 
      ? adminMenuItems 
      : userRole === 'PROVIDER' 
        ? providerMenuItems 
        : clientMenuItems
  }, [userRole, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="h-full bg-white shadow-xl flex flex-col border-r border-gray-200 relative backdrop-blur-sm bg-opacity-90 w-72">
          <div className="p-6 border-b border-gray-200 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <motion.div
        initial={{ width: isOpen ? 280 : 72 }}
        animate={{ width: isOpen ? 280 : 72 }}
        transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
        className="h-full bg-white shadow-xl flex flex-col border-r border-gray-200 relative backdrop-blur-sm bg-opacity-90"
      >
        {/* Toggle Button */}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1.5 shadow-lg z-10 hover:bg-gray-50 transition-colors duration-200"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <ChevronLeft size={16} className="text-gray-600" /> : <ChevronRight size={16} className="text-gray-600" />}
        </motion.button>

        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 border-b border-gray-200 flex items-center ${!isOpen ? 'justify-center' : 'justify-between'} bg-gradient-to-r from-indigo-50 to-white`}
        >
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-white shadow-lg"
                >
                  <UserCircle2 size={20} className="text-white" />
                </motion.div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-sm"></span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-sm">
                  {userRole === 'ADMIN' 
                    ? 'Administrateur Système' 
                    : userRole === 'PROVIDER' 
                      ? userName ? `Bienvenue, ${userName}` : 'Espace Prestataire'
                      : 'Espace Personnel'}
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {userRole === 'ADMIN' 
                    ? 'Panneau de contrôle' 
                    : userRole === 'PROVIDER' 
                      ? 'Gestion des services auto'
                      : 'Gestion de vos véhicules'}
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-white shadow-lg">
                <UserCircle2 size={16} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border-2 border-white rounded-full shadow-sm"></span>
            </motion.div>
          )}
        </motion.div>

        {/* Menu Items with Modern Icons */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ul className="space-y-2 p-4">
            {menuItems.map((item) => (
              <motion.li 
                key={item.title}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a
                  href={item.url}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg group transition-all duration-200 
                    ${pathname === item.url || activeItem === item.title ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-xl' : 'text-gray-700 hover:bg-gray-200 hover:shadow-md'} 
                    ${!isOpen && 'justify-center'}`}
                  onClick={() => setActiveItem(item.title)}
                >
                  <div className={`${pathname === item.url || activeItem === item.title ? 'text-blue-700' : 'text-gray-500'} ${!isOpen && 'mx-auto'} transition-colors duration-200`}>
                    {item.icon}
                  </div>
                  {isOpen && <span className="ml-4">{item.title}</span>}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default Sidebar
