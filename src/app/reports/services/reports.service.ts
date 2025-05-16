import axios from 'axios';
import { AppointmentResponse, Appointment } from '../types/appointment.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export const ReportsService = {
  // Statistics
  getClientCount: async () => {
    console.log('Fetching client count...');
    const response = await axios.get(`${API_URL}/reports/clients/count`);
    console.log('Client count response:', response.data);
    return response.data.totalClients;
  },

  getVisibleVehicleCount: async () => {
    console.log('Fetching visible vehicle count...');
    const response = await axios.get(`${API_URL}/reports/vehicles/visible/count`);
    console.log('Visible vehicle count response:', response.data);
    return response.data.totalVisibleVehicles;
  },

  getProviderAverageRate: async () => {
    console.log('Fetching provider average rate...');
    const response = await axios.get(`${API_URL}/reports/average-rates`);
    console.log('Provider average rate response:', response.data);
    return response.data;
  },

  // Appointments
  getTodayAppointments: async (): Promise<AppointmentResponse> => {
    console.log('Fetching today appointments...');
    const response = await axios.get(`${API_URL}/reports/today`);
    console.log('Today appointments response:', response.data);
    return {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      appointments: response.data.appointments.map((appointment: any): Appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        vehicle: appointment.vehicle,
        service: appointment.service,
        interventions: appointment.interventions || []
      }))
    };
  },

  getLast28DaysAppointments: async (): Promise<AppointmentResponse> => {
    console.log('Fetching last 28 days appointments...');
    const response = await axios.get(`${API_URL}/reports/last-28-days`);
    console.log('Last 28 days appointments response:', response.data);
    return {
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      appointments: response.data.appointments.map((appointment: any): Appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        vehicle: appointment.vehicle,
        service: appointment.service,
        interventions: appointment.interventions || []
      }))
    };
  },

  getLast70DaysAppointments: async (): Promise<AppointmentResponse> => {
    console.log('Fetching last 70 days appointments...');
    const response = await axios.get(`${API_URL}/reports/last-70-days`);
    console.log('Last 70 days appointments response:', response.data);
    return {
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      appointments: response.data.appointments.map((appointment: any): Appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        vehicle: appointment.vehicle,
        service: appointment.service,
        interventions: appointment.interventions || []
      }))
    };
  },

  getLast90DaysAppointments: async (): Promise<AppointmentResponse> => {
    console.log('Fetching last 90 days appointments...');
    const response = await axios.get(`${API_URL}/reports/last-90-days`);
    console.log('Last 90 days appointments response:', response.data);
    return {
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      appointments: response.data.appointments.map((appointment: any): Appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        vehicle: appointment.vehicle,
        service: appointment.service,
        interventions: appointment.interventions || []
      }))
    };
  },

  getLastYearAppointments: async (): Promise<AppointmentResponse> => {
    console.log('Fetching last year appointments...');
    const response = await axios.get(`${API_URL}/reports/last-year`);
    console.log('Last year appointments response:', response.data);
    return {
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      appointments: response.data.appointments.map((appointment: any): Appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        vehicle: appointment.vehicle,
        service: appointment.service,
        interventions: appointment.interventions || []
      }))
    };
  },

  // Financial reports
  getTotalInvoicesAmount: async () => {
    console.log('Fetching total invoices amount...');
    const response = await axios.get(`${API_URL}/reports/invoices/total`);
    console.log('Total invoices amount response:', response.data);
    return response.data;
  },

  getLast28DaysInvoicesAmount: async () => {
    console.log('Fetching last 28 days invoices amount...');
    const response = await axios.get(`${API_URL}/reports/invoices/last28days`);
    console.log('Last 28 days invoices amount response:', response.data);
    return response.data;
  },

  getLast70DaysInvoicesAmount: async () => {
    console.log('Fetching last 70 days invoices amount...');
    const response = await axios.get(`${API_URL}/reports/invoices/last70days`);
    console.log('Last 70 days invoices amount response:', response.data);
    return response.data;
  },

  getLast90DaysInvoicesAmount: async () => {
    console.log('Fetching last 90 days invoices amount...');
    const response = await axios.get(`${API_URL}/reports/invoices/last90days`);
    console.log('Last 90 days invoices amount response:', response.data);
    return response.data;
  },

  getYearInvoicesAmount: async () => {
    console.log('Fetching year invoices amount...');
    const response = await axios.get(`${API_URL}/reports/invoices/year`);
    console.log('Year invoices amount response:', response.data);
    return response.data;
  },

  // Service-specific reports
  getTotalInvoicesAmountByService: async (serviceId: number) => {
    const response = await axios.get(`${API_URL}/reports/invoices/service/${serviceId}/total`);
    return response.data;
  },

  getLast28DaysInvoicesByService: async (serviceId: number) => {
    const response = await axios.get(`${API_URL}/reports/invoices/service/${serviceId}/last28days`);
    return response.data;
  },

  getLast70DaysInvoicesByService: async (serviceId: number) => {
    const response = await axios.get(`${API_URL}/reports/invoices/service/${serviceId}/last70days`);
    return response.data;
  },

  getLast90DaysInvoicesByService: async (serviceId: number) => {
    const response = await axios.get(`${API_URL}/reports/invoices/service/${serviceId}/last90days`);
    return response.data;
  },

  getYearInvoicesByService: async (serviceId: number) => {
    const response = await axios.get(`${API_URL}/reports/invoices/service/${serviceId}/year`);
    return response.data;
  }
}; 