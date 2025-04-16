import { useState } from 'react';
import { progressService, Intervention, StartInterventionDto, UpdateInterventionDto, ReservedAppointment } from '../services/progress.service';

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReservedAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.getReservedAppointments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des rendez-vous';
      setError(errorMessage);
      console.error('Error in getReservedAppointments:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startIntervention = async (appointmentId: number, data: StartInterventionDto) => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.startIntervention(appointmentId, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du démarrage de l\'intervention';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getIntervention = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.getIntervention(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération de l\'intervention';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIntervention = async (id: number, data: UpdateInterventionDto) => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.updateIntervention(id, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour de l\'intervention';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeIntervention = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.completeIntervention(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la finalisation de l\'intervention';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInProgressInterventions = async () => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.getInProgressInterventions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des interventions en cours';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  return {
    loading,
    error,
    getReservedAppointments,
    startIntervention,
    getIntervention,
    updateIntervention,
    completeIntervention,
    getInProgressInterventions
  };
};
