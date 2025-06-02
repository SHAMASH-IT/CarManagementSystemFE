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

// Nouvelles interfaces pour la dashboard admin
export interface Overview {
  totalClients: number;
  totalProviders: number;
  totalVehicles: number;
  totalRevenue: number;
  last28DaysRevenue: number;
  last70DaysRevenue: number;
  last90DaysRevenue: number;
  yearlyRevenue: number;
}

export interface ServiceStats {
  serviceId: number;
  serviceName: string;
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  averageRating: number;
  ratingCount: number;
}

export interface ProviderStats {
  providerId: number;
  providerName: string;
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  averageRating: number;
  ratingCount: number;
}

export interface AppointmentStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  inProgress: number;
  reserved: number;
  last28Days: number;
  last70Days: number;
  last90Days: number;
}

export interface LoyalClient {
  clientId: number;
  clientName: string;
  appointmentCount: number;
}

export interface PeriodStats {
  activeVehicles: number;
  activeClients: number;
  loyalClients: LoyalClient[];
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

export interface AdminDashboardData {
  overview: Overview;
  services: ServiceStats[];
  providers: ProviderStats[];
  appointments: AppointmentStats;
  periodStats: PeriodStats;
} 