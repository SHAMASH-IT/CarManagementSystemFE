import axios from 'axios';
import { Intervention } from '../../progress/services/progress.service';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005/api';

export const historyService = {
  getCompletedInterventions: async (): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/completed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed interventions:', error);
      throw error;
    }
  },

  getInterventionDetails: async (id: number): Promise<Intervention> => {
    try {
      const response = await axios.get(`${API_URL}/progress/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching intervention details for ID ${id}:`, error);
      throw error;
    }
  },

  getInterventionsByVehicle: async (registration: string): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/vehicle/${registration}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching interventions for vehicle ${registration}:`, error);
      throw error;
    }
  }
}; 