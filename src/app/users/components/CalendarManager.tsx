'use client'

import type React from 'react'
import { useState } from 'react'

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

const CalendarManager = ({ initialEvents = [] }: CalendarViewProps) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialEvents)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEventId, setCurrentEventId] = useState<string | null>(null)
  const [, setSelectedDate] = useState<Date | null>(null)

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
    time: '',
    additionalInfo: ''
  }

  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>(initialAppointmentDetails)

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

  const handleSubmit = () => {
    const { vehicle, service, date, time, additionalInfo } = appointmentDetails
    const start = new Date(date + 'T' + time)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    if (isEditMode && currentEventId) {
      // Update existing event
      setCalendarEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === currentEventId
            ? {
                ...event,
                title: `${vehicle} - ${service}${additionalInfo ? ` : ${additionalInfo}` : ''}`,
                start,
                end,
                vehicle,
                service,
                additionalInfo
              }
            : event
        )
      )
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: `${vehicle} - ${service}${additionalInfo ? ` : ${additionalInfo}` : ''}`,
        start,
        end,
        vehicle,
        service,
        additionalInfo
      }

      setCalendarEvents(prevEvents => [...prevEvents, newEvent])
    }

    setModalIsOpen(false)
    setAppointmentDetails(initialAppointmentDetails)
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
        time: formattedTime,
        additionalInfo: eventToEdit.additionalInfo || ''
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

  const handleDelete = () => {
    if (eventToDelete) {
      setCalendarEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete))
      setDeleteModalIsOpen(false)
      setEventToDelete(null)
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
          background-color: #e8f4fd;
        }

        .vehicle-calendar .rbc-event {
          background-color: #3498db;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }

        .vehicle-calendar .rbc-toolbar {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}

export default CalendarManager
