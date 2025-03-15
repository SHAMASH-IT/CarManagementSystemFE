'use client'

import { useState } from 'react'

import { FaCheckCircle, FaTimesCircle, FaParking, FaCarAlt } from 'react-icons/fa'

const initialPlaces = [
  { id: 1, bloc: 'A', place: 1, status: 'Disponible' },
  { id: 2, bloc: 'A', place: 2, status: 'Occupée' },
  { id: 3, bloc: 'B', place: 1, status: 'Disponible' },
  { id: 4, bloc: 'B', place: 2, status: 'Occupée' },
  { id: 5, bloc: 'C', place: 3, status: 'Disponible' },
  { id: 6, bloc: 'D', place: 4, status: 'Disponible' },
  { id: 7, bloc: 'E', place: 5, status: 'Occupée' }
]

export default function StationnementList() {
  const [places] = useState(initialPlaces)

  return (
    <div className='p-4 bg-gray-50 min-h-screen flex flex-col justify-start items-center'>
      {/* Alignement haut */}
      <div className='w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 mt-0 h-full'>
        {/* Conteneur plus haut */}
        <h1 className='text-4xl font-bold text-center text-blue-800 mb-4 tracking-wide'>Gestion du Stationnement 🅿️</h1>
        <div className='overflow-y-auto rounded-lg shadow-md' style={{ maxHeight: '75vh' }}>
          {/* Scrollable */}
          <table className='w-full table-auto border-collapse text-left'>
            <thead className='bg-blue-800 text-white'>
              <tr className='text-lg font-semibold uppercase'>
                <th className='px-4 py-3 border-b border-gray-200'>ID</th>
                <th className='px-4 py-3 border-b border-gray-200'>Bloc</th>
                <th className='px-4 py-3 border-b border-gray-200'>Place</th>
                <th className='px-4 py-3 border-b border-gray-200'>Statut</th>
              </tr>
            </thead>
            <tbody>
              {places.map(place => (
                <tr
                  key={place.id}
                  className={`transition duration-200 ease-in-out ${
                    place.status === 'Disponible' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <td className='px-4 py-3 font-medium border-b border-gray-300'>{place.id}</td>
                  <td className='px-4 py-3 border-b border-gray-300'>{place.bloc}</td>
                  <td className='px-4 py-3 border-b border-gray-300'>{place.place}</td>
                  <td className='px-4 py-3 border-b border-gray-300'>
                    {place.status === 'Disponible' ? (
                      <span className='flex items-center gap-2 text-green-600'>
                        <FaCheckCircle className='text-green-500' />
                        <span>Disponible</span>
                      </span>
                    ) : (
                      <span className='flex items-center gap-2 text-red-600'>
                        <FaTimesCircle className='text-red-500' />
                        <span>Occupée</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex justify-between items-center text-gray-600'>
          <p className='text-sm font-medium flex items-center gap-2'>
            <FaParking className='text-blue-800' /> Total des places :{' '}
            <span className='text-blue-800'>{places.length}</span>
          </p>
          <p className='text-sm font-medium flex items-center gap-2'>
            <FaCarAlt className='text-green-600' /> Places disponibles :{' '}
            <span className='text-green-600'>{places.filter(place => place.status === 'Disponible').length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
