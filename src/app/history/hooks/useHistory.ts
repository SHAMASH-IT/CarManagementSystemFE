import { useState, useEffect } from 'react';
import { historyService } from '../services/history.service';
import { Intervention } from '../../progress/services/progress.service';

export const useHistory = () => {
  const [completedInterventions, setCompletedInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);

  const fetchCompletedInterventions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const interventions = await historyService.getCompletedInterventions();
      setCompletedInterventions(interventions);
      setFilteredInterventions(interventions);
    } catch (err) {
      console.error('Erreur lors de la récupération des interventions complétées:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des interventions terminées';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterventions = (searchTerm: string) => {
    if (searchTerm.trim() === '') {
      setFilteredInterventions(completedInterventions);
    } else {
      const filtered = completedInterventions.filter(
        (intervention) =>
          intervention.appointment?.vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
          intervention.appointment?.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          intervention.appointment?.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          intervention.appointment?.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterventions(filtered);
    }
  };

  const rateIntervention = async (id: number, rate: number, commentaire: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await historyService.rateIntervention(id, rate, commentaire);
      await fetchCompletedInterventions();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la note");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedInterventions();
  }, []);

  return {
    completedInterventions,
    filteredInterventions,
    isLoading,
    error,
    filterInterventions,
    fetchCompletedInterventions,
    rateIntervention,
  };
};
