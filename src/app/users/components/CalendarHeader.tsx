import moment from 'moment'
import { ChevronLeft, ChevronRight, List, CalendarIcon } from 'lucide-react'

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
    <div className='flex justify-between items-center p-5 bg-[#e3f2fd] text-[#1565c0] rounded-t-lg mx-5 mt-5'>
      <h1 className='m-0 text-2xl'>Mon calendrier</h1>
      {/* Month navigation buttons */}
      <button
        onClick={handlePreviousMonth}
        className='bg-transparent border-none cursor-pointer text-[#1565c0] flex items-center justify-center mr-1'
        title='Mois précédent'
      >
        <ChevronLeft size={20} />
      </button>

      <span className='font-bold mr-2.5 text-[#1565c0]'>{moment(currentDate).format('MMMM')}</span>

      <button
        onClick={handleNextMonth}
        className='bg-transparent border-none cursor-pointer text-[#1565c0] flex items-center justify-center mr-4'
        title='Mois suivant'
      >
        <ChevronRight size={20} />
      </button>

      {/* Year navigation buttons */}
      <button
        onClick={handlePreviousYear}
        className='bg-transparent border-none cursor-pointer text-[#1565c0] flex items-center justify-center mr-1'
        title='Année précédente'
      >
        <ChevronLeft size={20} />
      </button>

      <span className='font-bold mr-1 text-[#1565c0]'>{moment(currentDate).format('YYYY')}</span>

      <button
        onClick={handleNextYear}
        className='bg-transparent border-none cursor-pointer text-[#1565c0] flex items-center justify-center mr-4'
        title='Année suivante'
      >
        <ChevronRight size={20} />
      </button>

      <div className='flex items-center'>
        {/* View toggle buttons */}
        <div className='flex mr-5 bg-[#dcedf7] rounded overflow-hidden'>
          <button
            onClick={toggleCalendarView}
            className={`border-none cursor-pointer text-[#1565c0] flex items-center px-3 py-2 transition-colors ${
              isListView ? 'bg-transparent' : 'bg-[#bbdefb]'
            }`}
          >
            <CalendarIcon size={18} className='mr-1' />
            Mois
          </button>
          <button
            onClick={toggleListView}
            className={`border-none cursor-pointer text-[#1565c0] flex items-center px-3 py-2 transition-colors ${
              isListView ? 'bg-[#bbdefb]' : 'bg-transparent'
            }`}
            title='Vue liste'
          >
            <List size={20} className='mr-2' />
            <span className='text-sm font-medium'>Liste</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader
