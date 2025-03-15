export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED'
}

export const USER_ROLES = {
  ADMINISTRATEUR: 'ADMINISTRATEUR',
  CLIENT: 'CLIENT',
  MÉCANICIEN: 'MÉCANICIEN'
}

export interface Appointment {
  id: string
  vehicleName: string
  clientName: string
  service: string
  date: string
  status: string
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdAt: string
}

export type AppointmentListProps = {
  appointments: Appointment[]
}

export type UserListProps = {
  users: User[]
}

export interface AppointmentTableProps {
  appointments: Appointment[]
  onDelete: (id: string) => void
  onAccept: (id: string) => void
}

export interface UserTableProps {
  users: User[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
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

export interface UserDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
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

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: 'ADMIN' | 'CLIENT' | 'MECHANIC'
}

export interface UpdateAppointmentDto {
  date?: string
  time?: string
  status?: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: 'ADMIN' | 'CLIENT' | 'MECHANIC'
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

export interface AppointmentListClientProps {
  appointments: CalendarEvent[]
  handleEdit: (eventId: string) => void
  handleDeleteConfirmation: (eventId: string) => void
}

export interface ApiUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'ADMIN' | 'CLIENT' | 'MECHANIC'
  createdAt: string
  updatedAt: string
}
