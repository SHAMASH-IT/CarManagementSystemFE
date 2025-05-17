'use client'
import React, { useEffect } from 'react'
import { useReports } from '../hooks/useReports'
import StatisticsCard from './StatisticsCard'
import FinancialReportCard from './FinancialReportCard'
import AppointmentList from './AppointmentList'
import { AppointmentResponse } from '../types/appointment.types'

const ReportsDashboard: React.FC = () => {
  const {
    clientCount,
    visibleVehicleCount,
    providerAverageRate,
    totalInvoicesAmount,
    last28DaysInvoicesAmount,
    last70DaysInvoicesAmount,
    last90DaysInvoicesAmount,
    yearInvoicesAmount,
    isLoadingClientCount,
    isLoadingVisibleVehicleCount,
    isLoadingProviderAverageRate,
    isLoadingTotalInvoicesAmount,
    isLoadingLast28DaysInvoicesAmount,
    isLoadingLast70DaysInvoicesAmount,
    isLoadingLast90DaysInvoicesAmount,
    isLoadingYearInvoicesAmount,
    todayAppointments,
    last28DaysAppointments,
    isLoadingTodayAppointments,
    isLoadingLast28DaysAppointments
  } = useReports()

  useEffect(() => {
    if (last28DaysAppointments?.appointments) {
      console.log('Rendez-vous des 28 derniers jours:', last28DaysAppointments);
      console.log('Nombre de rendez-vous:', last28DaysAppointments.appointments.length);
    }
  }, [last28DaysAppointments]);

  const isLoading = 
    isLoadingClientCount ||
    isLoadingVisibleVehicleCount ||
    isLoadingProviderAverageRate ||
    isLoadingTotalInvoicesAmount ||
    isLoadingLast28DaysInvoicesAmount ||
    isLoadingLast70DaysInvoicesAmount ||
    isLoadingLast90DaysInvoicesAmount ||
    isLoadingYearInvoicesAmount ||
    isLoadingTodayAppointments ||
    isLoadingLast28DaysAppointments

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord des rapports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard
          title="Clients"
          value={clientCount}
          isLoading={isLoadingClientCount}
        />
        <StatisticsCard
          title="Véhicules visibles"
          value={visibleVehicleCount}
          isLoading={isLoadingVisibleVehicleCount}
        />
        <StatisticsCard
          title="Note moyenne des prestataires"
          value={providerAverageRate}
          isLoading={isLoadingProviderAverageRate}
          isRating
        />
        <StatisticsCard
          title="Revenus totaux"
          value={totalInvoicesAmount}
          isLoading={isLoadingTotalInvoicesAmount}
          isCurrency
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FinancialReportCard
          title="Revenus des 28 derniers jours"
          total={last28DaysInvoicesAmount}
          isLoading={isLoadingLast28DaysInvoicesAmount}
        />
        <FinancialReportCard
          title="Revenus des 70 derniers jours"
          total={last70DaysInvoicesAmount}
          isLoading={isLoadingLast70DaysInvoicesAmount}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rendez-vous aujourd'hui</h3>
          <AppointmentList
            appointments={todayAppointments?.appointments || []}
            isLoading={isLoadingTodayAppointments}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rendez-vous des 28 derniers jours</h3>
          <AppointmentList
            appointments={last28DaysAppointments?.appointments || []}
            isLoading={isLoadingLast28DaysAppointments}
          />
        </div>
      </div>
    </div>
  )
}

export default ReportsDashboard 