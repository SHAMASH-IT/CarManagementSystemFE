export interface Appointment {
  id: number;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  provider?: {
    id: number;
    name: string;
  };
  client?: {
    id: number;
    name: string;
  };
  vehicle?: {
    id: number;
    brand: string;
    model: string;
  };
} 