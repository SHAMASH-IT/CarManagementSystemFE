'use client'

import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import CalendarManager from './components/CalendarManager'
import type { CalendarEvent } from '../types/index'

// Initial events for the calendar
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Exemple de rendez-vous',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    vehicle: 'Peugeot 208',
    service: 'Entretien',
    additionalInfo: 'Révision générale'
  }
]

export default function CalendarPage() {
  return (
    <div className='flex flex-row h-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Navbar />
        <div className='flex flex-1'>
          <div className='flex-1 overflow-hidden relative'>
            <CalendarManager initialEvents={initialEvents} />
          </div>
        </div>
      </div>
    </div>
  )
}
