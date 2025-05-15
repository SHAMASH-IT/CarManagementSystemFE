import type { Service } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export const serviceService = {
  getAllServices: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour voir les services');
    }

    const res = await fetch(`${API_URL}/service`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des services');
    return res.json();
  },

  getServiceById: async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Vous devez être connecté pour voir les services');
    }

    const res = await fetch(`${API_URL}/service/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération du service');
    return res.json();
  }
}; 