import { useState, useEffect, useCallback } from 'react'

import { 
  fetchAppointments, 
  acceptAppointment, 
  deleteAppointment,
  getPendingAppointments,
  getReservedAppointments,
  updateAppointmentStatusToReserved,
  getAppointmentsByUserRole
} from '../services/appointmentService'
import type { Appointment } from '../../types'

export const useAppointments = (userId?: number) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([])
  const [reservedAppointments, setReservedAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      let data: Appointment[]
      
      console.log('Loading appointments with userId:', userId)
      
      if (userId) {
        // Si un userId est fourni, utiliser la fonction basée sur le rôle
        console.log('Fetching appointments for user:', userId)
        data = await getAppointmentsByUserRole(userId)
        console.log('Appointments fetched for user:', data)
      } else {
        // Sinon, charger tous les rendez-vous (pour l'admin)
        console.log('Fetching all appointments (admin view)')
        data = await fetchAppointments()
        console.log('All appointments fetched:', data)
      }
      
      setAppointments(data)
      
      // Filtrer les rendez-vous par statut
      const pending = data.filter(apt => apt.status === 'PENDING')
      const reserved = data.filter(apt => apt.status === 'RESERVED')
      
      console.log('Filtered appointments - Pending:', pending.length, 'Reserved:', reserved.length)
      
      setPendingAppointments(pending)
      setReservedAppointments(reserved)
      
      setError(null)
    } catch (err: any) {
      console.error('Error loading appointments:', err)
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Charger les rendez-vous au montage du composant et quand userId change
  useEffect(() => {
    console.log('useEffect triggered with userId:', userId)
    loadAppointments()
  }, [loadAppointments])

  const updateToReserved = async (id: string | number) => {
    try {
      setLoading(true)
      const numericId = typeof id === 'string' ? parseInt(id) : id
      const updatedAppointment = await updateAppointmentStatusToReserved(numericId)

      // Mettre à jour tous les états
      setAppointments(prev => prev.map(apt => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
      setPendingAppointments(prev => prev.filter(apt => apt.id !== id.toString()))
      setReservedAppointments(prev => [...prev, updatedAppointment])

      return updatedAppointment
    } catch (err: any) {
      console.error('Error updating appointment to reserved:', err)
      setError(err.message || 'Failed to update appointment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const acceptAppointmentById = async (id: string | number) => {
    try {
      setLoading(true)
      const numericId = typeof id === 'string' ? parseInt(id) : id
      const updatedAppointment = await acceptAppointment(numericId)

      // Mettre à jour tous les états
      setAppointments(prev => prev.map(apt => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
      setReservedAppointments(prev => prev.filter(apt => apt.id !== id.toString()))

      return updatedAppointment
    } catch (err: any) {
      console.error('Error accepting appointment:', err)
      setError(err.message || 'Failed to accept appointment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAppointmentById = async (id: string) => {
    try {
      setLoading(true)
      await deleteAppointment(parseInt(id))
      
      // Mettre à jour tous les états
      setAppointments(prev => prev.filter(apt => apt.id !== id))
      setPendingAppointments(prev => prev.filter(apt => apt.id !== id))
      setReservedAppointments(prev => prev.filter(apt => apt.id !== id))
    } catch (err: any) {
      console.error('Error deleting appointment:', err)
      setError(err.message || 'Failed to delete appointment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    appointments,
    pendingAppointments,
    reservedAppointments,
    loading,
    error,
    updateToReserved,
    acceptAppointmentById,
    deleteAppointmentById,
    refreshAppointments: loadAppointments
  }
}
