'use client'
import React, { useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/fr' // Import de la locale française

import { FaCheckCircle, FaTrashAlt, FaTools } from 'react-icons/fa' // Import des icônes nécessaires

import type { AppointmentTableProps } from '../../types/index'
import { useAppointments } from '../hooks/useAppointments'

// Configurer moment.js pour utiliser le français
moment.locale('fr')

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments: initialAppointments }) => {
  console.log('Initializing AppointmentTable component')
  console.log('Initial appointments:', initialAppointments)

  const { appointments, acceptAppointmentById, deleteAppointmentById } = useAppointments()

  console.log('Appointments from hook:', appointments)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('3 second timer executed')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          container: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-200 text-green-800',
          label: 'Accepté'
        }
      case 'CANCELED':
        return {
          container: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-200 text-red-800',
          label: 'Annulé'
        }
      default: // RESERVED
        return {
          container: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-200 text-green-800',
          label: 'Réservé'
        }
    }
  }

  const displayAppointments = appointments.length > 0 ? appointments : initialAppointments

  console.log('Display appointments:', displayAppointments)

  return (
    <div className='space-y-6'>
      <div className='overflow-x-auto'>
        <h2 className='mb-4 text-2xl font-bold text-blue-700 dark:text-blue-300'>Détails des Rendez-vous</h2>
        <div className='inline-block min-w-full overflow-hidden rounded-lg shadow-md'>
          <table className='min-w-full bg-white dark:bg-gray-800 border-collapse block md:table'>
            <thead className='block md:table-header-group'>
              <tr className='border border-blue-300 dark:border-blue-700 bg-blue-200 dark:bg-blue-700 md:border-none block md:table-row'>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Véhicule
                </th>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Nom
                </th>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Service
                </th>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Date
                </th>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Statut
                </th>
                <th className='p-3 text-blue-700 dark:text-blue-300 font-bold md:border md:border-blue-300 text-left block md:table-cell'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='block md:table-row-group'>
              {displayAppointments.map(appointment => {
                const statusStyle = getStatusStyle(appointment.status)

                return (
                  <tr
                    key={appointment.id}
                    className='border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 md:border-none block md:table-row transition duration-200 ease-in-out'
                  >
                    <td className='p-3 text-gray-700 dark:text-gray-300 md:border md:border-gray-300 text-left block md:table-cell'>
                      {appointment.vehicleName}
                    </td>
                    <td className='p-3 text-gray-700 dark:text-gray-300 md:border md:border-gray-300 text-left block md:table-cell'>
                      {appointment.clientName}
                    </td>
                    <td className='p-3 text-gray-700 dark:text-gray-300 md:border md:border-gray-300 text-left block md:table-cell'>
                      {appointment.service}
                    </td>
                    <td className='p-3 text-gray-700 dark:text-gray-300 md:border md:border-gray-300 text-left block md:table-cell'>
                      {moment(appointment.date).format('DD/MM/YYYY HH:mm')}
                    </td>
                    <td
                      className={`p-3 md:border md:border-gray-300 text-left block md:table-cell ${statusStyle.container}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${statusStyle.badge}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className='p-3 md:border md:border-gray-300 text-left block md:table-cell'>
                      <div className='flex space-x-2'>
                        {/* Icône Rejeter */}
                        <div className='relative group'>
                          <button
                            className='bg-red-500 dark:bg-red-600 text-white p-1 rounded-full hover:bg-red-600 dark:hover:bg-red-700'
                            onClick={() => {
                              console.log(`Tentative de suppression du rendez-vous ${appointment.id}`)

                              deleteAppointmentById(appointment.id)
                                .then(() => console.log(`Rendez-vous ${appointment.id} supprimé avec succès`))
                                .catch(err =>
                                  console.error(`Erreur lors de la suppression du rendez-vous ${appointment.id}:`, err)
                                )
                            }}
                          >
                            <FaTrashAlt className='w-5 h-5' />
                          </button>
                          <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs leading-none text-white bg-red-500 rounded opacity-0 group-hover:opacity-100 z-0'>
                            Rejeter
                          </span>
                        </div>

                        {/* Icône Intervenir */}
                        <div className='relative group'>
                          <button
                            className='bg-blue-500 dark:bg-blue-600 text-white p-1 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700'
                            onClick={() => {
                              console.log(`Début de l'intervention pour le rendez-vous ${appointment.id}`)

                              acceptAppointmentById(appointment.id)
                                .then(() => console.log(`Intervention commencée pour le rendez-vous ${appointment.id}`))
                                .catch(err =>
                                  console.error(`Erreur lors du début de l'intervention ${appointment.id}:`, err)
                                )
                            }}
                          >
                            <FaTools className='w-5 h-5' />
                          </button>
                          <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs leading-none text-white bg-blue-500 rounded opacity-0 group-hover:opacity-100 z-0'>
                            Intervenir
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AppointmentTable
