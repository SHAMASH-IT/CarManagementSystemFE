import axios from 'axios';

const API_URL = 'http://localhost:3005';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;  // Le backend attend 'password' et s'occupe de le hasher
  phone: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  newPassword?: string;
  role?: string;
}

export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log('Réponse getAllUsers:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: CreateUserDto): Promise<User> => {
    try {
      console.log('Tentative de création d\'utilisateur avec les données:', {
        ...userData,
        password: '[REDACTED]'
      });
      
      const response = await axios.post(`${API_URL}/users`, userData);
      console.log('Réponse du serveur:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée lors de la création de l\'utilisateur:');
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Message d\'erreur:', error.response?.data);
        console.error('Config de la requête:', {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });
      } else {
        console.error('Erreur non-Axios:', error);
      }
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: number, userData: UpdateUserDto): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/users/${id}`, userData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }
}; 