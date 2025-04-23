import { useState } from 'react';
import { progressService, Intervention, StartInterventionDto, UpdateInterventionDto, ReservedAppointment, Status } from '../services/progress.service';

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVehicle = async (registration: string): Promise<Intervention | null> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting vehicle search for registration:', registration);

      // Récupérer les rendez-vous réservés, les interventions en cours et les interventions terminées
      const [appointments, interventions, completedInterventions] = await Promise.all([
        progressService.getReservedAppointments(),
        progressService.getInProgressInterventions(),
        progressService.getCompletedInterventions()
      ]);

      console.log('All appointments:', appointments);
      console.log('All interventions:', interventions);
      console.log('All completed interventions:', completedInterventions);

      // Rechercher dans les interventions en cours
      const matchingIntervention = interventions.find(
        (int) => {
          const intRegistration = int.appointment?.vehicle.registration;
          console.log('Comparing intervention registration:', intRegistration, 'with search:', registration);
          return intRegistration === registration;
        }
      );

      // Rechercher dans les rendez-vous réservés
      const matchingAppointment = appointments.find(
        (app) => {
          console.log('Comparing appointment registration:', app.vehicle.registration, 'with search:', registration);
          return app.vehicle.registration === registration;
        }
      );

      // Rechercher dans les interventions terminées
      const matchingCompletedIntervention = completedInterventions.find(
        (int) => {
          const intRegistration = int.appointment?.vehicle.registration;
          console.log('Comparing completed intervention registration:', intRegistration, 'with search:', registration);
          return intRegistration === registration;
        }
      );

      console.log('Matching intervention:', matchingIntervention);
      console.log('Matching appointment:', matchingAppointment);
      console.log('Matching completed intervention:', matchingCompletedIntervention);

      if (matchingIntervention) {
        // Si trouvé dans les interventions, récupérer les détails complets
        const fullIntervention = await progressService.getIntervention(matchingIntervention.id);
        console.log('Full intervention details:', fullIntervention);
        return fullIntervention;
      } else if (matchingAppointment) {
        // Si trouvé dans les rendez-vous (pas encore commencé)
        const reservedIntervention: Intervention = {
          id: 0,
          description: "Intervention non démarrée",
          startDate: "",
          endDate: matchingAppointment.date,
          price: 0,
          status: Status.RESERVED,
          appointmentId: matchingAppointment.id,
          appointment: {
            id: matchingAppointment.id,
            vehicle: matchingAppointment.vehicle,
            service: matchingAppointment.service,
          },
        };
        console.log('Created reserved intervention:', reservedIntervention);
        return reservedIntervention;
      } else if (matchingCompletedIntervention) {
        // Si trouvé dans les interventions terminées
        console.log('Found completed intervention:', matchingCompletedIntervention);
        return matchingCompletedIntervention;
      }

      console.log('No matching vehicle found');
      return null;
    } catch (err) {
      console.error('Error in searchVehicle:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la recherche du véhicule';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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

  const getCompletedInterventions = async () => {
    try {
      setLoading(true);
      setError(null);
      return await progressService.getCompletedInterventions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des interventions terminées';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchVehicle,
    getReservedAppointments,
    startIntervention,
    getIntervention,
    updateIntervention,
    completeIntervention,
    getInProgressInterventions,
    getCompletedInterventions
  };
};
