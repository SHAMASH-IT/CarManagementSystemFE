'use client'
import { useState, useEffect } from 'react'

import moment from 'moment'
import { Edit, Trash2, Eye, Clock, CheckCircle2, XCircle, Car, Calendar as CalendarIcon } from 'lucide-react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2
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
      // Récupérer l'ID de l'utilisateur depuis le token
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Non authentifié')
      }

      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const userData = JSON.parse(jsonPayload)
      const userId = parseInt(userData.sub)

      // Utiliser l'endpoint correct pour récupérer les rendez-vous de l'utilisateur
      const response = await fetch(`${API_URL}/appointments/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()
      console.log('Données reçues:', data)

      // Convert string dates to Date objects and sort by date
      const formattedEvents = data
        .map((event: any) => ({
          id: event.id,
          title: `${event.vehicle.brand} ${event.vehicle.model} - ${event.vehicle.registration} - ${event.service?.name || ''}`,
          vehicleName: `${event.vehicle.brand} ${event.vehicle.model} `,
          start: new Date(event.date),
          end: new Date(event.date),
          status: event.status,
          service: event.service?.name,
          vehicle: event.vehicle,
          vehicleBrand: event.vehicle.brand,
          vehicleModel: event.vehicle.model,
          className: event.service?.name?.toLowerCase().includes('lavage') ? 'washing-event' : 'maintenance-event'
        }))
        .sort((a: CalendarEvent, b: CalendarEvent) => {
          // Trier par date décroissante (les plus récents en premier)
          return b.start.getTime() - a.start.getTime()
        })

      setEvents(formattedEvents)
      console.log('Events formatés:', formattedEvents)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Erreur lors de la récupération des rendez-vous')
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

  // Calcul des événements à afficher pour la page courante
  const indexOfLastEvent = currentPage * itemsPerPage
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage
  const currentEvents = eventsList.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(eventsList.length / itemsPerPage)

  return (
    <div className="mb-6">
      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}
      {eventsList.length > 0 ? (
        <>
          <div className="relative flex flex-col md:flex-row md:space-x-8">
            {/* Timeline verticale */}
            <div className="hidden md:block absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-gray-200 to-gray-200 rounded-full z-0" />
            <div className="flex-1 flex flex-col space-y-8 w-full">
              {currentEvents.map((event, idx) => (
                <div key={event.id} className="relative flex items-start group">
                  {/* Dot timeline animé */}
                  <div className="z-10 flex flex-col items-center mr-6">
                    <span className="w-4 h-4 rounded-full border-4 border-white shadow-lg bg-blue-400 animate-pulse group-hover:scale-110 transition-transform" />
                    {idx !== eventsList.length - 1 && (
                      <span className="flex-1 w-1 bg-gradient-to-b from-blue-200 via-gray-200 to-gray-200" />
                    )}
                  </div>
                  {/* Carte événement */}
                  <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow relative">
                    <div className="flex flex-wrap items-center mb-2 gap-2 justify-between">
                      <h3 className="text-lg font-semibold flex-1">{event.title}</h3>
                      {/* Boutons d'action à droite du titre */}
                      <div className="flex gap-2 ml-2">
                        {event.status === 'CANCELLED' || event.status === 'COMPLETED' ? (
                          <>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Edit size={18} />
                            </span>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Trash2 size={18} />
                            </span>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Eye size={18} />
                            </span>
                          </>
                        ) : event.status === 'IN_PROGRESS' ? (
                          <>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Edit size={18} />
                            </span>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Trash2 size={18} />
                            </span>
                            <button
                              onClick={() => (window.location.href = `/progress/vehicle-progress-client`)}
                              className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              title="Voir"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        ) : event.status === 'RESERVED' ? (
                          <>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Edit size={18} />
                            </span>
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-300"
                              title="Supprimer"
                              disabled={isLoading}
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => (window.location.href = `/progress/vehicle-progress-client`)}
                              className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              title="Voir"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        ) : event.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleEditClick(event.id)}
                              className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full p-3 shadow transition-transform hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-300"
                              title="Supprimer"
                              disabled={isLoading}
                            >
                              <Trash2 size={18} />
                            </button>
                            <span title="Action non disponible" className="flex items-center justify-center rounded-full p-3 text-gray-400 cursor-not-allowed">
                              <Eye size={18} />
                            </span>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(event.id)}
                              className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full p-3 shadow transition-transform hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(event.id)}
                              className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-300"
                              title="Supprimer"
                              disabled={isLoading}
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => (window.location.href = `/progress/vehicle-progress-client`)}
                              className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white rounded-full p-3 shadow transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              title="Voir"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Car className="w-4 h-4" /> {event.vehicleName}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> {moment(event.start).format('DD/MM/YYYY')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {moment(event.start).format('HH:mm')}
                      </span>
                    </div>
                    {/* Statut et service sous les infos du rendez-vous */}
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ring-2 ring-offset-2 ring-opacity-40 animate-fade-in ${
                        event.status === 'RESERVED'
                          ? 'bg-blue-100 text-blue-800 ring-blue-200'
                        : event.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 ring-amber-200'
                        : event.status === 'IN_PROGRESS'
                          ? 'bg-orange-100 text-orange-800 ring-orange-200'
                        : event.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 ring-green-200'
                        : event.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800 ring-red-200'
                          : 'bg-gray-100 text-gray-800 ring-gray-200'
                      }`}>
                        {event.status === 'RESERVED' ? (
                          <><Clock className="w-3 h-3 mr-1 text-blue-600" />Réservé</>
                        ) : event.status === 'PENDING' ? (
                          <><Clock className="w-3 h-3 mr-1 text-amber-600" />En attente</>
                        ) : event.status === 'IN_PROGRESS' ? (
                          <><Clock className="w-3 h-3 mr-1 text-orange-600" />En cours</>
                        ) : event.status === 'COMPLETED' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />Terminé</>
                        ) : event.status === 'CANCELLED' ? (
                          <><XCircle className="w-3 h-3 mr-1 text-red-600" />Annulé</>
                        ) : (
                          event.status
                        )}
                      </span>
                      {event.service && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">{event.service}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                Précédent
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      ) : (
        <p className='text-gray-500 italic'>Aucun rendez-vous programmé</p>
      )}
      
      {/* Modals */}
      <UpdateAppointmentModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        appointmentId={appointmentToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
      />
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
