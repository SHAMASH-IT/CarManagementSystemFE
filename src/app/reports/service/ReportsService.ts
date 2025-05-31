import axios from 'axios';
import { Statistics, AppointmentReport } from '../types';

// Utiliser l'URL de l'API backend
const API_URL = 'http://localhost:3005';

// Configuration d'Axios avec les headers CORS
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// Intercepteur pour logger toutes les requêtes
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
    baseURL: request.baseURL
  });
  return request;
});

// Intercepteur pour logger toutes les réponses
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      config: {
        url: response.config.url,
        method: response.config.method,
        baseURL: response.config.baseURL
      }
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    throw error;
  }
);

export class ReportsService {
  static async getProviderStatistics(providerId: number): Promise<Statistics> {
    try {
      console.log('Fetching statistics for provider:', providerId);
      const url = `/reports/provider/${providerId}/statistics`;
      console.log('Request URL:', url);
      const response = await axiosInstance.get(url);
      console.log('Raw statistics response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider statistics:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        });
      }
      throw error;
    }
  }

  static async getProviderAppointments(providerId: number): Promise<AppointmentReport> {
    try {
      console.log('Fetching appointments for provider:', providerId);
      const url = `/reports/appointments/provider/${providerId}`;
      console.log('Request URL:', url);
      const response = await axiosInstance.get(url);
      console.log('Raw appointments response:', response);
      console.log('Appointments data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider appointments:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        });
      }
      throw error;
    }
  }

  static async getProviderAppointmentsByDate(providerId: number, date: string): Promise<AppointmentReport> {
    try {
      console.log('Fetching appointments by date for provider:', providerId, 'date:', date);
      const url = `/reports/appointments/${providerId}/specific-day?date=${date}`;
      console.log('Request URL:', url);
      const response = await axiosInstance.get(url);
      console.log('Raw appointments by date response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider appointments by date:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        });
      }
      throw error;
    }
  }

  static async getProviderAppointmentsLast28Days(providerId: number): Promise<AppointmentReport> {
    try {
      console.log('Fetching last 28 days appointments for provider:', providerId);
      const url = `/reports/appointments/${providerId}/last-28-days`;
      console.log('Request URL:', url);
      const response = await axiosInstance.get(url);
      console.log('Raw last 28 days appointments response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider appointments last 28 days:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        });
      }
      throw error;
    }
  }
}
