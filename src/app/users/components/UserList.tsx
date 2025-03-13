'use client'

import type React from 'react'
import { useState, useEffect } from 'react'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Modal from 'react-modal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Define the View type properly
export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

// Define event type for better type safety
export interface CalendarEvent {
  service: string
  start: Date
  end: Date
}

// Define appointment details type
export interface AppointmentDetails {
  vehicle: string
  service: string
  date: string
  time: string
  additionalInfo: string
}

interface CalendarViewProps {
  initialEvents?: CalendarEvent[]
}

const CalendarView: React.FC<CalendarViewProps> = ({ initialEvents = [] }) => {
  const localizer = momentLocalizer(moment)

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialEvents)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [, setSelectedDate] = useState<Date | null>(null)

  // Add state for current date and view
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<CalendarView>('month')

  // Set the app element for react-modal
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    vehicle: '',
    service: '',
    date: '',
    time: '',
    additionalInfo: ''
  })

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start)

    // Correction du problème de date
    // Utiliser une méthode qui préserve le jour correct sans décalage de timezone
    const year = start.getFullYear()
    const month = String(start.getMonth() + 1).padStart(2, '0')
    const day = String(start.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    setAppointmentDetails(prevState => ({
      ...prevState,
      date: formattedDate
    }))
    setModalIsOpen(true)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    setCalendarEvents([
      ...calendarEvents,
      {
        service: `${vehicle} - ${service} : ${additionalInfo}`,
        start,
        end
      }
    ])
    setModalIsOpen(false)
  }

  // Handle year navigation
  const handlePreviousYear = () => {
    const newDate = new Date(currentDate)

    newDate.setFullYear(currentDate.getFullYear() - 1)
    setCurrentDate(newDate)
  }

  const handleNextYear = () => {
    const newDate = new Date(currentDate)

    newDate.setFullYear(currentDate.getFullYear() + 1)
    setCurrentDate(newDate)
  }

  // Handle view change
  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view)
  }

  return (
    <div
      className='calendar-container'
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        color: '#343a40'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#2c3e50',
          color: 'white',
          borderRadius: '8px 8px 0 0',
          margin: '20px 20px 0 20px'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>Mon calendrier</h1>

        {/* Navigation controls - Year only */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            padding: '8px 15px'
          }}
        >
          <button
            onClick={handlePreviousYear}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'white' }}>
            {moment(currentDate).format('YYYY')}
          </span>

          <button
            onClick={handleNextYear}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        style={{
          margin: '0 20px 20px 20px',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          flex: 1,
          padding: '20px'
        }}
      >
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor='start'
          endAccessor='end'
          defaultView='month'
          view={currentView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={(date: React.SetStateAction<Date>) => setCurrentDate(date)}
          views={['month', 'week', 'day']}
          style={{ height: 'calc(100vh - 280px)' }}
          selectable
          onSelectSlot={handleSelectSlot}
          className='vehicle-calendar'
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(44, 62, 80, 0.75)',
            zIndex: 1000
          },
          content: {
            position: 'fixed',
            top: '0',
            left: 'auto',
            right: '0',
            bottom: '0',
            transform: 'none',
            width: '400px',
            height: '100vh',
            overflow: 'auto',
            padding: '25px',
            backgroundColor: 'white',
            color: '#333',
            boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.2)',
            border: 'none',
            borderRadius: '0',
            zIndex: 1001
          }
        }}
        contentLabel='Réserver un rendez-vous'
        className='modal-right'
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '2px solid #3498db',
            paddingBottom: '15px'
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #3498db, #2c3e50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            <i className='fas fa-calendar-alt' style={{ marginRight: '10px', color: '#3498db' }}></i>
            Réserver un rendez-vous
          </h2>
          <button
            onClick={() => setModalIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 5px',
              color: 'black',
              transition: 'color 0.3s'
            }}
          >
            ×
          </button>
        </div>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
              Véhicule
            </label>
            <select
              name='vehicle'
              value={appointmentDetails.vehicle}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value=''>Sélectionner un véhicule</option>
              <option value='Toyota'>Toyota</option>
              <option value='Honda'>Honda</option>
              <option value='Ford'>Ford</option>
              <option value='BMW'>BMW</option>
              <option value='Mercedes'>Mercedes</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
              Service
            </label>
            <select
              name='service'
              value={appointmentDetails.service}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value=''>Sélectionner un service</option>
              <option value='Oil Change'>Changement dhuile</option>
              <option value='Tire Rotation'>Rotation des pneus</option>
              <option value='Brake Inspection'>Inspection des freins</option>
              <option value='Battery Check'>Vérification de la batterie</option>
              <option value='Full Service'>Service complet</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Date</label>
            <input
              type='date'
              name='date'
              value={appointmentDetails.date}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Heure</label>
            <input
              type='time'
              name='time'
              value={appointmentDetails.time}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
              Infos complémentaires (facultatif)
            </label>
            <input
              type='text'
              name='additionalInfo'
              value={appointmentDetails.additionalInfo}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              placeholder='Détails supplémentaires'
            />
          </div>
          <button
            type='button'
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#2980b9'
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#3498db'
            }}
          >
            Réserver
          </button>
        </form>
      </Modal>

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

export default CalendarView
