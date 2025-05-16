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
  /* Style moderne et cohérent avec les couleurs du header */
  .vehicle-calendar {
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #ffffff;
  }

  .vehicle-calendar .rbc-header {
    background: linear-gradient(to right, rgb(227, 242, 253), rgb(173, 216, 230)); /* Palette bleu clair comme le header */
    color: #1565c0; /* Texte bleu vif */
    padding: 8px;
    font-weight: bold; /* Texte plus marqué */
    text-transform: capitalize;
    border: none;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .vehicle-calendar .rbc-header:hover {
    background: linear-gradient(to right, rgb(173, 216, 230), rgb(135, 206, 250)); /* Effet lumineux au survol */
  }

  .vehicle-calendar .rbc-month-view {
    border-radius: 12px;
    border: 1px solid rgb(173, 216, 230); /* Bordure harmonisée avec le header */
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(173, 216, 230, 0.2); /* Ombre douce */
  }

  .vehicle-calendar .rbc-day-bg {
    transition: all 0.2s ease;
    background-color: #ffffff; /* Fond blanc propre */
  }

  .vehicle-calendar .rbc-day-bg:hover {
    background-color: rgb(227, 242, 253); /* Lumière subtile au survol */
  }

  .vehicle-calendar .rbc-today {
    background-color: rgb(209, 233, 252); /* Accent bleu clair pour "aujourd'hui" */
    border-radius: 6px; /* Arrondi pour douceur */
  }

  /* Événements plus compacts */
  .vehicle-calendar .rbc-event {
    background: linear-gradient(to right, rgb(173, 216, 230), rgb(135, 206, 250));
    border: none;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(135, 206, 250, 0.3);
    padding: 2px 6px;
    margin: 1px 0;
    color: #ffffff;
    font-weight: 500;
    font-size: 0.75rem;
    transition: all 0.2s ease;
    min-height: 20px;
    line-height: 1.2;
  }

  .vehicle-calendar .rbc-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(135, 206, 250, 0.4);
    background: linear-gradient(to right, rgb(135, 206, 250), rgb(96, 185, 255));
  }

  .vehicle-calendar .rbc-off-range-bg {
    background-color: rgb(240, 248, 253); /* Fond bleu doux pour jours hors plage */
  }

  .vehicle-calendar .rbc-date-cell {
    padding: 4px;
    font-weight: 500;
    color: #1565c0; /* Texte principal en bleu header */
    font-size: 0.8rem;
  }

  .vehicle-calendar .rbc-off-range {
    color: #90caf9; /* Bleu clair pour jours hors plage */
  }

  .vehicle-calendar .rbc-date-cell.rbc-now {
    color: #1565c0; /* Accent bleu vif */
    font-weight: 700; /* Texte en gras */
  }

  .vehicle-calendar .rbc-row-segment {
    padding: 1px 2px;
  }

  .vehicle-calendar .rbc-show-more {
    color: #1565c0; /* Texte cohérent avec le header */
    font-weight: 600; /* Texte marqué */
    background: transparent;
    font-size: 0.7rem;
    padding: 1px 4px;
  }

  .vehicle-calendar .rbc-show-more:hover {
    color: #0d47a1; /* Accent bleu foncé au survol */
    text-decoration: underline;
  }

  /* Ajustements pour les cellules */
  .vehicle-calendar .rbc-month-row {
    min-height: 80px;
  }

  .vehicle-calendar .rbc-row-content {
    z-index: 4;
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
