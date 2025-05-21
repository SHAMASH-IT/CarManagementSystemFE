import axios from 'axios';
import { authService } from '../../login/services/auth.service';

export enum Status {
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Intervention {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  status: Status;
  appointmentId: number;
  interventionPieces?: {
    id: number;
    pieceId: number;
    quantity: number;
    totalPrice: number;
    piece?: {
      id: number;
      name: string;
      price: number;
    };
  }[];
  appointment?: {
    id: number;
    status: Status;
    date: string;
    vehicle: {
      id: number;
      brand: string;
      model: string;
      registration: string;
    };
    service: {
      id: number;
      name: string;
    };
  };
}

export interface StartInterventionDto {
  description: string;
  endDate: string;
  price: number;
  pieces?: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateInterventionDto {
  description?: string;
  endDate?: string;
  price?: number;
  status?: Status;
  pieces?: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export interface ReservedAppointment {
  id: number;
  date: string;
  status: Status;
  vehicle: {
    id: number;
    brand: string;
    model: string;
    registration: string;
  };
  service: {
    id: number;
    name: string;
  };
}

export interface ClientProviderInfo {
  appointment: {
    vehicle: {
      user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        matf: string;
      };
    };
    service: {
      provider: {
        id: number;
        name: string;
        email: string;
        phone: string;
      };
    };
  };
}

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005/api';

// Ajouter l'intercepteur pour inclure le token dans toutes les requêtes
axios.interceptors.request.use(
  (config) => {
    const token = authService.getCurrentToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class ProgressService {
  async getReservedAppointments(): Promise<ReservedAppointment[]> {
    try {
      const response = await axios.get(`${API_URL}/progress/appointments/reserved`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async startIntervention(appointmentId: number, data: StartInterventionDto): Promise<Intervention> {
    const response = await axios.post(`${API_URL}/progress/intervention/start/${appointmentId}`, data);
    return response.data;
  }

  async getIntervention(id: number): Promise<Intervention> {
    const response = await axios.get(`${API_URL}/progress/${id}`);
    return response.data;
  }

  async updateIntervention(id: number, data: UpdateInterventionDto): Promise<Intervention> {
    const response = await axios.patch(`${API_URL}/progress/update/${id}`, data);
    return response.data;
  }

  async completeIntervention(id: number): Promise<Intervention> {
    const response = await axios.patch(`${API_URL}/progress/intervention/complete/${id}`);
    return response.data;
  }

  async getInProgressInterventions(): Promise<Intervention[]> {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/in-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching in-progress interventions:', error);
      throw error;
    }
  }

  async getCompletedInterventions(): Promise<Intervention[]> {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/completed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed interventions:', error);
      throw error;
    }
  }

  async getProviderInterventions(): Promise<Intervention[]> {
    try {
      const response = await axios.get(`${API_URL}/progress/intervention/provider`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider interventions:', error);
      throw error;
    }
  }

  async getUserInterventions(userId: number): Promise<Intervention[]> {
    try {
      const response = await axios.get(`${API_URL}/progress/intervention/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user interventions:', error);
      throw error;
    }
  }

  async getProviderReservedAppointments(providerId: number): Promise<ReservedAppointment[]> {
    try {
      console.log('Fetching appointments for provider:', providerId);
      const response = await axios.get(`${API_URL}/appointments/today/${providerId}`);
      
      // Log de la réponse
      console.log('Response data:', response.data);

      // Vérifier si nous avons des rendez-vous
      if (!response.data || !response.data.appointments) {
        console.log('No appointments found');
        return [];
      }

      // Convertir les dates en format local
      const appointments = response.data.appointments.map((apt: any) => ({
        ...apt,
        date: new Date(apt.date).toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      console.log('Processed appointments:', appointments);
      return appointments;
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      throw error;
    }
  }

  async getClientAndProviderFromIntervention(interventionId: number): Promise<ClientProviderInfo> {
    const response = await fetch(`${API_URL}/progress/intervention/${interventionId}/client-provider`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des informations');
    }

    return response.json();
  }
}

export const progressService = new ProgressService();
