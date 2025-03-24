// src/services/parkingService.ts

import { transformParkingSlots } from './ApiTransformData';

const API_URL = process.env.NEXT_PUBLIC_APP_URL

/**
 * Fetches all parking slots from the API and transforms them to the frontend format
 * @returns Transformed parking slots data
 */
export const fetchParkingSlots = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/all-parkings`);
    const data = await response.json();
    return transformParkingSlots(data);
  } catch (error) {
    console.error('Error fetching parking slots:', error);
    throw error;
  }
};

/**
 * Updates the status of a parking slot
 * @param id - The ID of the parking slot to update
 * @param status - The new status ('EMPTY' or 'OCCUPIED')
 * @returns The updated parking slot data
 */
export const updateParkingSlotStatus = async (id: number, status: 'EMPTY' | 'OCCUPIED') => {
  try {
    const response = await fetch(`${API_URL}/parking/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating parking slot:', error);
    throw error;
  }
};

/**
 * Assigns a vehicle to a parking slot
 * @param locationId - The ID of the parking location
 * @param vehicleId - The ID of the vehicle
 * @returns The created position data
 */
export const assignVehicleToParking = async (locationId: number, vehicleId: number) => {
  try {
    const response = await fetch(`${API_URL}/position`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locationId, vehicleId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error assigning vehicle to parking:', error);
    throw error;
  }
};

/**
 * Removes a vehicle from a parking slot
 * @param positionId - The ID of the position to remove
 * @returns Success status
 */
export const removeVehicleFromParking = async (positionId: number) => {
  try {
    const response = await fetch(`${API_URL}/position/${positionId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error removing vehicle from parking:', error);
    throw error;
  }
};

/**
 * Fetches all parking areas
 * @returns List of parking areas
 */
export const fetchParkingAreas = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/areas`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching parking areas:', error);
    throw error;
  }
};

/**
 * Gets parking usage statistics
 * @returns Parking usage statistics
 */
export const getParkingStats = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching parking statistics:', error);
    throw error;
  }
};
