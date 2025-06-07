import type { CreateAppointmentDto, UpdateAppointmentDto, Appointment, ApiAppointment } from '../../types'
import { transformAppointmentData, mapStatusToBackend } from './ApiTransformData'

const API_URL = process.env.NEXT_PUBLIC_APP_URL

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${API_URL}/appointments/all-appointments`)

  if (!res.ok) throw new Error('Failed to fetch appointments')

  const apiAppointments: ApiAppointment[] = await res.json()

  return apiAppointments.map(transformAppointmentData)
}

export const createAppointment = async (data: CreateAppointmentDto): Promise<Appointment> => {
  const res = await fetch(`${API_URL}/appointments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

   if (!res.ok) {
      const errorText = await res.text()
      let errorInfo

      try {
        errorInfo = JSON.parse(errorText)
      } catch (e) {
        errorInfo = { message: errorText }
      }

      console.error('API error:', errorInfo)

      // Lancer une erreur plus descriptive
      throw new Error(`Failed to update appointment: ${errorInfo.message || 'Unknown error'}`)
    }

  const apiAppointment: ApiAppointment = await res.json()

  return transformAppointmentData(apiAppointment)
}

export const updateAppointment = async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
  // Assurez-vous que le statut est correctement formaté pour l'API
  if (data.status) {
    data.status = mapStatusToBackend(data.status)
  }

  console.log(`Updating appointment ${id} with data:`, data)

  try {
    const res = await fetch(`${API_URL}/appointments/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const errorText = await res.text()
      let errorInfo

      try {
        errorInfo = JSON.parse(errorText)
      } catch (e) {
        errorInfo = { message: errorText }
      }

      console.error('API error:', errorInfo)

      // Lancer une erreur plus descriptive
      throw new Error(`Failed to update appointment: ${errorInfo.message || 'Unknown error'}`)
    }

    const apiAppointment: ApiAppointment = await res.json()

    return transformAppointmentData(apiAppointment)
  } catch (error) {
    console.error('Update appointment error:', error)
    throw error
  }
}

export const deleteAppointment = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/appointments/cancel/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) throw new Error('Failed to delete appointment')
}

// Fonction pour récupérer les rendez-vous en attente
export const getPendingAppointments = async (): Promise<Appointment[]> => {
  try {
    // Utiliser l'endpoint existant et filtrer côté client
    const res = await fetch(`${API_URL}/appointments/all-appointments`)

    if (!res.ok) throw new Error('Failed to fetch appointments')

    const apiAppointments: ApiAppointment[] = await res.json()
    const allAppointments = apiAppointments.map(transformAppointmentData)
    
    // Filtrer les rendez-vous en attente
    return allAppointments.filter(apt => apt.status === 'PENDING')
  } catch (error) {
    console.error('Error fetching pending appointments:', error)
    throw error
  }
}

// Fonction pour récupérer les rendez-vous réservés
export const getReservedAppointments = async (): Promise<Appointment[]> => {
  try {
    // Utiliser l'endpoint existant et filtrer côté client
    const res = await fetch(`${API_URL}/appointments/all-appointments`)

    if (!res.ok) throw new Error('Failed to fetch appointments')

    const apiAppointments: ApiAppointment[] = await res.json()
    const allAppointments = apiAppointments.map(transformAppointmentData)
    
    // Filtrer les rendez-vous réservés
    return allAppointments.filter(apt => apt.status === 'RESERVED')
  } catch (error) {
    console.error('Error fetching reserved appointments:', error)
    throw error
  }
}

// Nouvelle fonction pour mettre à jour le statut à RESERVED
export const updateAppointmentStatusToReserved = async (id: number): Promise<Appointment> => {
  console.log(`Updating appointment ${id} status to RESERVED`)

  try {
    // Utiliser l'endpoint correct pour mettre à jour le statut
    const res = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) {
      const errorText = await res.text()
      let errorInfo

      try {
        errorInfo = JSON.parse(errorText)
      } catch (e) {
        errorInfo = { message: errorText }
      }

      console.error('API error:', errorInfo)
      throw new Error(`Failed to update appointment status: ${errorInfo.message || 'Unknown error'}`)
    }

    const apiAppointment: ApiAppointment = await res.json()
    return transformAppointmentData(apiAppointment)
  } catch (error) {
    console.error('Update appointment status error:', error)
    throw error
  }
}

// Fonction pour accepter un rendez-vous (mise à jour du statut à CONFIRMED)
export const acceptAppointment = async (id: number): Promise<Appointment> => {
  console.log(`Accepting appointment ${id}`)
  return updateAppointment(id, { status: 'CONFIRMED' })
}

// Fonction pour récupérer les rendez-vous en fonction du rôle de l'utilisateur
export const getAppointmentsByUserRole = async (userId: number): Promise<Appointment[]> => {
  try {
    const userStr = localStorage.getItem('user')
    let userRole = 'USER'
    let userData: any = null
    
    if (userStr) {
      try {
        userData = JSON.parse(userStr)
        userRole = userData.role
        console.log('Current user data:', userData)
        console.log('Current user role:', userRole)
        console.log('Current user ID:', userId)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Récupérer tous les rendez-vous
    const res = await fetch(`${API_URL}/appointments/all-appointments`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!res.ok) {
      const errorText = await res.text()
      let errorInfo

      try {
        errorInfo = JSON.parse(errorText)
      } catch (e) {
        errorInfo = { message: errorText }
      }

      console.error('API error response:', errorInfo)
      throw new Error(`Failed to fetch appointments: ${errorInfo.message || 'Unknown error'}`)
    }

    const apiAppointments: ApiAppointment[] = await res.json()
    console.log('All appointments from API:', apiAppointments)

    // Filtrer les rendez-vous en fonction du rôle
    let filteredAppointments = apiAppointments

    if (userRole === 'PROVIDER') {
      // Pour les providers, ne montrer que les rendez-vous de leurs services
      console.log('Filtering appointments for provider...')
      console.log('Provider ID:', userId)
      
      filteredAppointments = apiAppointments.filter(apt => {
        const serviceProviderId = apt.service?.providerId
        console.log('Appointment:', {
          id: apt.id,
          serviceId: apt.serviceId,
          serviceProviderId: serviceProviderId,
          matches: serviceProviderId === userId
        })
        return serviceProviderId === userId
      })
      
      console.log('Filtered appointments for provider:', filteredAppointments)
    } else if (userRole === 'ADMIN') {
      // Pour les admins, montrer tous les rendez-vous
      console.log('Showing all appointments for admin')
    } else {
      // Pour les autres utilisateurs, ne montrer que leurs rendez-vous
      filteredAppointments = apiAppointments.filter(apt => 
        apt.vehicle && apt.vehicle.userId === userId
      )
      console.log('Filtered appointments for user:', filteredAppointments)
    }
    
    const transformedAppointments = filteredAppointments.map(transformAppointmentData)
    console.log('Final transformed appointments:', transformedAppointments)
    
    return transformedAppointments
  } catch (error) {
    console.error('Error fetching appointments by user role:', error)
    throw error
  }
}


