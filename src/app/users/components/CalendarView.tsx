'use client'

import type React from 'react'

import { useState, useEffect } from 'react'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Modal from 'react-modal'
import { ChevronLeft, ChevronRight, List, CalendarIcon, Edit, Trash2, Home } from 'lucide-react'

import type {
  CalendarEvent,
  CalendarView as CalendarViewType,
  AppointmentDetails,
  CalendarViewProps
} from '../../types/index'

moment.locale('fr')

const CalendarView = ({ initialEvents = [] }: CalendarViewProps) => {
  const localizer = momentLocalizer(moment)
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

  // Set the app element for react-modal
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

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

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate)

    newDate.setMonth(currentDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentDate)

    newDate.setMonth(currentDate.getMonth() + 1)
    setCurrentDate(newDate)
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

  // Handle today navigation
  const handleToday = () => {
    setCurrentDate(new Date())
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

  // Sort events by date for the list view
  const sortedEvents = [...calendarEvents].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <div className='flex flex-1 flex-col bg-[#f8f9fa] text-[#343a40]'>
      <div className='flex justify-between items-center p-5 bg-[#2c3e50] text-white rounded-t-lg mx-5 mt-5'>
        <h1 className='m-0 text-2xl'>Mon calendrier</h1>
        {/* Month navigation buttons */}
        <button
          onClick={handlePreviousMonth}
          className='bg-transparent border-none cursor-pointer text-white flex items-center justify-center mr-1'
          title='Mois précédent'
        >
          <ChevronLeft size={20} />
        </button>

        <span className='font-bold mr-2.5 text-white'>{moment(currentDate).format('MMMM')}</span>

        <button
          onClick={handleNextMonth}
          className='bg-transparent border-none cursor-pointer text-white flex items-center justify-center mr-4'
          title='Mois suivant'
        >
          <ChevronRight size={20} />
        </button>

        {/* Year navigation buttons */}
        <button
          onClick={handlePreviousYear}
          className='bg-transparent border-none cursor-pointer text-white flex items-center justify-center mr-1'
          title='Année précédente'
        >
          <ChevronLeft size={20} />
        </button>

        <span className='font-bold mr-1 text-white'>{moment(currentDate).format('YYYY')}</span>

        <button
          onClick={handleNextYear}
          className='bg-transparent border-none cursor-pointer text-white flex items-center justify-center mr-4'
          title='Année suivante'
        >
          <ChevronRight size={20} />
        </button>

        <div className='flex items-center'>
          {/* View toggle buttons */}
          <div className='flex mr-5 bg-[#1a2733] rounded overflow-hidden'>
            <button
              onClick={toggleCalendarView}
              className={`border-none cursor-pointer text-white flex items-center px-3 py-2 transition-colors ${
                isListView ? 'bg-transparent' : 'bg-[#3498db]'
              }`}
            >
              <CalendarIcon size={18} className='mr-1' />
              Mois
            </button>
            <button
              onClick={toggleListView}
              className={`border-none cursor-pointer text-white flex items-center px-3 py-2 transition-colors ${
                isListView ? 'bg-[#3498db]' : 'bg-transparent'
              }`}
            >
              <List size={18} className='mr-1' />
              Liste
            </button>
          </div>

          {/* Today button */}
          <div className='flex items-center rounded px-4 py-2'>
            <button
              onClick={handleToday}
              className='bg-[#3498db] border-none rounded cursor-pointer text-white flex items-center px-3 py-1.5 transition-colors'
              title="Aujourd'hui"
            >
              <Home size={18} className='mr-1' />
              Aujourd&apos;hui
            </button>
          </div>
        </div>
      </div>

      <div className='mx-5 mb-5 bg-white rounded-b-lg shadow-md flex-1 p-5'>
        {isListView ? (
          <div className='p-4'>
            <h2 className='text-[#2c3e50] mb-5 border-b-2 border-[#3498db] pb-2.5'>Liste des rendez-vous</h2>
            {sortedEvents.length > 0 ? (
              <div>
                {sortedEvents.map(event => (
                  <div key={event.id} className='mb-4 p-4 bg-[#f8f9fa] border-l-4 border-[#3498db] rounded shadow-sm'>
                    <div className='flex justify-between items-center'>
                      <div className='font-bold text-lg mb-2 text-[#2c3e50]'>{event.title}</div>
                      <div className='flex gap-2.5'>
                        <button
                          onClick={() => handleEdit(event.id)}
                          className='flex items-center justify-center bg-[#f39c12] text-white border-none rounded p-2 cursor-pointer transition-colors'
                          title='Modifier'
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(event.id)}
                          className='flex items-center justify-center bg-[#e74c3c] text-white border-none rounded p-2 cursor-pointer transition-colors'
                          title='Supprimer'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className='flex justify-between text-[#7f8c8d]'>
                      <span>
                        <strong>Date:</strong> {moment(event.start).format('DD/MM/YYYY')}
                      </span>
                      <span>
                        <strong>Heure:</strong> {moment(event.start).format('HH:mm')} -{' '}
                        {moment(event.end).format('HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center p-8 text-[#7f8c8d]'>Aucun rendez-vous programmé</div>
            )}
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor='start'
            endAccessor='end'
            defaultView='month'
            view={currentView === 'list' ? 'month' : currentView}
            onView={(view: any) => handleViewChange(view as CalendarViewType)}
            date={currentDate}
            onNavigate={(date: Date) => setCurrentDate(date)}
            views={['month']}
            style={{ height: 'calc(100vh - 280px)' }}
            selectable
            onSelectSlot={handleSelectSlot}
            className='vehicle-calendar'
          />
        )}
      </div>

      {/* Appointment Modal */}
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
        <div className='flex justify-between items-center mb-5 border-b-2 border-[#3498db] pb-4'>
          <h2 className='m-0 text-[#2c3e50] flex items-center text-2xl font-bold bg-gradient-to-r from-[#3498db] to-[#2c3e50] bg-clip-text text-transparent'>
            {isEditMode ? 'Modifier le rendez-vous' : 'Réserver un rendez-vous'}
          </h2>
          <button
            onClick={() => setModalIsOpen(false)}
            className='bg-none border-none text-2xl cursor-pointer p-0 px-1 text-black transition-colors'
          >
            ×
          </button>
        </div>
        <form>
          <div className='mb-4'>
            <label className='block mb-1 font-bold text-[#2c3e50]'>Véhicule</label>
            <select
              name='vehicle'
              value={appointmentDetails.vehicle}
              onChange={handleInputChange}
              className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
            >
              <option value=''>Sélectionner un véhicule</option>
              <option value='Toyota'>Toyota</option>
              <option value='Honda'>Honda</option>
              <option value='Ford'>Ford</option>
              <option value='BMW'>BMW</option>
              <option value='Mercedes'>Mercedes</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block mb-1 font-bold text-[#2c3e50]'>Service</label>
            <select
              name='service'
              value={appointmentDetails.service}
              onChange={handleInputChange}
              className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
            >
              <option value=''>Sélectionner un service</option>
              <option value='Oil Change'>Changement d&apos;huile</option>
              <option value='Tire Rotation'>Rotation des pneus</option>
              <option value='Brake Inspection'>Inspection des freins</option>
              <option value='Battery Check'>Vérification de la batterie</option>
              <option value='Full Service'>Service complet</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block mb-1 font-bold text-[#2c3e50]'>Date</label>
            <input
              type='date'
              name='date'
              value={appointmentDetails.date}
              onChange={handleInputChange}
              className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-1 font-bold text-[#2c3e50]'>Heure</label>
            <input
              type='time'
              name='time'
              value={appointmentDetails.time}
              onChange={handleInputChange}
              className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
            />
          </div>
          <div className='mb-6'>
            <label className='block mb-1 font-bold text-[#2c3e50]'>Infos complémentaires (facultatif)</label>
            <input
              type='text'
              name='additionalInfo'
              value={appointmentDetails.additionalInfo}
              onChange={handleInputChange}
              className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
              placeholder='Détails supplémentaires'
            />
          </div>
          <button
            type='button'
            onClick={handleSubmit}
            className={`w-full p-3.5 text-white border-none rounded cursor-pointer font-bold text-base transition-colors ${
              isEditMode ? 'bg-[#f39c12] hover:bg-[#e67e22]' : 'bg-[#3498db] hover:bg-[#2980b9]'
            }`}
          >
            {isEditMode ? 'Mettre à jour' : 'Réserver'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            border: 'none',
            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'
          }
        }}
        contentLabel='Confirmation de suppression'
      >
        <div className='text-center'>
          <Trash2 size={48} color='#e74c3c' className='mb-4' />
          <h2 className='text-[#2c3e50] mb-4'>Confirmer la suppression</h2>
          <p className='mb-6 text-base text-[#7f8c8d]'>
            Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
          </p>
          <div className='flex justify-center gap-4'>
            <button
              onClick={() => setDeleteModalIsOpen(false)}
              className='px-5 py-2.5 bg-[#95a5a6] text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-[#7f8c8d]'
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className='px-5 py-2.5 bg-[#e74c3c] text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-[#c0392b]'
            >
              Supprimer
            </button>
          </div>
        </div>
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
