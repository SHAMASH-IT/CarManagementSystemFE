'use client'
import React from 'react'

import { FaCheckCircle, FaTrashAlt } from 'react-icons/fa'

import type { AppointmentTableProps } from '../../types/index'

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onDelete, onAccept }) => {
  return (
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='block md:table-row-group'>
            {appointments.map(appointment => (
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
                  {new Date(appointment.date).toLocaleString()}
                </td>
                <td
                  className={`p-3 md:border md:border-gray-300 text-left block md:table-cell ${appointment.status === 'Accepté' ? 'text-green-600 dark:text-green-400' : appointment.status === 'Annulé' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                >
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${appointment.status === 'Accepté' ? 'bg-green-200 text-green-800' : appointment.status === 'Annulé' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className='p-3 md:border md:border-gray-300 text-left block md:table-cell'>
                  <div className='flex space-x-2'>
                    {appointment.status !== 'Accepté' && (
                      <div className='relative group'>
                        <button
                          className='bg-green-500 dark:bg-green-600 text-white p-1 rounded-full hover:bg-green-600 dark:hover:bg-green-700'
                          onClick={() => onAccept(appointment.id)}
                        >
                          <FaCheckCircle className='w-5 h-5' />
                        </button>
                        <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs leading-none text-white bg-green-500 rounded opacity-0 group-hover:opacity-100 z-0'>
                          Accepter
                        </span>
                      </div>
                    )}
                    <div className='relative group'>
                      <button
                        className='bg-red-500 dark:bg-red-600 text-white p-1 rounded-full hover:bg-red-600 dark:hover:bg-red-700'
                        onClick={() => onDelete(appointment.id)}
                      >
                        <FaTrashAlt className='w-5 h-5' />
                      </button>
                      <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs leading-none text-white bg-red-500 rounded opacity-0 group-hover:opacity-100 z-0'>
                        Rejeter
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppointmentTable
