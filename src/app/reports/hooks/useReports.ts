import { useState, useEffect } from 'react';
import { ReportsService } from '../service/ReportsService';
import { Statistics, AppointmentReport } from '../types';

export const useReports = (providerId: number) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [appointments, setAppointments] = useState<AppointmentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch statistics
        const stats = await ReportsService.getProviderStatistics(providerId);
        setStatistics(stats);

        // Fetch appointments
        const apps = await ReportsService.getProviderAppointments(providerId);
        setAppointments(apps);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  return {
    statistics,
    appointments,
    loading,
    error
  };
};
