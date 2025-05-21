import { Status } from '../../progress/services/progress.service';

export interface Intervention {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  status: Status;
  appointmentId: number;
  rate?: number;
  commentaire?: string;
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
      user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
    };
    service: {
      id: number;
      name: string;
      provider?: {
        id: number;
        name: string;
        email: string;
        phone: string;
      };
    };
  };
  Invoice?: {
    id: number;
    total: number;
    description: string;
    createdAt: string;
  }[];
} 