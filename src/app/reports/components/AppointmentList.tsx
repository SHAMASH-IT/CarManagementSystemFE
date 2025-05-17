import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Appointment, AppointmentStatus, User } from '../types/appointment.types'

interface AppointmentListProps {
  appointments: Appointment[] | null | undefined
  isLoading: boolean
}

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'RESERVED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: AppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmé'
    case 'PENDING':
      return 'En attente'
    case 'CANCELLED':
      return 'Annulé'
    case 'RESERVED':
      return 'Réservé'
    default:
      return status
  }
}

const getRoleColor = (role?: User['role']) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800'
    case 'PROVIDER':
      return 'bg-blue-100 text-blue-800'
    case 'SUPPLIER':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getRoleText = (role?: User['role']) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur'
    case 'PROVIDER':
      return 'Prestataire'
    case 'SUPPLIER':
      return 'Fournisseur'
    default:
      return 'Client'
  }
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'Non spécifié'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucun rendez-vous trouvé
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Véhicule
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => {
            const totalAmount = appointment.interventions?.reduce((sum: number, intervention) => {
              return sum + (intervention.Invoice?.[0]?.total || 0)
            }, 0)

            return (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(appointment.date), 'dd MMMM yyyy HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-col">
                    <span>{appointment.vehicle.user?.fullName || 'Non spécifié'}</span>
                    {appointment.vehicle.user?.phone && (
                      <span className="text-xs text-gray-500">{appointment.vehicle.user.phone}</span>
                    )}
                    {appointment.vehicle.user?.role && (
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(appointment.vehicle.user.role)}`}>
                        {getRoleText(appointment.vehicle.user.role)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.vehicle ? (
                    <div className="flex flex-col">
                      <span>{`${appointment.vehicle.brand} ${appointment.vehicle.model}`}</span>
                      {appointment.vehicle.registration && (
                        <span className="text-xs text-gray-500">{appointment.vehicle.registration}</span>
                      )}
                    </div>
                  ) : (
                    'Non spécifié'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.service?.name || 'Non spécifié'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AppointmentList 