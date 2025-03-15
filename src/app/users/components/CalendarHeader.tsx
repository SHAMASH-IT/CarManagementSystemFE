'use client'
import moment from 'moment'
import { ChevronLeft, ChevronRight, List, CalendarIcon, Home } from 'lucide-react'

interface CalendarHeaderProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  isListView: boolean
  toggleListView: () => void
  toggleCalendarView: () => void
}

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  isListView,
  toggleListView,
  toggleCalendarView
}: CalendarHeaderProps) => {
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

  return (
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
  )
}

export default CalendarHeader
