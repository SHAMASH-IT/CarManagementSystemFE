'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaSpinner, FaUserTie } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { Drawer, IconButton, Typography, Divider, Box } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import { LayoutDashboard, ClipboardCheck, UserCog, Wrench, ParkingCircle, Warehouse, PackageCheck, History } from 'lucide-react'

import { useAppointments } from './hooks/useAppointments'
import AppointmentTable from './components/AppointmentTable'
import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'

import type { ChildrenType } from '../../@core/types'
import type { Appointment } from '../types/index'
import { fetchAppointments } from './services/appointmentService'

// Fonction pour récupérer l'ID de l'utilisateur connecté
const getCurrentUserId = (): number | undefined => {
  // Récupérer le token JWT
  const token = localStorage.getItem('token')
  console.log('Token from localStorage:', token)

  if (token) {
    try {
      // Décoder le token JWT
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const userData = JSON.parse(jsonPayload)
      console.log('Decoded JWT data:', userData)

      // Stocker les données utilisateur dans localStorage
      const userInfo = {
        id: userData.sub || userData.id,
        role: userData.role,
        email: userData.email
      }
      localStorage.setItem('user', JSON.stringify(userInfo))
      console.log('Stored user data:', userInfo)

      if (userInfo.role === 'PROVIDER') {
        console.log('Provider user detected, ID:', userInfo.id)
        return userInfo.id
      } else if (userInfo.role === 'ADMIN') {
        console.log('Admin user detected, returning undefined to show all appointments')
        return undefined
      }
      return userInfo.id
    } catch (e) {
      console.error('Error decoding JWT:', e)
      return undefined
    }
  }
  console.log('No token found in localStorage')
  return undefined
}

const menuItems = [
  { icon: <LayoutDashboard size={22} className="text-pink-500" />, title: 'Dashboard', url: '/appointments/dashboard' },
  { icon: <ClipboardCheck size={22} className="text-green-500" />, title: 'Liste des Rendez-vous', url: '/appointments' },
  { icon: <UserCog size={22} className="text-indigo-500" />, title: 'Gestion Utilisateurs', url: '/admin/users' },
  { icon: <Wrench size={22} className="text-blue-500" />, title: 'Services', url: '/services' },
  { icon: <ParkingCircle size={22} className="text-orange-500" />, title: 'Stationnement', url: '/parking' },
  { icon: <Warehouse size={22} className="text-purple-500" />, title: 'Stock', url: '/stock' },
  { icon: <PackageCheck size={22} className="text-indigo-500" />, title: 'Commande', url: '/stock/order' },
  { icon: <Wrench size={22} className="text-red-500" />, title: 'Intervention', url: '/progress' },
  { icon: <History size={22} className="text-blue-500" />, title: 'Historique des interventions', url: '/history/historyProviderAdmin' }
];

const AppointmentsPage: React.FC<ChildrenType> = ({ children }) => {
  const userId = getCurrentUserId()
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const { 
    appointments, 
    loading, 
    error,
    updateToReserved,
    acceptAppointmentById,
    deleteAppointmentById
  } = useAppointments(userId)
  
  console.log('AppointmentsPage - Received appointments:', appointments)
  
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-w-md"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Chargement des rendez-vous</h2>
        <div className="mt-6 flex justify-center">
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-red-50 dark:bg-gray-900">
      <div className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Erreur de chargement</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen h-screen bg-gray-50 flex-col">
      <div className="flex flex-1">
        {/* Sidebar desktop uniquement */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        {/* Drawer mobile */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80vw', maxWidth: 320, p: 0 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
            <Typography fontWeight={700} fontSize={16}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 transition-all ${
                  pathname === item.url
                    ? 'bg-indigo-50 text-indigo-700 shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setDrawerOpen(false)}
              >
                {item.icon}
                <span>{item.title}</span>
              </a>
            ))}
          </Box>
        </Drawer>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar sticky + hamburger mobile */}
          <div className="sticky top-0 z-20">
            <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 md:hidden">
              <IconButton onClick={() => setDrawerOpen(true)} size="large" edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <span className="ml-2 font-bold text-lg">Liste des Rendez-vous</span>
            </div>
            <Navbar />
          </div>
          {/* Page Content */}
          <main className="flex-1 flex flex-col overflow-y-auto p-2 sm:p-4">
            <div className="container mx-auto">
              <div className="overflow-x-auto">
                <AppointmentTable
                  appointments={appointments}
                  onDelete={deleteAppointmentById}
                  onAccept={acceptAppointmentById}
                  onUpdateToReserved={updateToReserved}
                />
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage
