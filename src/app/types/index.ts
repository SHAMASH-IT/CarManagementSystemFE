export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED'
}

export interface Appointment {
  id: string
  vehicleName: string
  clientName: string
  service: string
  date: string
  status: string
}

export type AppointmentListProps = {
  appointments: Appointment[]
}

export interface AppointmentTableProps {
  appointments: Appointment[]
  onDelete: (id: string) => void
  onAccept: (id: string) => void
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  vehicle: string
  service: string
  additionalInfo: string
}

export type CalendarView = 'month' | 'day' | 'list'

export interface AppointmentDetails {
  vehicle: string
  service: string
  date: string
  time: string
  additionalInfo: string
}

export interface CalendarViewProps {
  initialEvents?: CalendarEvent[]
}

export interface CreateAppointmentDto {
  date: string
  time: string
  serviceId: number
  vehicleId: number
}

export interface UpdateAppointmentDto {
  date?: string
  time?: string
}

export interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  registration: string
  userId: number
}

export interface Service {
  id: number
  name: string
  description: string
}

export interface ApiAppointment {
  id: number
  date: string
  time: string
  status: 'RESERVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  serviceId: number
  vehicleId: number
  service?: Service
  vehicle?: Vehicle
}
