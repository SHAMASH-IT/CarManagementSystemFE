import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/users?role=PROVIDER`);
      // Filtrer les utilisateurs pour ne garder que ceux avec le rôle PROVIDER
      const providersOnly = response.data.filter((user: Provider) => user.role === 'PROVIDER');
      setProviders(providersOnly);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des prestataires:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    providers,
    loading,
    error,
    fetchProviders
  };
}; 