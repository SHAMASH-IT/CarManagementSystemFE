import { useState, useEffect, useCallback } from 'react';
import { fetchAllLocations } from '../services/parkingService';

interface ParkingSlot {
  id: number;
  name: string;
  places: number;
  serviceId: number;
}

export default function useParking() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParkingSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllLocations();
      setParkingSlots(data);
      setError(null);
    } catch (err) {
      console.error('Error loading parking slots:', err);
      setError('Erreur lors du chargement des places de parking');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParkingSlots();
  }, [loadParkingSlots]);

  return { parkingSlots, loading, error, refreshParkingSlots: loadParkingSlots };
}
