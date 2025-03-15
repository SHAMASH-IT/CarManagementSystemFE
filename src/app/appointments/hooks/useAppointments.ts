import { useState, useEffect } from 'react'

import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../services/appointmentService'

export function useAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchAppointments()
      .then(setAppointments)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addAppointment = async (data: any) => {
    try {
      setLoading(true)
      const newAppointment = await createAppointment(data)

      setAppointments(prev => [...prev, newAppointment])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentById = async (id: number, data: any) => {
    try {
      setLoading(true)
      const updatedAppointment = await updateAppointment(id, data)

      setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteAppointmentById = async (id: number) => {
    try {
      setLoading(true)
      await deleteAppointment(id)
      setAppointments(prev => prev.filter(apt => apt.id !== id))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { appointments, addAppointment, updateAppointmentById, deleteAppointmentById, loading, error }
}
