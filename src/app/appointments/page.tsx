'use client'

import React, { useEffect, useState } from 'react'

import useAppointments from './hooks/useAppointments'
import AppointmentTable from './components/AppointmentTable'
import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'

import type { ChildrenType } from '../../@core/types'
import type { Appointment } from '../types/index'

const AppointmentsPage: React.FC<ChildrenType> = ({ children }) => {
  const { appointments, loading, error } = useAppointments()
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments)

  useEffect(() => {
    setAppointmentList(appointments)
  }, [appointments])

  if (loading) return <div>Chargement des rendez-vous...</div>

  if (error) return <div>{error}</div>

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
            <div className='flex items-center justify-between mb-8'></div>

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
