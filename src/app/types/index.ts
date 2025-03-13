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
