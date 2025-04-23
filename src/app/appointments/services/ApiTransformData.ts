import type { ApiAppointment, Appointment } from '../../types'
import moment from 'moment'

// Map frontend status to backend status
export const mapStatusToBackend = (status: string): string => {
  console.log(`Mapping status: ${status}`) // Pour débogage

  // Cette fonction doit renvoyer le format exact attendu par votre API
  switch (status) {
    case 'CONFIRMED':
      return 'CONFIRMED' // Ou le format attendu par votre API
    case 'CANCELED':
      return 'CANCELED' // Ou le format attendu par votre API
    default:
      return 'PENDING' // Ou le format attendu par votre API
  }
}

// Map backend status to frontend status
export const mapStatusToFrontend = (status: string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'CONFIRMED'
    case 'CANCELLED':
      return 'CANCELED'
    case 'RESERVED':
      return 'RESERVED'
    case 'PENDING':
      return 'PENDING'
    default:
      return 'PENDING'
  }
}

// Transform API appointment data to frontend format
export const transformAppointmentData = (apiAppointment: ApiAppointment): Appointment => {
  // Extract vehicle and client information if available
  const vehicleName = apiAppointment.vehicle
    ? `${apiAppointment.vehicle.brand} ${apiAppointment.vehicle.model} (${apiAppointment.vehicle.registration})`
    : 'Véhicule inconnu'

  // You'll need to adapt this part based on how you get the client name
  // If you have user information linked to the vehicle, you could use it
  const clientName = 'Client' // Placeholder - you'll need to adjust this

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
