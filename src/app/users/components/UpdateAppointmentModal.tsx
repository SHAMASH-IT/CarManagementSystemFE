'use client'

import { useState, useEffect } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'

import type { CalendarEvent } from '../../types/index'

interface UpdateAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string | null
  onUpdateSuccess: () => void
}

const UpdateAppointmentModal = ({
  isOpen,
  onClose,
  appointmentId,
  onUpdateSuccess
}: UpdateAppointmentModalProps) => {
  const [appointment, setAppointment] = useState<CalendarEvent | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [currentLocationId, setCurrentLocationId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchAppointmentDetails(appointmentId)
    }
  }, [isOpen, appointmentId])

  const fetchAppointmentDetails = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/appointments/all-appointments`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du rendez-vous')
      }

      const data = await response.json()
      const appointmentData = data.find((appointment: any) => appointment.id === parseInt(id))

      if (!appointmentData) {
        throw new Error('Rendez-vous non trouvé')
      }

      setAppointment(appointmentData)

      if (appointmentData.vehicle?.positions?.[0]?.location?.id) {
        setCurrentLocationId(appointmentData.vehicle.positions[0].location.id)
      }

      const appointmentDate = moment(appointmentData.date)
      setDate(appointmentDate.format('YYYY-MM-DD'))
      setTime(appointmentDate.format('HH:mm'))
    } catch (err) {
      console.error('Error fetching appointment details:', err)
      setError('Impossible de récupérer les détails du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Création de la date locale au format ISO sans "Z"
      const dateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss')

      const response = await fetch(`${API_URL}/appointments/update/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: dateTime }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la mise à jour du rendez-vous')
      }

      toast.success('Rendez-vous modifié avec succès')
      onUpdateSuccess()
      onClose()
    } catch (err: any) {
      console.error('Full error:', err)
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du rendez-vous')
      toast.error(err.message || 'Une erreur est survenue lors de la mise à jour du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4'>Modifier le rendez-vous</h2>

        {isLoading && !appointment ? (
          <div className='flex justify-center py-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        ) : error && !appointment ? (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

            <div className='mb-4'>
              <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-1'>
                Date
              </label>
              <input
                type='date'
                id='date'
                value={date}
                onChange={e => setDate(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                required
              />
            </div>

            <div className='mb-6'>
              <label htmlFor='time' className='block text-sm font-medium text-gray-700 mb-1'>
                Heure
              </label>
              <input
                type='time'
                id='time'
                value={time}
                onChange={e => setTime(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                required
              />
            </div>

            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Annuler
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-[#f39c12] text-white rounded-md hover:bg-[#e67e22]'
                disabled={isLoading}
              >
                {isLoading ? 'Modification...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default UpdateAppointmentModal
