import { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../../types';

export const useVehicles = (userId: number) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getVehiclesByUser(userId);
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicle: Vehicle) => {
    await vehicleService.addVehicle(vehicle);
    fetchVehicles();
  };

  const updateVehicle = async (id: number, vehicle: Vehicle) => {
    await vehicleService.updateVehicle(id, vehicle);
    fetchVehicles();
  };

  const deleteVehicle = async (id: number) => {
    await vehicleService.deleteVehicle(id);
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  return { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle, fetchVehicles };
}; 