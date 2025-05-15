import type { Vehicle } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export const vehicleService = {
  getVehiclesByUser: async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour voir vos véhicules');
    }

    const res = await fetch(`${API_URL}/users/vehicle/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des véhicules');
    return res.json();
  },
  addVehicle: async (vehicle: Vehicle) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour ajouter un véhicule');
    }

    const res = await fetch(`${API_URL}/users/vehicle`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) throw new Error('Erreur lors de l\'ajout du véhicule');
    return res.json();
  },
  updateVehicle: async (id: number, vehicle: Vehicle) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour modifier un véhicule');
    }

    const res = await fetch(`${API_URL}/users/vehicle/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) throw new Error('Erreur lors de la modification du véhicule');
    return res.json();
  },
  deleteVehicle: async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour supprimer un véhicule');
    }

    const res = await fetch(`${API_URL}/users/vehicle/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression du véhicule');
    return res.json();
  },
}; 