export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED'
}

export enum Status {
  RESERVED = 'RESERVED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// User roles enums
export const USER_ROLES = {
  ADMINISTRATEUR: 'ADMINISTRATEUR',
  CLIENT: 'CLIENT',
  MÉCANICIEN: 'MÉCANICIEN'
}

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  MECHANIC = 'MECHANIC'
}

// Parking status
export enum StatusP {
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  EMPTY = 'EMPTY'
}

// Basic entity interfaces
export interface Appointment {
  id: string
  vehicleName: string
  clientName: string
  service: string
  date: string
  status: string
  vehicle?: {
    userId: number
    brand: string
    model: string
    registration: string
  }
  serviceData?: Service
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdAt: string
}

export interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  registration: string
  userId: number
  user?: ApiUser
}

export interface Service {
  id: number
  name: string
  description: string
  providerId: number
}

// Calendar related interfaces
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  vehicle: string
  vehicleName: string
  service: string
  additionalInfo: any
  status?: 'RESERVED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

export type CalendarView = 'month' | 'day' | 'list'

// Detailed entity interfaces for API
export interface ApiAppointment {
  id: number
  date: string
  time: string
  status: 'RESERVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  serviceId: number
  vehicleId: number
  service?: Service
  vehicle?: {
    id: number
    userId: number
    brand: string
    model: string
    registration: string
    user?: {
     
      name: string
    }
  }
}

export interface ApiUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'ADMIN' | 'USER' | 'PROVIDER'
  createdAt: string
  updatedAt: string
}

// Component props interfaces
export interface AppointmentListProps {
  appointments: Appointment[]
}

export interface UserListProps {
  users: User[]
}

export interface AppointmentTableProps {
  appointments: Appointment[]
  onDelete: (id: string) => void
  onAccept: (id: string) => void
  onUpdateToReserved: (id: string) => void
}

export interface UserTableProps {
  users: User[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export interface CalendarViewProps {
  initialEvents?: CalendarEvent[]
}

export interface AppointmentListClientProps {
  appointments: CalendarEvent[]
  handleEdit: (eventId: string) => void
  handleDeleteConfirmation: (eventId: string) => void
}

// Detail interfaces
export interface AppointmentDetails {
  vehicle: string
  service: string
  date: string
  time: string
}

/*export interface UserDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
}*/

// DTO interfaces for API requests
export interface CreateAppointmentDto {
  date: any
  time: any
  serviceId: number
  vehicleId: number
}

export interface UpdateAppointmentDto {
  date?: string
  time?: string
  status?: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: 'ADMIN' | 'USER' | 'PROVIDER'
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: 'ADMIN' | 'USER' | 'PROVIDER'
}

// Form data interface for appointments
export interface AppointmentFormData {
  date: string
  time: string
  vehicleId: number
  serviceId: number
}

export interface Stock {
  id: string
  name: string
  marque: string
  stock: number
  threshold: number
  price: number
  initialPrice: number
  categoryId: number
  category: {
    id: number
    name: string
  }
}

export interface Category {
  id: number;
  name: string;
   providerId: number;
}

export interface CategoryFormData {
  name: string;
 providerId: number;
}
