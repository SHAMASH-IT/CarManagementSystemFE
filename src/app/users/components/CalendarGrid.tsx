'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import 'moment/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { CalendarEvent, CalendarView as CalendarViewType } from '../../types/index'

moment.locale('fr')

interface CalendarGridProps {
  calendarEvents: CalendarEvent[]
  currentDate: Date
  setCurrentDate: (date: Date) => void
  currentView: CalendarViewType
  handleViewChange: (view: CalendarViewType) => void
  handleSelectSlot: ({ start }: { start: Date }) => void
}

const CalendarGrid = ({
  calendarEvents,
  currentDate,
  setCurrentDate,
  currentView,
  handleViewChange,
  handleSelectSlot
}: CalendarGridProps) => {
  const localizer = momentLocalizer(moment)

  return (
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
  )
}

export default CalendarGrid
