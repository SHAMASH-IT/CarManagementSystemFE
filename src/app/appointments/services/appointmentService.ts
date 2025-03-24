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

  if (!res.ok) throw new Error('Failed to create appointment')

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

export const acceptAppointment = async (id: number): Promise<Appointment> => {
  console.log(`Accepting appointment ${id}`)

  return updateAppointment(id, { status: 'CONFIRMED' })
}