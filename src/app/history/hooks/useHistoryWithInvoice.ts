import { useState, useEffect } from 'react';
import { historyService } from '../services/history.service';
import { Intervention } from '../../progress/services/progress.service';

/**
 * Hook personnalisé pour gérer l'historique des interventions avec factures
 */
export const useHistoryWithInvoice = (userId: number) => {
  // États pour gérer les interventions et l'interface utilisateur
  const [completedInterventions, setCompletedInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);

  /**
   * Récupère les interventions complétées avec factures pour l'utilisateur connecté
   */
  const fetchCompletedInterventionsWithInvoice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const interventions = await historyService.getCompletedInterventionsWithInvoiceByUser(userId);
      console.log("Fetched interventions:", interventions);
      setCompletedInterventions(interventions);
      setFilteredInterventions(interventions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des interventions terminées avec factures';
      console.error("Error fetching interventions:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtre les interventions selon un terme de recherche
   */
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

  // Effet pour charger les interventions quand l'utilisateur est authentifié
  useEffect(() => {
    if (userId) {
      fetchCompletedInterventionsWithInvoice();
    }
  }, [userId]);

  return {
    completedInterventions,
    filteredInterventions,
    isLoading,
    error,
    filterInterventions,
    fetchCompletedInterventionsWithInvoice,
  };
}; 