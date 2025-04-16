import axios from 'axios';

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

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005/api';

export const progressService = {
  getReservedAppointments: async (): Promise<ReservedAppointment[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/appointments/reserved`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  startIntervention: async (appointmentId: number, data: StartInterventionDto): Promise<Intervention> => {
    const response = await axios.post(`${API_URL}/progress/intervention/start/${appointmentId}`, data);
    return response.data;
  },

  getIntervention: async (id: number): Promise<Intervention> => {
    const response = await axios.get(`${API_URL}/progress/${id}`);
    return response.data;
  },

  updateIntervention: async (id: number, data: UpdateInterventionDto): Promise<Intervention> => {
    const response = await axios.patch(`${API_URL}/progress/update/${id}`, data);
    return response.data;
  },

  completeIntervention: async (id: number): Promise<Intervention> => {
    const response = await axios.patch(`${API_URL}/progress/intervention/complete/${id}`);
    return response.data;
  },

  getInProgressInterventions: async (): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${API_URL}/progress/interventions/in-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching in-progress interventions:', error);
      throw error;
    }
  },
  
}; 