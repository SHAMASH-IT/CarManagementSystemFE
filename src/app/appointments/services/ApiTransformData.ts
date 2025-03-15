import type { ApiAppointment, Appointment } from '../../types'

/**
 * Transforms API appointment data to frontend appointment format
 */
export const transformAppointmentData = (apiAppointment: ApiAppointment): Appointment => {
  return {
    id: String(apiAppointment.id),
    vehicleName: apiAppointment.vehicle
      ? `${apiAppointment.vehicle.brand} ${apiAppointment.vehicle.model}`
      : 'Unknown Vehicle',
    clientName: 'Fetch from user based on vehicle userId',
    service: apiAppointment.service?.name || 'Unknown Service',
    date: apiAppointment.date,
    status: mapStatusToFrontend(apiAppointment.status)
  }
}

/**
 * Maps backend status values to frontend status values
 */
export const mapStatusToFrontend = (backendStatus: 'RESERVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'): string => {
  switch (backendStatus) {
    case 'RESERVED':
    case 'PENDING':
      return 'PENDING'
    case 'COMPLETED':
      return 'CONFIRMED'
    case 'CANCELLED':
      return 'CANCELED'
    default:
      return 'PENDING'
  }
}

/**
 * Maps frontend status values to backend status values
 */
export const mapStatusToBackend = (frontendStatus: string): 'RESERVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' => {
  switch (frontendStatus) {
    case 'PENDING':
      return 'PENDING'
    case 'CONFIRMED':
      return 'COMPLETED'
    case 'CANCELED':
      return 'CANCELLED'
    default:
      return 'RESERVED'
  }
}
