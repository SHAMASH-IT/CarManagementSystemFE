'use client'

import { useState, useEffect } from 'react'

import EventList from './EventList'
import AppointmentModal from './AppointmentModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import type { CalendarEvent, AppointmentDetails } from '../../types/index'

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
  const [, setCurrentAppointment] = useState<Partial<CalendarEvent> | null>(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
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
  }, [appointments])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/appointments')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()

      // Convert string dates to Date objects
      const formattedEvents = data.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
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

    const appointmentToEdit = events.find(event => event.id === eventId)

    if (appointmentToEdit) {
      // Convertir CalendarEvent en AppointmentDetails
      const startDate = appointmentToEdit.start

      setAppointmentDetails({
        vehicle: appointmentToEdit.title || '',
        service: appointmentToEdit.service || '',
        date: startDate.toISOString().split('T')[0],
        time: startDate.toTimeString().slice(0, 5),
        additionalInfo: appointmentToEdit.additionalInfo || ''
      })

      setCurrentAppointment(appointmentToEdit)
      setIsEditing(true)
      setIsAppointmentModalOpen(true)
    }
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
      const response = await fetch(`/api/appointments/${appointmentToDelete}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du rendez-vous')
      }

      // Refresh the appointments list
      await fetchAppointments()

      // Close the modal and reset state
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
          />
        </>
      )}
    </div>
  )
}

export default AppointmentListClient
