'use client'

import moment from 'moment'
import { Edit, Trash2 } from 'lucide-react'

import type { CalendarEvent } from '../../types/index'

interface EventListProps {
  events: CalendarEvent[]
  handleEdit: (eventId: string) => void
  handleDeleteConfirmation: (eventId: string) => void
}

const EventList = ({ events, handleEdit, handleDeleteConfirmation }: EventListProps) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
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
                  <strong>Heure:</strong> {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center p-8 text-[#7f8c8d]'>Aucun rendez-vous programmé</div>
      )}
    </div>
  )
}

export default EventList
