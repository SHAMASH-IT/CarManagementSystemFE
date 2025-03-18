'use client'

import { useState, useEffect } from 'react'

import api from '../../../../lib/axiosInstance'

interface Service {
  id: number
  name: string
  description: string
}

interface Appointment {
  id: number
  date: string
  time: string
  status: 'RESERVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  serviceId: number
  vehicleId: number
  service?: Service
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  // Fetch all services
  const fetchServices = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get(`${API_URL}/services`)

      if (!response) {
        throw new Error('Erreur lors de la récupération des services')
      }

      setServices(response.data)

      return response.data
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Impossible de charger les services. Veuillez réessayer plus tard.')

      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/appointments/all-appointments`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()

      console.log('message', data)

      setAppointments(data)

      return data
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Impossible de charger les rendez-vous. Veuillez réessayer plus tard.')

      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments for a specific vehicle
  const fetchVehicleAppointments = async (vehicleId: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/appointments/vehicle-appointments/${vehicleId}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous du véhicule')
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error('Error fetching vehicle appointments:', err)
      setError('Impossible de charger les rendez-vous du véhicule. Veuillez réessayer plus tard.')

      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new appointment
  const createAppointment = async (appointmentData: { date: any; time: any; vehicleId: number; serviceId: number }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/appointments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous')
      }

      const data = await response.json()

      // Refresh appointments list
      await fetchAppointments()

      return data
    } catch (err) {
      console.error('Error creating appointment:', err)
      setError('Impossible de créer le rendez-vous. Veuillez réessayer plus tard.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel an appointment
  const cancelAppointment = async (appointmentId: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/appointments/cancel/${appointmentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation du rendez-vous")
      }

      const data = await response.json()

      // Refresh appointments list
      await fetchAppointments()

      return data
    } catch (err) {
      console.error('Error canceling appointment:', err)
      setError("Impossible d'annuler le rendez-vous. Veuillez réessayer plus tard.")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update an appointment
  const updateAppointment = async (appointmentId: number, updateData: { date?: string; time?: string }) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/appointments/update/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du rendez-vous')
      }

      const data = await response.json()

      // Refresh appointments list
      await fetchAppointments()

      return data
    } catch (err) {
      console.error('Error updating appointment:', err)
      setError('Impossible de mettre à jour le rendez-vous. Veuillez réessayer plus tard.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Get service by ID
  const getServiceById = (serviceId: number) => {
    return services.find(service => service.id === serviceId) || null
  }

  // Convert appointments to CalendarEvent format
  const getCalendarEvents = () => {
    return appointments.map(appointment => {
      const service = getServiceById(appointment.serviceId)
      const dateTime = new Date(`${appointment.date}T${appointment.time}`)
      const endTime = new Date(dateTime.getTime() + 60 * 60 * 1000) // Adding 1 hour for end time

      return {
        id: appointment.id.toString(),
        title: `Rendez-vous ${service?.name || ''}`,
        start: dateTime,
        end: endTime,
        service: service?.name || '',
        serviceId: appointment.serviceId,
        vehicleId: appointment.vehicleId,
        status: appointment.status
      }
    })
  }

  useEffect(() => {
    // Fetch services on hook initialization
    fetchServices()
  }, [])

  return {
    services,
    appointments,
    isLoading,
    error,
    fetchServices,
    fetchAppointments,
    fetchVehicleAppointments,
    createAppointment,
    cancelAppointment,
    updateAppointment,
    getServiceById,
    getCalendarEvents
  }
}

export default useServices
