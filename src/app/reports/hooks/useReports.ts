import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports.service';
import { AppointmentResponse } from '../types/appointment.types';

export const useReports = () => {
  // Statistics queries
  const clientCount = useQuery({
    queryKey: ['clientCount'],
    queryFn: async () => {
      console.log('useReports: Fetching client count...');
      const data = await ReportsService.getClientCount();
      console.log('useReports: Client count data:', data);
      return data;
    }
  });

  const visibleVehicleCount = useQuery({
    queryKey: ['visibleVehicleCount'],
    queryFn: async () => {
      console.log('useReports: Fetching visible vehicle count...');
      const data = await ReportsService.getVisibleVehicleCount();
      console.log('useReports: Visible vehicle count data:', data);
      return data;
    }
  });

  const providerAverageRate = useQuery({
    queryKey: ['providerAverageRate'],
    queryFn: async () => {
      console.log('useReports: Fetching provider average rate...');
      const data = await ReportsService.getProviderAverageRate();
      console.log('useReports: Provider average rate data:', data);
      return data;
    }
  });

  // Appointments queries
  const todayAppointments = useQuery<AppointmentResponse>({
    queryKey: ['todayAppointments'],
    queryFn: async () => {
      console.log('useReports: Fetching today appointments...');
      const data = await ReportsService.getTodayAppointments();
      console.log('useReports: Today appointments data:', data);
      return data;
    }
  });

  const last28DaysAppointments = useQuery<AppointmentResponse>({
    queryKey: ['last28DaysAppointments'],
    queryFn: async () => {
      console.log('useReports: Fetching last 28 days appointments...');
      const data = await ReportsService.getLast28DaysAppointments();
      console.log('useReports: Last 28 days appointments data:', data);
      return data;
    }
  });

  const last70DaysAppointments = useQuery<AppointmentResponse>({
    queryKey: ['last70DaysAppointments'],
    queryFn: async () => {
      console.log('useReports: Fetching last 70 days appointments...');
      const data = await ReportsService.getLast70DaysAppointments();
      console.log('useReports: Last 70 days appointments data:', data);
      return data;
    }
  });

  const last90DaysAppointments = useQuery<AppointmentResponse>({
    queryKey: ['last90DaysAppointments'],
    queryFn: async () => {
      console.log('useReports: Fetching last 90 days appointments...');
      const data = await ReportsService.getLast90DaysAppointments();
      console.log('useReports: Last 90 days appointments data:', data);
      return data;
    }
  });

  const lastYearAppointments = useQuery<AppointmentResponse>({
    queryKey: ['lastYearAppointments'],
    queryFn: async () => {
      console.log('useReports: Fetching last year appointments...');
      const data = await ReportsService.getLastYearAppointments();
      console.log('useReports: Last year appointments data:', data);
      return data;
    }
  });

  // Financial reports queries
  const totalInvoicesAmount = useQuery({
    queryKey: ['totalInvoicesAmount'],
    queryFn: async () => {
      console.log('useReports: Fetching total invoices amount...');
      const data = await ReportsService.getTotalInvoicesAmount();
      console.log('useReports: Total invoices amount data:', data);
      return data;
    }
  });

  const last28DaysInvoicesAmount = useQuery({
    queryKey: ['last28DaysInvoicesAmount'],
    queryFn: async () => {
      console.log('useReports: Fetching last 28 days invoices amount...');
      const data = await ReportsService.getLast28DaysInvoicesAmount();
      console.log('useReports: Last 28 days invoices amount data:', data);
      return data;
    }
  });

  const last70DaysInvoicesAmount = useQuery({
    queryKey: ['last70DaysInvoicesAmount'],
    queryFn: async () => {
      console.log('useReports: Fetching last 70 days invoices amount...');
      const data = await ReportsService.getLast70DaysInvoicesAmount();
      console.log('useReports: Last 70 days invoices amount data:', data);
      return data;
    }
  });

  const last90DaysInvoicesAmount = useQuery({
    queryKey: ['last90DaysInvoicesAmount'],
    queryFn: async () => {
      console.log('useReports: Fetching last 90 days invoices amount...');
      const data = await ReportsService.getLast90DaysInvoicesAmount();
      console.log('useReports: Last 90 days invoices amount data:', data);
      return data;
    }
  });

  const yearInvoicesAmount = useQuery({
    queryKey: ['yearInvoicesAmount'],
    queryFn: async () => {
      console.log('useReports: Fetching year invoices amount...');
      const data = await ReportsService.getYearInvoicesAmount();
      console.log('useReports: Year invoices amount data:', data);
      return data;
    }
  });

  return {
    // Statistics
    clientCount: clientCount.data,
    visibleVehicleCount: visibleVehicleCount.data,
    providerAverageRate: providerAverageRate.data,
    isLoadingStatistics: clientCount.isLoading || visibleVehicleCount.isLoading || providerAverageRate.isLoading,
    statisticsError: clientCount.error || visibleVehicleCount.error || providerAverageRate.error,
    isLoadingClientCount: clientCount.isLoading,
    isLoadingVisibleVehicleCount: visibleVehicleCount.isLoading,
    isLoadingProviderAverageRate: providerAverageRate.isLoading,

    // Appointments
    todayAppointments: todayAppointments.data,
    last28DaysAppointments: last28DaysAppointments.data,
    last70DaysAppointments: last70DaysAppointments.data,
    last90DaysAppointments: last90DaysAppointments.data,
    lastYearAppointments: lastYearAppointments.data,
    isLoadingAppointments: todayAppointments.isLoading || last28DaysAppointments.isLoading || last70DaysAppointments.isLoading || last90DaysAppointments.isLoading || lastYearAppointments.isLoading,
    appointmentsError: todayAppointments.error || last28DaysAppointments.error || last70DaysAppointments.error || last90DaysAppointments.error || lastYearAppointments.error,
    isLoadingTodayAppointments: todayAppointments.isLoading,
    isLoadingLast28DaysAppointments: last28DaysAppointments.isLoading,
    isLoadingLast70DaysAppointments: last70DaysAppointments.isLoading,
    isLoadingLast90DaysAppointments: last90DaysAppointments.isLoading,
    isLoadingLastYearAppointments: lastYearAppointments.isLoading,

    // Financial reports
    totalInvoicesAmount: totalInvoicesAmount.data,
    last28DaysInvoicesAmount: last28DaysInvoicesAmount.data,
    last70DaysInvoicesAmount: last70DaysInvoicesAmount.data,
    last90DaysInvoicesAmount: last90DaysInvoicesAmount.data,
    yearInvoicesAmount: yearInvoicesAmount.data,
    isLoadingFinancial: totalInvoicesAmount.isLoading || last28DaysInvoicesAmount.isLoading || last70DaysInvoicesAmount.isLoading || last90DaysInvoicesAmount.isLoading || yearInvoicesAmount.isLoading,
    financialError: totalInvoicesAmount.error || last28DaysInvoicesAmount.error || last70DaysInvoicesAmount.error || last90DaysInvoicesAmount.error || yearInvoicesAmount.error,
    isLoadingTotalInvoicesAmount: totalInvoicesAmount.isLoading,
    isLoadingLast28DaysInvoicesAmount: last28DaysInvoicesAmount.isLoading,
    isLoadingLast70DaysInvoicesAmount: last70DaysInvoicesAmount.isLoading,
    isLoadingLast90DaysInvoicesAmount: last90DaysInvoicesAmount.isLoading,
    isLoadingYearInvoicesAmount: yearInvoicesAmount.isLoading
  };
};
