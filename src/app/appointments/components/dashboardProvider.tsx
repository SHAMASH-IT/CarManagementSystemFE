'use client'
import React from 'react'
import moment from 'moment'
import 'moment/locale/fr'
import { FaRegCalendar, FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Navbar from '../../common/Navbar'
import Sidebar from '../../common/Sidebar'
import { useAppointments } from '../hooks/useAppointments'
import { APPOINTMENT_STATUS } from '../../types'

// Configurer moment.js pour utiliser le français
moment.locale('fr')

const DashboardProvider = () => {
  const { appointments } = useAppointments()

  // Calculer les statistiques à partir des rendez-vous
  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === APPOINTMENT_STATUS.PENDING).length,
    confirmed: appointments.filter(apt => apt.status === APPOINTMENT_STATUS.CONFIRMED).length,
    canceled: appointments.filter(apt => apt.status === APPOINTMENT_STATUS.CANCELED).length,
    today: appointments.filter(apt =>
      moment(apt.date).isSame(moment(), 'day')
    ).length
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Tableau de bord </h1>

            {/* Cards de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nombre total des rendez-vous */}
              <div className="relative rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold text-blue-500 uppercase tracking-wide">Total des rendez-vous</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-lg shadow-md transform hover:rotate-12 transition-transform duration-300">
                    <FaRegCalendar className="text-blue-700 w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Rendez-vous prévus aujourd'hui */}
              <div className="relative rounded-lg bg-gradient-to-br from-green-100 to-green-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold text-green-500 uppercase tracking-wide">Rendez-vous aujourd'hui</p>
                    <p className="text-3xl font-bold text-green-700">{stats.today}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-lg shadow-md transform hover:rotate-12 transition-transform duration-300">
                    <FaBell className="text-green-700 w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Confirmations */}
              <div className="relative rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-wide">Confirmations totales</p>
                    <p className="text-3xl font-bold text-yellow-700">{stats.confirmed}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-200 rounded-lg shadow-md transform hover:rotate-12 transition-transform duration-300">
                    <FaCheckCircle className="text-yellow-700 w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Annulations */}
              <div className="relative rounded-lg bg-gradient-to-br from-red-100 to-red-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold text-red-500 uppercase tracking-wide">Annulations</p>
                    <p className="text-3xl font-bold text-red-700">{stats.canceled}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-red-200 rounded-lg shadow-md transform hover:rotate-12 transition-transform duration-300">
                    <FaTimesCircle className="text-red-700 w-6 h-6" />
                  </div>
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
