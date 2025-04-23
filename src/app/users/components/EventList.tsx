'use client'
import { useState, useEffect } from 'react'

import moment from 'moment'
import { Edit, Trash2 , Eye } from 'lucide-react'
import { toast } from 'react-toastify'

import type { CalendarEvent } from '../../types/index'
import UpdateAppointmentModal from './UpdateAppointmentModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'

interface EventListProps {
  events: CalendarEvent[]
  handleEdit: (eventId: string) => void
  handleDeleteConfirmation: (eventId: string) => void
}

const EventList = ({ events, handleDeleteConfirmation }: EventListProps) => {
  const [eventsList, setEvents] = useState<CalendarEvent[]>([])
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [appointmentToUpdate, setAppointmentToUpdate] = useState<string | null>(null)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

    // Fonction pour récupérer les rendez-vous
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/all-appointments`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()

      console.log('data', data)

      // Convert string dates to Date objects
      const formattedEvents = data.map((event: any) => ({
        ...event,
        title: `Rendez-vous - ${event.vehicle?.brand} ${event.vehicle?.model}`,
        vehicleName: `${event.vehicle?.brand} ${event.vehicle?.model}`,
        vehicle: event.vehicle?.id|| '',
        start: new Date(event.date),
        end: new Date(event.date),
        service: event.service?.name || ''
      }))

      setEvents(formattedEvents)
      console.log('events after setting:', formattedEvents)
    } catch (err) {
      console.error('Error fetching appointments:', err)
    }
  }

  useEffect(() => {
    fetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle edit button click
  const handleEditClick = (eventId: string) => {
    setAppointmentToUpdate(eventId)
    setIsUpdateModalOpen(true)
  }

  // Handle update success
  const handleUpdateSuccess = () => {
    fetchAppointments() // Refresh the list after update
  }

  // Fonction pour supprimer un rendez-vous
  const handleDelete = async (eventId: string) => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/appointments/cancel/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la suppression du rendez-vous')
      }

      // Rafraîchir la liste des rendez-vous
      await fetchAppointments()
      
      // Afficher une notification de succès
      toast.success('Rendez-vous annulé avec succès')
      
    } catch (err: any) {
      console.error('Error deleting appointment:', err)
      setError(err.message || 'Une erreur est survenue lors de la suppression du rendez-vous')
      toast.error(err.message || 'Une erreur est survenue lors de l\'annulation du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour confirmer la suppression
  const confirmDelete = (eventId: string) => {
    setAppointmentToDelete(eventId)
    setIsDeleteModalOpen(true)
  }

  // Fonction pour gérer la confirmation de suppression
  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      await handleDelete(appointmentToDelete)
      setIsDeleteModalOpen(false)
      setAppointmentToDelete(null)
    }
  }

  return (
    <div className='mb-6'>
     
      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}
      {eventsList.length > 0 ? (
        <div className='space-y-4'>
          {eventsList.map(event => (
            <div key={event.id} className='bg-white p-4 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-lg font-medium'>{event.title}</h3>
                <div className='flex space-x-2'>
               
                  <button
                    onClick={() => handleEditClick(event.id)}
                    className='flex items-center justify-center bg-[#f39c12] text-white border-none rounded p-2 cursor-pointer transition-colors'
                    title='Modifier'
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(event.id)}
                    className='flex items-center justify-center bg-[#e74c3c] text-white border-none rounded p-2 cursor-pointer transition-colors'
                    title='Supprimer'
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                      onClick={() => (window.location.href = `/progress/vehicle-progress-client`)}
                      className="flex items-center justify-center bg-[#3498db] text-white border-none rounded p-2 cursor-pointer transition-colors"
                      title="Voir"
                    >
                      <Eye size={16} />
                    </button>

                </div>
              </div>
              <div className='text-sm text-gray-600'>
                <p>
                  <strong>Vehicle:</strong> {event.vehicleName}
                </p>
                <p>
                  <strong>Date:</strong> {moment.utc(event.start).format('DD/MM/YYYY')}
                </p>
                <p>
                  <strong>Heure:</strong> {moment.utc(event.start).format('HH:mm')} - {moment.utc(event.end).format('HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 italic'>Aucun rendez-vous programmé</p>
      )}

      {/* Add the UpdateAppointmentModal component */}
      <UpdateAppointmentModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        appointmentId={appointmentToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Add the DeleteConfirmationModal component */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setAppointmentToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        eventId={appointmentToDelete}
      />
    </div>
  )
}

export default EventList
