import type { Vehicle } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export const vehicleService = {
  getVehiclesByUser: async (userId: number) => {
    const res = await fetch(`${API_URL}/users/vehicle/user/${userId}`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des véhicules');
    return res.json();
  },
  addVehicle: async (vehicle: Vehicle) => {
    const res = await fetch(`${API_URL}/users/vehicle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) throw new Error('Erreur lors de l\'ajout du véhicule');
    return res.json();
  },
  updateVehicle: async (id: number, vehicle: Vehicle) => {
    const res = await fetch(`${API_URL}/users/vehicle/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) throw new Error('Erreur lors de la modification du véhicule');
    return res.json();
  },
  deleteVehicle: async (id: number) => {
    const res = await fetch(`${API_URL}/users/vehicle/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression du véhicule');
    return res.json();
  },
}; 