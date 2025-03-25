import { useState, useEffect } from 'react';
import { fetchAllLocations } from '../services/parkingService';

interface ParkingSlot {
  id: number;
  parkingName: string;
  status: string;
}

export default function useParking() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParkingSlots = async () => {
      try {
        const data = await fetchAllLocations();
        setParkingSlots(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des places de parking');
        console.error('Error loading parking slots:', err);
      } finally {
        setLoading(false);
      }
    };

    loadParkingSlots();
  }, []);

  return { parkingSlots, loading, error };
}
