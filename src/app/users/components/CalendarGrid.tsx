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
    <>
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
      <style jsx global>{`
        /* Style moderne pour le calendrier */
        .vehicle-calendar {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #ffffff;
        }

        .vehicle-calendar .rbc-header {
          background: linear-gradient(to right, rgb(79, 70, 229), rgb(99, 102, 241));
          color: #ffffff;
          padding: 12px;
          font-weight: 600;
          text-transform: capitalize;
          border: none;
          transition: all 0.3s ease;
        }

        .vehicle-calendar .rbc-header:hover {
          background: linear-gradient(to right, rgb(99, 102, 241), rgb(129, 140, 248));
        }

        .vehicle-calendar .rbc-month-view {
          border-radius: 12px;
          border: 1px solid rgb(99, 102, 241);
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.15);
        }

        .vehicle-calendar .rbc-day-bg {
          transition: all 0.2s ease;
          background-color: #ffffff;
        }

        .vehicle-calendar .rbc-day-bg:hover {
          background-color: rgb(238, 242, 255);
        }

        .vehicle-calendar .rbc-today {
          background-color: rgb(224, 231, 255);
        }

        .vehicle-calendar .rbc-event {
          background: linear-gradient(to right, rgb(79, 70, 229), rgb(99, 102, 241));
          border: none;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.25);
          padding: 4px 8px;
          color: #ffffff;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .vehicle-calendar .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(79, 70, 229, 0.35);
          background: linear-gradient(to right, rgb(99, 102, 241), rgb(129, 140, 248));
        }

        .vehicle-calendar .rbc-off-range-bg {
          background-color: rgb(248, 250, 252);
        }

        .vehicle-calendar .rbc-date-cell {
          padding: 8px;
          font-weight: 500;
          color: rgb(79, 70, 229);
        }

        .vehicle-calendar .rbc-off-range {
          color: rgb(199, 210, 254);
        }

        .vehicle-calendar .rbc-date-cell.rbc-now {
          color: rgb(79, 70, 229);
          font-weight: 700;
        }

        .vehicle-calendar .rbc-row-segment {
          padding: 2px 4px;
        }

        .vehicle-calendar .rbc-show-more {
          color: #000000;
          font-weight: 500;
          background: transparent;
        }

        .vehicle-calendar .rbc-show-more:hover {
          color: #1e293b;
          text-decoration: underline;
        }

        /* Masquer les boutons de navigation du calendrier */
        .vehicle-calendar .rbc-toolbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default CalendarGrid
