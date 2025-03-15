import type { CreateAppointmentDto, UpdateAppointmentDto, Appointment, ApiAppointment } from '../../types'
import { transformAppointmentData, mapStatusToBackend } from '../services/ApiTransformData'

const API_URL = process.env.NEXT_PUBLIC_APP_URL // Base URL de ton back-end

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${API_URL}/appointments/all-appointments`)

  if (!res.ok) throw new Error('Failed to fetch appointments')

  const apiAppointments: ApiAppointment[] = await res.json()

  return apiAppointments.map(transformAppointmentData)
}

export const createAppointment = async (data: CreateAppointmentDto): Promise<Appointment> => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to create appointment')

  const apiAppointment: ApiAppointment = await res.json()

  return transformAppointmentData(apiAppointment)
}

export const updateAppointment = async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
  // If status is included in data, map it to backend format
  if (data.status) {
    data.status = mapStatusToBackend(data.status)
  }

  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error('Failed to update appointment')

  const apiAppointment: ApiAppointment = await res.json()

  return transformAppointmentData(apiAppointment)
}

export const deleteAppointment = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) throw new Error('Failed to delete appointment')
}

export const acceptAppointment = async (id: number): Promise<Appointment> => {
  return updateAppointment(id, { status: 'CONFIRMED' })
}
