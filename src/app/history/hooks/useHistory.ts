import { useState, useEffect } from 'react';
import { historyService } from '../services/history.service';
import { Intervention } from '../../progress/services/progress.service';
import { useAuth } from '../../login/hooks/useAuth';

/**
 * Hook personnalisé pour gérer l'historique des interventions
 * Permet de récupérer, filtrer et évaluer les interventions complétées
 */
export const useHistory = () => {
  // Récupération des données d'authentification
  const { user, isAuthenticated } = useAuth();
  
  // États pour gérer les interventions et l'interface utilisateur
  const [completedInterventions, setCompletedInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);

  /**
   * Récupère les interventions complétées pour l'utilisateur connecté
   * Utilise le token JWT stocké dans le localStorage pour obtenir l'ID de l'utilisateur
   */
  const fetchCompletedInterventions = async () => {
    // Récupération du token JWT depuis le localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    try {
      // Décodage du token JWT pour obtenir les informations de l'utilisateur
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      // Extraction de l'ID utilisateur depuis le payload décodé
      const userData = JSON.parse(jsonPayload);
      
      if (!userData.sub) {
        return;
      }

      // Récupération des interventions depuis l'API
      setIsLoading(true);
      setError(null);
      
      const interventions = await historyService.getCompletedInterventions(userData.sub);
      setCompletedInterventions(interventions);
      setFilteredInterventions(interventions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des interventions terminées';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtre les interventions selon un terme de recherche
   * Recherche dans la marque, le modèle, l'immatriculation du véhicule et le nom du service
   */
  const filterInterventions = (searchTerm: string) => {
    if (searchTerm.trim() === '') {
      // Si le terme de recherche est vide, affiche toutes les interventions
      setFilteredInterventions(completedInterventions);
    } else {
      // Filtre les interventions selon le terme de recherche
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

  /**
   * Permet d'évaluer une intervention avec une note et un commentaire
   * Met à jour l'historique après l'évaluation
   */
  const rateIntervention = async (id: number, rate: number, commentaire: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Envoi de l'évaluation à l'API
      await historyService.rateIntervention(id, rate, commentaire);
      // Rafraîchissement de l'historique
      await fetchCompletedInterventions();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la note");
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour charger les interventions quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchCompletedInterventions();
    }
  }, [isAuthenticated]);

  // Retourne les fonctions et états nécessaires pour l'interface utilisateur
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
