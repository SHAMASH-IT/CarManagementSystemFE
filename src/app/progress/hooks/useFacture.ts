import { useState, useEffect } from 'react';
import { progressService } from '../services/progress.service';

interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  matf: string;
}

interface ProviderInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface FactureInfo {
  client: ClientInfo;
  provider: ProviderInfo;
}

export const useFacture = (interventionId: number) => {
  const [factureInfo, setFactureInfo] = useState<FactureInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactureInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await progressService.getClientAndProviderFromIntervention(interventionId);
        
        if (!data?.appointment) {
          throw new Error('Les informations de la facture sont incomplètes');
        }

        setFactureInfo({
          client: data.appointment.vehicle.user,
          provider: data.appointment.service.provider
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des informations de la facture:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des informations de la facture');
      } finally {
        setLoading(false);
      }
    };

    fetchFactureInfo();
  }, [interventionId]);

  return { factureInfo, loading, error };
}; 