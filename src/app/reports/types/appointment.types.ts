/**
 * Statuts possibles pour un rendez-vous
 */
export type AppointmentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RESERVED' | 'CONFIRMED';

/**
 * Interface représentant un utilisateur (client ou prestataire)
 */
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: 'ADMIN' | 'CLIENT' | 'PROVIDER' | 'SUPPLIER';
}

/**
 * Interface représentant un véhicule
 */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  registration: string;
  userId: number;
  user: User;
}

/**
 * Interface représentant un service
 */
export interface Service {
  id: number;
  name: string;
  description: string;
}

/**
 * Interface représentant une facture
 */
export interface Invoice {
  id: number;
  total: number;
  createdAt: string;
}

/**
 * Interface représentant une intervention
 */
export interface Intervention {
  id: number;
  rate?: number;
  Invoice?: Invoice[];
  commentaire?: string;
}

/**
 * Interface représentant un rendez-vous de service
 * @property id - Identifiant unique du rendez-vous
 * @property date - Date et heure du rendez-vous (format ISO)
 * @property status - Statut actuel du rendez-vous
 * @property vehicle - Informations sur le véhicule concerné
 * @property service - Service demandé (optionnel)
 * @property interventions - Interventions associées au rendez-vous (optionnel)
 */
export interface Appointment {
  id: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  vehicle: Vehicle;
  service: Service;
  interventions: Intervention[];
}

/**
 * Interface pour la réponse paginée des rendez-vous
 */
export interface PaginatedAppointments {
  appointments: Appointment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Interface pour les filtres de recherche de rendez-vous
 */
export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  providerId?: number;
  clientId?: number;
  vehicleId?: number;
  serviceId?: number;
}

export interface AppointmentResponse {
  startDate: string;
  endDate: string;
  appointments: Appointment[];
} 