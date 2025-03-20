'use client'

import { useState, useEffect } from 'react'

import EventList from './EventList'
import AppointmentModal from './AppointmentModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import type { CalendarEvent, AppointmentDetails } from '../../types/index'

// Ajout du composant UpdateAppointmentModal
const UpdateAppointmentModal = ({
  isOpen,
  onClose,
  appointmentId,
  onUpdateSuccess
}: {
  isOpen: boolean
  onClose: () => void
  appointmentId: string | null
  onUpdateSuccess: () => void
}) => {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchAppointmentDetails(appointmentId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appointmentId])

  const fetchAppointmentDetails = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/appointments/${id}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du rendez-vous')
      }

      const data = await response.json()

      // Format the date and time
      const appointmentDate = new Date(data.date || data.start)

      setDate(appointmentDate.toISOString().split('T')[0])
      setTime(appointmentDate.toTimeString().slice(0, 5))
    } catch (err) {
      console.error('Error fetching appointment details:', err)
      setError('Impossible de récupérer les détails du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/appointments/update/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date,
          time
        })
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Erreur lors de la mise à jour du rendez-vous')
      }

      onUpdateSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error updating appointment:', err)
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4'>Modifier le rendez-vous</h2>

        {isLoading && !date ? (
          <div className='flex justify-center py-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        ) : error && !date ? (
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

type AppointmentListClientProps = {
  appointments?: CalendarEvent[]
  handleEdit?: (eventId: string) => void
  handleDeleteConfirmation?: (eventId: string) => void
}

const AppointmentListClient = ({
  appointments,
  handleEdit: externalHandleEdit,
  handleDeleteConfirmation: externalHandleDeleteConfirmation
}: AppointmentListClientProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>(appointments || [])
  const [isLoading, setIsLoading] = useState(!appointments)
  const [error, setError] = useState('')

  // Modal states
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [] = useState<Partial<CalendarEvent> | null>(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)
  const [isEditing] = useState(false)

  // État pour le modal de mise à jour
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [appointmentToUpdate, setAppointmentToUpdate] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  // État pour les détails du rendez-vous conforme au type AppointmentDetails
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    vehicle: '',
    service: '',
    date: '',
    time: '',
    additionalInfo: ''
  })

  // Fetch appointments from backend only if no appointments were provided via props
  useEffect(() => {
    if (!appointments) {
      fetchAppointments()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Modifier pour utiliser le nouveau point d'API
      const response = await fetch(`${API_URL}/appointments/all-appointments`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()

      // Convert string dates to Date objects
      const formattedEvents = data.map((event: any) => ({
        ...event,
        vehicleName: event.vehicle.model,
        start: new Date(event.date),
        end: new Date(event.date),
        title: event.vehicle.model // Pour la compatibilité avec le composant EventList
      }))

      setEvents(formattedEvents)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Impossible de charger les rendez-vous. Veuillez réessayer plus tard.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle opening appointment modal for editing
  const internalHandleEdit = (eventId: string) => {
    if (externalHandleEdit) {
      externalHandleEdit(eventId)

      return
    }

    // Ouvrir le modal de mise à jour au lieu du modal d'édition standard
    setAppointmentToUpdate(eventId)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateSuccess = () => {
    fetchAppointments()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target

    setAppointmentDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveAppointment = async () => {
    try {
      const appointmentData = {
        date: appointmentDetails.date,
        time: appointmentDetails.time,
        vehicleId: parseInt(appointmentDetails.vehicle),
        serviceId: parseInt(appointmentDetails.service)
      }

      // Appeler l'API
      const response = await fetch(`${API_URL}/appointments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout du rendez-vous`)
      }

      // Actualiser la liste des rendez-vous
      await fetchAppointments()

      // Fermer le modal
      setIsAppointmentModalOpen(false)
    } catch (err) {
      console.error('Error saving appointment:', err)
      setError("Une erreur est survenue lors de l'enregistrement du rendez-vous.")
    }
  }

  // Handle opening delete confirmation modal
  const internalHandleDeleteConfirmation = (eventId: string) => {
    if (externalHandleDeleteConfirmation) {
      externalHandleDeleteConfirmation(eventId)

      return
    }

    setAppointmentToDelete(eventId)
    setIsDeleteModalOpen(true)
  }

  // Handle deleting appointment
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return

    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du rendez-vous')
      }

      // Refresh the appointments list
      await fetchAppointments()

      setIsDeleteModalOpen(false)
      setAppointmentToDelete(null)
    } catch (err) {
      console.error('Error deleting appointment:', err)
      setError('Impossible de supprimer le rendez-vous. Veuillez réessayer plus tard.')
    }
  }

  return (
    <div className='container mx-auto py-6 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Gestion des Rendez-vous</h1>
      </div>

      {error && <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

      {isLoading ? (
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <EventList
          events={events}
          handleEdit={internalHandleEdit}
          handleDeleteConfirmation={internalHandleDeleteConfirmation}
        />
      )}

      {/* Only render these modals if we're handling these actions internally */}
      {!externalHandleEdit && !externalHandleDeleteConfirmation && (
        <>
          {/* Appointment Modal */}
          <AppointmentModal
            isOpen={isAppointmentModalOpen}
            onClose={() => setIsAppointmentModalOpen(false)}
            isEditMode={isEditing}
            appointmentDetails={appointmentDetails}
            handleInputChange={handleInputChange}
            handleSubmit={handleSaveAppointment}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAppointment}
            eventId={null}
          />

          {/* Update Appointment Modal */}
          <UpdateAppointmentModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            appointmentId={appointmentToUpdate}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </>
      )}
    </div>
  )
}

export default AppointmentListClient
