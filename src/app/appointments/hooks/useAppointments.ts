import { useState, useEffect } from 'react'

import { fetchAppointments, acceptAppointment, deleteAppointment } from '../services/appointmentService'
import type { Appointment } from '../../types'

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = () => {
    setLoading(true)
    fetchAppointments()
      .then(setAppointments)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const acceptAppointmentById = async (id: string | number) => {
    try {
      setLoading(true)
      const numericId = typeof id === 'string' ? parseInt(id) : id
      const updatedAppointment = await acceptAppointment(numericId)

      setAppointments(prev => prev.map(apt => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))

      loadAppointments()

      return updatedAppointment
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAppointmentById = async (id: string) => {
    try {
      setLoading(true)
      await deleteAppointment(parseInt(id))
      setAppointments(prev => prev.filter(apt => apt.id !== id))

      loadAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    appointments,
    loading,
    error,
    acceptAppointmentById,
    deleteAppointmentById,
    refreshAppointments: loadAppointments
  }
}
