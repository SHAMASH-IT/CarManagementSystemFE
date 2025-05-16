import type { ApiAppointment, Appointment } from '../../types'
import moment from 'moment'

// Map frontend status to backend status
export const mapStatusToBackend = (status: string): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'CONFIRMED'
    case 'CANCELED':
      return 'CANCELED'
    default:
      return 'PENDING'
  }
}

// Map backend status to frontend status
export const mapStatusToFrontend = (status: string): string => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'CONFIRMED'
    case 'CANCELLED':
      return 'CANCELED'
    case 'RESERVED':
      return 'RESERVED'
    case 'PENDING':
      return 'PENDING'
    case 'IN_PROGRESS':
      return 'IN_PROGRESS'
    default:
      return status || 'PENDING'
  }
}

// Transform API appointment data to frontend format
export const transformAppointmentData = (apiAppointment: ApiAppointment): Appointment => {
  console.log('Raw API appointment data:', apiAppointment)
  console.log('Vehicle data:', apiAppointment.vehicle)
  console.log('User data:', apiAppointment.vehicle?.user)

  // Extract vehicle and client information if available
  const vehicleName = apiAppointment.vehicle
    ? `${apiAppointment.vehicle.brand} ${apiAppointment.vehicle.model} (${apiAppointment.vehicle.registration})`
    : 'Véhicule inconnu'

  // Use vehicle information to create a client identifier
  const clientName = apiAppointment.vehicle
    ? `Client - ${apiAppointment.vehicle.registration}`
    : 'Client non spécifié'

  // Extract service information
  const serviceName = apiAppointment.service?.name || 'Service inconnu'

  // Create datetime from date and time fields
  const appointmentDate = new Date(apiAppointment.date)
  
  // Pas besoin de manipuler le temps car la date de l'API contient déjà l'heure
  // if (apiAppointment.time) {
  //   const timeStr = apiAppointment.time.toString()
  //   const timeParts = timeStr.split(':')

  //   if (timeParts.length >= 2) {
  //     appointmentDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]))
  //   }
  // }

  return {
    id: apiAppointment.id.toString(),
    vehicleName,
    clientName,
    service: serviceName,
    date: moment.utc(appointmentDate).format(), // Convertir en UTC pour éviter les problèmes de fuseau horaire
    status: mapStatusToFrontend(apiAppointment.status)
  }
}
