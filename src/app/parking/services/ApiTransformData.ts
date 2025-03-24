/**
 * ApiTransformData.ts
 * 
 * Utility functions to transform data between backend (Prisma) models
 * and frontend types.
 */

import {
    Appointment,
    User,
    CalendarEvent,
    ApiAppointment,
    ApiUser,
    APPOINTMENT_STATUS,
    USER_ROLES,
    Vehicle,
    Service
  } from '../../types'; // Assuming your types are defined in a types.ts file
  
  /**
   * Transforms a Prisma appointment to the frontend Appointment type
   * @param apiAppointment - The appointment from the API
   * @param vehicles - Optional vehicle data to include full details
   * @param services - Optional service data to include full details
   * @returns The transformed Appointment for the frontend
   */
  export const transformAppointment = (
    apiAppointment: ApiAppointment,
    vehicles?: Vehicle[],
    services?: Service[]
  ): Appointment => {
    // Find the corresponding vehicle and service for additional details
    const vehicle = vehicles?.find(v => v.id === apiAppointment.vehicleId) || apiAppointment.vehicle;
    const service = services?.find(s => s.id === apiAppointment.serviceId) || apiAppointment.service;
  
    // Map status values (backend enum to frontend constants)
    let status: string;
    switch (apiAppointment.status) {
      case 'RESERVED':
        status = APPOINTMENT_STATUS.CONFIRMED;
        break;
      case 'PENDING':
        status = APPOINTMENT_STATUS.PENDING;
        break;
      case 'CANCELLED':
        status = APPOINTMENT_STATUS.CANCELED;
        break;
      default:
        status = APPOINTMENT_STATUS.PENDING;
    }
  
    return {
      id: apiAppointment.id.toString(),
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registration})` : 'Unknown Vehicle',
      clientName: 'Client', // Note: This needs to be populated from user data if available
      service: service ? service.name : 'Unknown Service',
      date: new Date(apiAppointment.date).toLocaleDateString(),
      status
    };
  };
  
  /**
   * Transforms a Prisma appointment to a CalendarEvent type for the calendar view
   * @param apiAppointment - The appointment from the API
   * @param vehicles - Optional vehicle data to include full details
   * @param services - Optional service data to include full details
   * @returns The transformed CalendarEvent
   */
  export const transformAppointmentToCalendarEvent = (
    apiAppointment: ApiAppointment,
    vehicles?: Vehicle[],
    services?: Service[]
  ): CalendarEvent => {
    const vehicle = vehicles?.find(v => v.id === apiAppointment.vehicleId) || apiAppointment.vehicle;
    const service = services?.find(s => s.id === apiAppointment.serviceId) || apiAppointment.service;
  
    // Creating Date objects for start and end
    const appointmentDate = new Date(apiAppointment.date);
    const appointmentTime = new Date(apiAppointment.time);
  
    // Combine date and time into a single Date object
    const startDate = new Date(appointmentDate);
    startDate.setHours(appointmentTime.getHours(), appointmentTime.getMinutes());
  
    // End time is 1 hour after start time (you can adjust this logic as needed)
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
  
    return {
      id: apiAppointment.id.toString(),
      title: service ? service.name : 'Appointment',
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown Vehicle',
      start: startDate,
      end: endDate,
      vehicle: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown Vehicle',
      service: service ? service.name : 'Unknown Service',
      additionalInfo: `Status: ${apiAppointment.status}`
    };
  };
  
  /**
   * Transforms a Prisma user to the frontend User type
   * @param apiUser - The user from the API
   * @returns The transformed User for the frontend
   */
  export const transformUser = (apiUser: ApiUser): User => {
    // Map role values (backend enum to frontend constants)
    let role: string;
    switch (apiUser.role) {
      case 'ADMIN':
        role = USER_ROLES.ADMINISTRATEUR;
        break;
      case 'PROVIDER':
        role = USER_ROLES.MÉCANICIEN;
        break;
      default:
        role = USER_ROLES.CLIENT;
    }
  
    return {
      id: apiUser.id.toString(),
      fullName: `${apiUser.firstName} ${apiUser.lastName}`,
      email: apiUser.email,
      phone: apiUser.phone || '',
      role,
      createdAt: new Date(apiUser.createdAt).toLocaleDateString()
    };
  };
  
  /**
   * Transforms backend parking data to frontend format
   * @param location - The location data from the API
   * @returns Transformed parking slot data
   */
  export const transformParkingSlot = (location: any) => {
    return {
      id: location.id,
      parkingName: location.name || 'Unknown',
      blocName: location.parking?.name || 'Unknown',
      status: location.status === 'EMPTY' ? 'Disponible' : 'Occupée'
    };
  };
  
  /**
   * Transforms an array of Prisma appointments to frontend Appointment type
   * @param apiAppointments - The array of appointments from the API
   * @param vehicles - Optional vehicle data to include full details
   * @param services - Optional service data to include full details
   * @returns An array of transformed Appointments
   */
  export const transformAppointments = (
    apiAppointments: ApiAppointment[],
    vehicles?: Vehicle[],
    services?: Service[]
  ): Appointment[] => {
    return apiAppointments.map(appointment => transformAppointment(appointment, vehicles, services));
  };
  
  /**
   * Transforms an array of Prisma appointments to frontend CalendarEvent type
   * @param apiAppointments - The array of appointments from the API
   * @param vehicles - Optional vehicle data to include full details
   * @param services - Optional service data to include full details
   * @returns An array of transformed CalendarEvents
   */
  export const transformAppointmentsToCalendarEvents = (
    apiAppointments: ApiAppointment[],
    vehicles?: Vehicle[],
    services?: Service[]
  ): CalendarEvent[] => {
    return apiAppointments.map(appointment => transformAppointmentToCalendarEvent(appointment, vehicles, services));
  };
  
  /**
   * Transforms an array of Prisma users to frontend User type
   * @param apiUsers - The array of users from the API
   * @returns An array of transformed Users
   */
  export const transformUsers = (apiUsers: ApiUser[]): User[] => {
    return apiUsers.map(transformUser);
  };
  
  /**
   * Transforms an array of parking locations to frontend format
   * @param locations - The array of locations from the API
   * @returns An array of transformed parking slots
   */
  export const transformParkingSlots = (locations: any[]): any[] => {
    return locations.map(transformParkingSlot);
  };
