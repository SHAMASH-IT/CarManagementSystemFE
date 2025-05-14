import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

export interface Notification {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  appointment?: {
    id: number;
    date: string;
    time: string;
    vehicle?: {
      id: number;
      brand: string;
      model: string;
    };
  };
  intervention?: {
    id: number;
    description: string;
    status: string;
  };
}

export const notificationService = {
  // Récupérer les notifications non lues
  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    try {
      console.log('=== DÉBUT RÉCUPÉRATION NOTIFICATIONS ===');
      console.log('User ID:', userId);
      
      const token = localStorage.getItem('token');
      console.log('Token présent:', !!token);
      
      const response = await axios.get(`${API_URL}/users/user/${userId}/unread`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('=== RÉPONSE DU SERVEUR ===');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.log('La réponse n\'est pas un tableau direct');
        return [];
      }
      
      console.log('La réponse est un tableau direct');
      console.log('Nombre de notifications:', response.data.length);
      return response.data;
      
    } catch (error) {
      console.error('=== ERREUR RÉCUPÉRATION NOTIFICATIONS ===');
      console.error('Erreur complète:', error);
      if (axios.isAxiosError(error)) {
        console.error('Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      return [];
    } finally {
      console.log('=== FIN RÉCUPÉRATION NOTIFICATIONS ===');
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (userId: number): Promise<{ message: string; updatedCount: number }> => {
    try {
      console.log('=== MARQUER TOUT COMME LU ===');
      console.log('User ID:', userId);
      
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/users/user/${userId}/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  },

  // Compter les notifications non lues
  countUnreadNotifications: async (userId: number): Promise<number> => {
    try {
      console.log('=== COMPTER NOTIFICATIONS NON LUES ===');
      console.log('User ID:', userId);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/user/${userId}/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Réponse:', response.data);
      return response.data.unreadCount;
    } catch (error) {
      console.error('Erreur lors du comptage:', error);
      return 0;
    }
  }
}; 