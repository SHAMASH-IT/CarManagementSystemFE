export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
}

export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  rates: ProviderRate[];
}

export interface Appointment {
  id: number;
  date: string;
  vehicle: Vehicle;
  service: Service;
  provider: Provider;
  status: string;
  totalAmount: number;
}

export interface AppointmentReport {
  appointments: Appointment[];
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface ProviderRate {
  id: number;
  rating: number;
  comment: string;
  date: string;
}

export interface SentimentAnalysis {
  id: number;
  appointmentId: number;
  sentiment: string;
  score: number;
  date: string;
}

export interface Statistics {
  clientCount: number;
  visibleVehicleCount: number;
  providerAverageRates: number;
}

export interface FinancialReport {
  total: number;
  last28Days: number;
  last70Days: number;
  last90Days: number;
  year: number;
}

export interface ServiceFinancialReport {
  serviceId: number;
  total: number;
  last28Days: number;
  last70Days: number;
  last90Days: number;
  year: number;
} 