import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export interface Service {
  id: number;
  name: string;
  description: string;
  providerId: number;
  provider?: {
    id: number;
    name: string;
    email: string;
  };
}

export const serviceService = {
  // Récupérer tous les services
  getAllServices: async (): Promise<Service[]> => {
    const response = await axios.get(`${API_URL}/service`);
    return response.data;
  },

  // Récupérer un service par son ID
  getServiceById: async (id: number): Promise<Service> => {
    const response = await axios.get(`${API_URL}/service/${id}`);
    return response.data;
  },

  // Créer un nouveau service
  createService: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const response = await axios.post(`${API_URL}/service`, serviceData);
    return response.data;
  },

  // Mettre à jour un service
  updateService: async (id: number, serviceData: Partial<Omit<Service, 'id'>>): Promise<Service> => {
    const response = await axios.put(`${API_URL}/service/${id}`, serviceData);
    return response.data;
  },

  // Supprimer un service
  deleteService: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/service/${id}`);
  }
}; 