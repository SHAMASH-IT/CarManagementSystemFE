'use client'
import { useState, useEffect } from 'react'

import moment from 'moment'
import { Edit, Trash2 } from 'lucide-react'

import type { CalendarEvent } from '../../types/index'

interface EventListProps {
  events: CalendarEvent[]
  handleEdit: (eventId: string) => void
  handleDeleteConfirmation: (eventId: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventList = ({ events, handleEdit, handleDeleteConfirmation }: EventListProps) => {
  const [eventsList, setEvents] = useState<CalendarEvent[]>([])
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/all-appointments`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      const data = await response.json()

      console.log('data', data)

      const formattedEvents = data.map((event: any) => ({
        ...event,
        vehicleName: event.vehicle.model,
        start: new Date(event.date),
        end: new Date(event.date)
      }))

      setEvents(formattedEvents)
      console.log('events after setting:', formattedEvents)
    } catch (err) {
      console.error('Error fetching appointments:', err)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <div className='mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Liste des rendez-vous</h2>
      {eventsList.length > 0 ? (
        <div className='space-y-4'>
          {eventsList.map(event => (
            <div key={event.id} className='bg-white p-4 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-lg font-medium'>{event.title}</h3>
                <div className='flex space-x-2'>
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
              <div className='text-sm text-gray-600'>
                <p>
                  <strong>Vehicle:</strong> {event.vehicleName}
                </p>
                <p>
                  <strong>Date:</strong> {moment(event.start).format('DD/MM/YYYY')}
                </p>
                <p>
                  <strong>Heure:</strong> {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 italic'>Aucun rendez-vous programmé</p>
      )}
    </div>
  )
}

export default EventList
