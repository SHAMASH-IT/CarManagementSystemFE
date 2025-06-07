'use client'
import React, { useState, useMemo } from 'react'
import moment from 'moment'
import 'moment/locale/fr'
import { FaRegCalendar, FaBell, FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa'
import Navbar from '../../common/Navbar'
import Sidebar from '../../common/Sidebar'
import { useAppointments } from '../hooks/useAppointments'
import { APPOINTMENT_STATUS } from '../../types'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Configurer moment.js pour utiliser le français
moment.locale('fr')

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

// Ajouter ces styles personnalisés pour le calendrier
const calendarStyles = {
  width: '100%',
  border: 'none',
  borderRadius: '1rem',
  padding: '1rem',
  backgroundColor: 'white',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
}

// Styles CSS pour le calendrier
const calendarClassName = `
  .react-calendar {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.5rem;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    font-family: 'Inter', sans-serif;
    max-width: 100%;
    margin: 0 auto;
    height: 350px;
  }
  .react-calendar__tile {
    padding: 0.4rem;
    border-radius: 0.4rem;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
  }
  .react-calendar__tile:hover {
    background-color: #f3f4f6;
    color: #2563eb;
  }
  .react-calendar__tile--active {
    background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
    color: white !important;
    font-weight: 600;
  }
  .react-calendar__navigation button {
    font-size: 0.8rem;
    padding: 0.4rem;
    border-radius: 0.4rem;
    transition: all 0.2s ease;
    font-weight: 600;
    color: #1f2937;
  }
  .react-calendar__navigation button:hover {
    background-color: #f3f4f6;
    color: #2563eb;
  }
  .react-calendar__navigation button:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
  }
  .react-calendar__month-view__weekdays {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.3rem;
  }
  .react-calendar__month-view__days__day {
    height: 2.5rem;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #9ca3af;
  }
  .has-appointment {
    position: relative;
    font-weight: 600;
    color: #2563eb;
  }
  .has-appointment::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: #2563eb;
    border-radius: 50%;
  }
`
const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
const user = userStr ? JSON.parse(userStr) : null
const userId = user?.id
const DashboardProvider = () => {
  const { appointments, pendingAppointments } = useAppointments(userId)
  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [isDateSelected, setIsDateSelected] = useState(false)
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false)
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([])

  // Filtrer les rendez-vous en fonction de la période ou de la date sélectionnée
  const filteredAppointments = useMemo(() => {
    if (isDateSelected && selectedDate && !Array.isArray(selectedDate)) {
      // Si une date est sélectionnée dans le calendrier
      return appointments.filter(apt => moment(apt.date).isSame(moment(selectedDate), 'day'))
    }

    // Sinon, filtrer selon la période
    const now = moment()
    const startDate = moment()

    switch (selectedPeriod) {
      case 'today':
        return appointments.filter(apt => moment(apt.date).isSame(now, 'day'))
      case '28days':
        startDate.subtract(28, 'days')
        return appointments.filter(apt => moment(apt.date).isBetween(startDate, now, 'day', '[]'))
      case '70days':
        startDate.subtract(70, 'days')
        return appointments.filter(apt => moment(apt.date).isBetween(startDate, now, 'day', '[]'))
      default:
        return appointments
    }
  }, [appointments, selectedPeriod, selectedDate, isDateSelected])

  // Filtrer les rendez-vous en attente en fonction de la période ou de la date sélectionnée
  const filteredPendingAppointments = useMemo(() => {
    if (isDateSelected && selectedDate && !Array.isArray(selectedDate)) {
      // Si une date est sélectionnée dans le calendrier
      return pendingAppointments.filter(apt => moment(apt.date).isSame(moment(selectedDate), 'day'))
    }

    // Sinon, filtrer selon la période
    const now = moment()
    const startDate = moment()

    switch (selectedPeriod) {
      case 'today':
        return pendingAppointments.filter(apt => moment(apt.date).isSame(now, 'day'))
      case '28days':
        startDate.subtract(28, 'days')
        return pendingAppointments.filter(apt => moment(apt.date).isBetween(startDate, now, 'day', '[]'))
      case '70days':
        startDate.subtract(70, 'days')
        return pendingAppointments.filter(apt => moment(apt.date).isBetween(startDate, now, 'day', '[]'))
      default:
        return pendingAppointments
    }
  }, [pendingAppointments, selectedPeriod, selectedDate, isDateSelected])

  // Calculer les statistiques à partir des rendez-vous filtrés
  const stats = useMemo(() => ({
    total: filteredAppointments.length,
    pending: filteredPendingAppointments.length,
    confirmed: filteredAppointments.filter(apt => apt.status === APPOINTMENT_STATUS.CONFIRMED).length,
    canceled: filteredAppointments.filter(apt => apt.status === APPOINTMENT_STATUS.CANCELED).length,
    reserved: filteredAppointments.filter(apt => apt.status === 'RESERVED').length,
    today: filteredAppointments.filter(apt =>
      moment(apt.date).isSame(moment(), 'day')
    ).length
  }), [filteredAppointments, filteredPendingAppointments])

  // Préparer les données pour le graphique
  const chartData = useMemo(() => ({
    labels: ['En attente', 'Réservés', 'Confirmés', 'Annulés', 'Aujourd\'hui'],
    datasets: [
      {
        label: 'Rendez-vous',
        data: [stats.pending, stats.reserved, stats.confirmed, stats.canceled, stats.today],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      }
    ]
  }), [stats])

  // Améliorer les options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
            weight: 'normal' as const,
          },
          padding: 10,
          usePointStyle: true,
          color: '#4b5563',
        },
      },
      title: {
        display: true,
        text: isDateSelected && selectedDate && !Array.isArray(selectedDate)
          ? `Statistiques des rendez-vous - ${moment(selectedDate).format('dddd D MMMM YYYY')}`
          : `Statistiques des rendez-vous - ${selectedPeriod === 'today' ? 'Aujourd\'hui' : selectedPeriod === '28days' ? '28 derniers jours' : '70 derniers jours'}`,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: 'bold' as const,
        },
        padding: {
          top: 5,
          bottom: 10,
        },
        color: '#1f2937',
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 6,
        boxPadding: 3,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 11,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 10,
          weight: 'normal' as const,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
            weight: 'normal' as const,
          },
          color: '#6b7280',
          padding: 5,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
            weight: 'normal' as const,
          },
          color: '#6b7280',
          padding: 5,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#3b82f6',
      },
      point: {
        radius: 3,
        hoverRadius: 4,
        backgroundColor: '#3b82f6',
        borderColor: '#fff',
        borderWidth: 1,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  }

  const handleDateChange = (value: Value) => {
    setSelectedDate(value)
    setIsDateSelected(true)
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    setIsDateSelected(false)
    setSelectedDate(new Date())
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 h-full w-full">
          <div className="w-full h-full px-2 sm:px-[40px] m-2 sm:m-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Tableau de bord
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCalendarAlt className="w-4 h-4" />
                <span className="text-sm">
                  {isDateSelected && selectedDate && !Array.isArray(selectedDate)
                    ? moment(selectedDate).format('dddd D MMMM YYYY')
                    : selectedPeriod === 'today'
                    ? 'Aujourd\'hui'
                    : selectedPeriod === '28days'
                    ? '28 derniers jours'
                    : '70 derniers jours'}
                </span>
              </div>
            </div>

            {/* Cards de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
              {/* Nombre total des rendez-vous */}
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-8 border-blue-400 flex flex-col items-center justify-between p-6 group">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Total des rendez-vous</p>
                    <p className="text-4xl font-extrabold text-blue-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-blue-200 group-hover:bg-blue-200 group-hover:text-blue-800 transition-all duration-300">
                    <FaRegCalendar className="text-blue-700 w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Rendez-vous réservés */}
              <div className="relative rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-8 border-amber-400 flex flex-col items-center justify-between p-6 group">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Rendez-vous réservés</p>
                    <p className="text-4xl font-extrabold text-amber-800 mt-2">{stats.reserved}</p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-amber-200 group-hover:bg-amber-200 group-hover:text-amber-800 transition-all duration-300">
                    <FaCalendarAlt className="text-amber-700 w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Rendez-vous terminés */}
              <div className="relative rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-8 border-emerald-400 flex flex-col items-center justify-between p-6 group">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Rendez-vous terminés</p>
                    <p className="text-4xl font-extrabold text-emerald-800 mt-2">{stats.confirmed}</p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-emerald-200 group-hover:bg-emerald-200 group-hover:text-emerald-800 transition-all duration-300">
                    <FaCheckCircle className="text-emerald-700 w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Rendez-vous annulés */}
              <div className="relative rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-8 border-rose-400 flex flex-col items-center justify-between p-6 group">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Rendez-vous annulés</p>
                    <p className="text-4xl font-extrabold text-rose-800 mt-2">{stats.canceled}</p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-rose-200 group-hover:bg-rose-200 group-hover:text-rose-800 transition-all duration-300">
                    <FaTimesCircle className="text-rose-700 w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Rendez-vous en attente */}
              <div className="relative rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-8 border-sky-400 flex flex-col items-center justify-between p-6 group">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Rendez-vous en attente</p>
                    <p className="text-4xl font-extrabold text-sky-800 mt-2">{stats.pending}</p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-sky-200 group-hover:bg-sky-200 group-hover:text-sky-800 transition-all duration-300">
                    <FaClock className="text-sky-700 w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons de filtrage */}
            <div className="flex justify-center space-x-3 mb-4">
              <button
                onClick={() => handlePeriodChange('today')}
                className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedPeriod === 'today' && !isDateSelected
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-white text-gray-700 shadow-sm hover:shadow'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => handlePeriodChange('28days')}
                className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedPeriod === '28days' && !isDateSelected
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-white text-gray-700 shadow-sm hover:shadow'
                }`}
              >
                28 derniers jours
              </button>
              <button
                onClick={() => handlePeriodChange('70days')}
                className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedPeriod === '70days' && !isDateSelected
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-white text-gray-700 shadow-sm hover:shadow'
                }`}
              >
                70 derniers jours
              </button>
            </div>

            {/* Calendrier et Graphique */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Calendrier */}
              <div className="bg-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Calendrier des rendez-vous
                  </h2>
                </div>
                <style>{calendarClassName}</style>
                <div className="calendar-wrapper">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="w-full border-none rounded-lg"
                    tileClassName={({ date }) => {
                      const hasAppointment = appointments.some(apt => 
                        moment(apt.date).isSame(moment(date), 'day')
                      )
                      return hasAppointment ? 'has-appointment' : ''
                    }}
                  />
                </div>
              </div>

              {/* Graphique */}
              <div className="bg-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Statistiques
                  </h2>
                </div>
                <div className="chart-wrapper h-[350px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardProvider
