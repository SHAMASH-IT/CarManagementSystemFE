import { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../../types';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour voir vos véhicules');
    }

    // Décoder le token pour obtenir l'ID de l'utilisateur
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const userData = JSON.parse(jsonPayload);
    return userData.sub;
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const userId = getUserIdFromToken();
      const data = await vehicleService.getVehiclesByUser(userId);
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicle: Vehicle) => {
    const userId = getUserIdFromToken();
    const vehicleWithUserId = { ...vehicle, userId };
    await vehicleService.addVehicle(vehicleWithUserId);
    fetchVehicles();
  };

  const updateVehicle = async (id: number, vehicle: Vehicle) => {
    const userId = getUserIdFromToken();
    const vehicleWithUserId = { ...vehicle, userId };
    await vehicleService.updateVehicle(id, vehicleWithUserId);
    fetchVehicles();
  };

  const deleteVehicle = async (id: number) => {
    await vehicleService.deleteVehicle(id);
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle, fetchVehicles };
}; 