'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '../hooks/useProgress';
import { ReservedAppointment, Intervention } from '../services/progress.service';

export default function InterventionList() {
  const router = useRouter();
  const {
    loading,
    error,
    getReservedAppointments,
    startIntervention,
    getInProgressInterventions
  } = useProgress();

  const [appointments, setAppointments] = useState<ReservedAppointment[]>([]);
  const [inProgress, setInProgress] = useState<Intervention[]>([]);
  const [inProgressError, setInProgressError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      loadAppointments();
      loadInProgressInterventions();
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadInProgressInterventions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getReservedAppointments();
      if (data && Array.isArray(data)) {
        setAppointments(data);
      } else {
        console.error('Invalid data format:', data);
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error in loadAppointments:', err);
      setAppointments([]);
    }
  };

  const loadInProgressInterventions = async () => {
    try {
      setInProgressError(null);
      const data = await getInProgressInterventions();
      if (data && Array.isArray(data)) {
        setInProgress(data);
      } else {
        setInProgressError("Format de données invalide");
        setInProgress([]);
      }
    } catch (err) {
      console.error('Error in loadInProgressInterventions:', err);
      setInProgressError("Erreur lors du chargement des interventions en cours");
      setInProgress([]);
    }
  };

  const handleStartIntervention = async (appointmentId: number) => {
    try {
      const intervention = await startIntervention(appointmentId, {
        description: 'Nouvelle intervention',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        price: 0
      });
      router.push(`/progress/intervention/${intervention.id}`);
    } catch (err) {
      console.error('Error starting intervention:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rendez-vous réservés</h1>
      <div className="grid gap-4 mb-8">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Date: {new Date(appointment.date).toLocaleString()}</p>
                <p>Véhicule: {appointment.vehicle.brand} {appointment.vehicle.model}</p>
                <p>Immatriculation: {appointment.vehicle.registration}</p>
                <p>Service: {appointment.service.name}</p>
                <p>Statut: {appointment.status}</p>
              </div>
              {appointment.status === 'RESERVED' && (
                <button
                  onClick={() => handleStartIntervention(appointment.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Démarrer l'intervention
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Interventions en cours</h2>
      {inProgressError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{inProgressError}</span>
        </div>
      )}
      <div className="grid gap-4">
        {inProgress.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            Aucune intervention en cours
          </div>
        ) : (
          inProgress.map((intervention) => (
            <div key={intervention.id} className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">Intervention #{intervention.id}</p>
                  <p className="text-gray-600">Véhicule: {intervention.appointment?.vehicle?.brand} {intervention.appointment?.vehicle?.model}</p>
                  <p className="text-gray-600">Immatriculation: {intervention.appointment?.vehicle?.registration}</p>
                  <p className="text-gray-600">Service: {intervention.appointment?.service?.name}</p>
                  <p className="text-gray-600">Description: {intervention.description}</p>
                  <p className="text-gray-600">Prix: {intervention.price} TND</p>
                  <p className="text-gray-600">Début: {new Date(intervention.startDate).toLocaleString()}</p>
                  {intervention.endDate && (
                    <p className="text-gray-600">Fin estimée: {new Date(intervention.endDate).toLocaleString()}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/progress/intervention/${intervention.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Voir détails
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
