'use client'

import type React from 'react'
import { useState, useEffect } from 'react'

import type {
  CalendarEvent,
  CalendarView as CalendarViewType,
  AppointmentDetails,
  CalendarViewProps
} from '../../types/index'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import AppointmentListClient from './AppointmentListClient'
import AppointmentModal from './AppointmentModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { useAuth } from '../../login/hooks/useAuth'
import { authService } from '../../login/services/auth.service'

const CalendarManager = ({ initialEvents = [] }: CalendarViewProps) => {
  const { user: token } = useAuth()
  const [userId, setUserId] = useState<number | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialEvents)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  const [, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  // Add state for current date and view
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<CalendarViewType>('month')
  const [isListView, setIsListView] = useState(false)

  // Add state for delete confirmation modal
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Initial state for appointment details
  const initialAppointmentDetails = {
    vehicle: '',
    service: '',
    date: '',
    time: ''
  }

  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>(initialAppointmentDetails)

  // Function to decode JWT token and get user ID
  const decodeToken = (token: string) => {
    try {
      if (!token) return null
      console.log('Decoding token:', token)
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const userData = JSON.parse(jsonPayload)
      console.log('Decoded user data:', userData)
      return userData.sub // JWT standard uses 'sub' for user ID
    } catch (err) {
      console.error('Error decoding token:', err)
      return null
    }
  }

  // Effect to set user ID when token changes
  useEffect(() => {
    const storedToken = authService.getCurrentToken()
    console.log('Stored token:', storedToken)
    if (storedToken) {
      const id = decodeToken(storedToken)
      console.log('Decoded user ID:', id)
      setUserId(id)
    }
  }, [])

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching appointments for user ID:', userId)

      if (!userId) {
        console.log('No user ID available, cannot fetch appointments')
        return
      }

      const response = await fetch(`${API_URL}/appointments/user/${userId}`)
      console.log('API Response status:', response.status)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()
      console.log('Raw appointments data from API:', data)

      // Convert appointments to calendar events
      const formattedEvents = data.map((event: any) => {
        const isWashing = event.service?.name?.toLowerCase().includes('lavage') || 
                         event.service?.name?.toLowerCase().includes('washing');
        return {
          id: event.id.toString(),
          title: `${event.vehicle?.brand} ${event.vehicle?.model} - ${event.service?.name}`,
          vehicleName: `${event.vehicle?.brand} ${event.vehicle?.model}`,
          vehicle: event.vehicle?.id || '',
          start: new Date(event.date),
          end: new Date(event.date),
          service: event.service?.name || '',
          className: isWashing ? 'washing-event' : 'maintenance-event'
        };
      });

      console.log('Formatted events:', formattedEvents)
      setCalendarEvents(formattedEvents)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Impossible de récupérer les rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch appointments when user ID or date changes
  useEffect(() => {
    console.log('useEffect triggered - userId:', userId)
    if (userId) {
      console.log('User ID available, fetching appointments')
      fetchAppointments()
    } else {
      console.log('No user ID available yet')
    }
  }, [currentDate, userId])

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setIsEditMode(false)
    setCurrentEventId(null)
    setSelectedDate(start)

    // Format date correctly
    const year = start.getFullYear()
    const month = String(start.getMonth() + 1).padStart(2, '0')
    const day = String(start.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    setAppointmentDetails({
      ...initialAppointmentDetails,
      date: formattedDate
    })

    setModalIsOpen(true)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target

    setAppointmentDetails(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const { vehicle, service, date, time } = appointmentDetails
      const start = new Date(date + 'T' + time)
      const end = new Date(start.getTime() + 60 * 60 * 1000)

      if (isEditMode && currentEventId) {
        // Update existing appointment
        const response = await fetch(`${API_URL}/appointments/${currentEventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: start.toISOString(),
            time: time,
            status: 'PENDING'
          }),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du rendez-vous')
        }
      } else {
        // Create new appointment
        const response = await fetch(`${API_URL}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleId: parseInt(vehicle),
            serviceId: parseInt(service),
            date: start.toISOString(),
            time: time,
            status: 'PENDING'
          }),
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la création du rendez-vous')
        }
      }

      // Refresh appointments after successful operation
      await fetchAppointments()
      setModalIsOpen(false)
      setAppointmentDetails(initialAppointmentDetails)
    } catch (err) {
      console.error('Error handling appointment:', err)
      setError('Une erreur est survenue lors du traitement du rendez-vous')
    }
  }

  // Handle edit appointment
  const handleEdit = (eventId: string) => {
    const eventToEdit = calendarEvents.find(event => event.id === eventId)

    if (eventToEdit) {
      const startDate = eventToEdit.start
      const year = startDate.getFullYear()
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`

      const hours = String(startDate.getHours()).padStart(2, '0')
      const minutes = String(startDate.getMinutes()).padStart(2, '0')
      const formattedTime = `${hours}:${minutes}`

      setAppointmentDetails({
        vehicle: eventToEdit.vehicle || '',
        service: eventToEdit.service || '',
        date: formattedDate,
        time: formattedTime
      })

      setIsEditMode(true)
      setCurrentEventId(eventId)
      setModalIsOpen(true)
    }
  }

  // Handle delete appointment
  const handleDeleteConfirmation = (eventId: string) => {
    setEventToDelete(eventId)
    setDeleteModalIsOpen(true)
  }

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        const response = await fetch(`${API_URL}/appointments/${eventToDelete}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du rendez-vous')
        }

        await fetchAppointments()
        setDeleteModalIsOpen(false)
        setEventToDelete(null)
      } catch (err) {
        console.error('Error deleting appointment:', err)
        setError('Impossible de supprimer le rendez-vous')
      }
    }
  }

  // Handle view change
  const handleViewChange = (view: CalendarViewType) => {
    setCurrentView(view)
    setIsListView(view === 'list')
  }

  // Toggle to list view
  const toggleListView = () => {
    setIsListView(true)
    setCurrentView('list')
  }

  // Toggle to calendar view
  const toggleCalendarView = () => {
    setIsListView(false)
    setCurrentView('month')
  }

  return (
    <div className='flex flex-1 flex-col bg-[#f8f9fa] text-[#343a40]'>
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        isListView={isListView}
        toggleListView={toggleListView}
        toggleCalendarView={toggleCalendarView}
      />

      <div className='mx-5 mb-5 bg-white rounded-b-lg shadow-md flex-1 p-5'>
        {isListView ? (
          <AppointmentListClient
            appointments={calendarEvents}
            handleEdit={handleEdit}
            handleDeleteConfirmation={handleDeleteConfirmation}
          />
        ) : (
          <CalendarGrid
            calendarEvents={calendarEvents}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            currentView={currentView}
            handleViewChange={handleViewChange}
            handleSelectSlot={handleSelectSlot}
          />
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        isEditMode={isEditMode}
        appointmentDetails={appointmentDetails}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        onConfirm={handleDelete}
        eventId={null}
      />

      <style jsx global>{`
        /* Custom styles for the calendar */
        .vehicle-calendar .rbc-header {
          background-color: #2c3e50;
          color: white;
          padding: 10px;
          font-weight: bold;
        }

        .vehicle-calendar .rbc-month-view {
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .vehicle-calendar .rbc-day-bg {
          transition: background-color 0.2s;
        }

        .vehicle-calendar .rbc-day-bg:hover {
          background-color: #f8f9fa;
        }

        .vehicle-calendar .rbc-today {
          background-color: #f1f5f9;
        }

        /* Style pour les événements de lavage */
        .vehicle-calendar .rbc-event.washing-event {
          background-color: #60a5fa !important; /* Bleu */
          color: #1565c0 !important; /* Texte en bleu */
          border: none !important;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .vehicle-calendar .rbc-event.washing-event:hover {
          background-color: #3b82f6 !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        /* Style pour les événements d'entretien */
        .vehicle-calendar .rbc-event.maintenance-event {
          background-color: #f97316 !important; /* Orange */
          color: #1565c0 !important; /* Texte en bleu */
          border: none !important;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .vehicle-calendar .rbc-event.maintenance-event:hover {
          background-color: #ea580c !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        /* Style par défaut pour les événements */
        .vehicle-calendar .rbc-event {
          background-color: #64748b !important;
          color: #1565c0 !important; /* Texte en bleu */
          border: none !important;
          font-weight: 500;
        }

        .vehicle-calendar .rbc-toolbar button {
          background-color: #f8f9fa;
          color: #2c3e50;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 7px 12px;
          font-weight: bold;
        }

        .vehicle-calendar .rbc-toolbar button.rbc-active {
          background-color: #2c3e50;
          color: white;
          border-color: #2c3e50;
        }

        .vehicle-calendar .rbc-toolbar {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}

export default CalendarManager
