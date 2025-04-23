'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaSpinner, FaUserTie } from 'react-icons/fa'

import { useAppointments } from './hooks/useAppointments'
import AppointmentTable from './components/AppointmentTable'
import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'

import type { ChildrenType } from '../../@core/types'
import type { Appointment } from '../types/index'
import { fetchAppointments } from './services/appointmentService'

const AppointmentsPage: React.FC<ChildrenType> = ({ children }) => {
  const { appointments, loading, error } = useAppointments()
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments)

  useEffect(() => {
    setAppointmentList(appointments)
  }, [appointments])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

  const handleDeleteAppointment = (id: string) => {
    setAppointmentList(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id))
  }

  const handleAcceptAppointment = (id: string) => {
    setAppointmentList(prevAppointments =>
      prevAppointments.map(appointment => (appointment.id === id ? { ...appointment, status: 'Accepté' } : appointment))
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex'>
        <Sidebar />
        <div className='flex-grow'>
          <Navbar />
          <div className='container mx-auto p-4'>
          
            <div className='overflow-x-auto'>
              <AppointmentTable
                appointments={appointmentList}
                onDelete={handleDeleteAppointment}
                onAccept={handleAcceptAppointment}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage
