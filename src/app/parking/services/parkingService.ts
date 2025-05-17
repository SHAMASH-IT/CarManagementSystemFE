import { transformParkingSlots } from './ApiTransformData';

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

// Récupère tous les emplacements de parking
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

// Met à jour le statut d'une place de parking
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

// Assigne un véhicule à une place de parking
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

// Retire un véhicule d'une place de parking
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

// Récupère toutes les zones de parking
export const fetchParkingAreas = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/areas`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching parking areas:', error);
    throw error;
  }
};

// Récupère les statistiques de parking
export const getParkingStats = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching parking statistics:', error);
    throw error;
  }
};

// Récupère tous les emplacements
export const fetchAllLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/parking/all-parkings`);
    const data = await response.json();
    // Extraire toutes les locations de tous les parkings
    const allLocations = data.flatMap((parking: any) => parking.locations);
    return transformParkingSlots(allLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Crée un nouveau parking
export const createParking = async (parkingData: { name: string; places: number; serviceId?: number }) => {
  try {
    const response = await fetch(`${API_URL}/parking/create-parking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parkingData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création du parking');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating parking:', error);
    throw error;
  }
};

// Met à jour un parking existant
export const updateParking = async (id: number, parkingData: { name?: string; places?: number }) => {
  try {
    const response = await fetch(`${API_URL}/parking/edit-parking/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parkingData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du parking');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating parking:', error);
    throw error;
  }
};

// Supprime un parking
export const deleteParking = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/parking/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du parking');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting parking:', error);
    throw error;
  }
};

// Récupère les parkings en fonction du rôle de l'utilisateur
export const getParkingsByUserRole = async (userId: number) => {
  try {
    console.log('🔍 Fetching parkings for user:', userId)
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/parking/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ API Error:', errorData)
      throw new Error(errorData.message || 'Failed to fetch parkings')
    }

    const data = await response.json()
    console.log('📦 Parkings fetched:', data)
    return data
  } catch (error) {
    console.error('❌ Error fetching parkings:', error)
    throw error
  }
}
