import axios from 'axios';

const API_URL = 'http://localhost:3005/stock';

export interface Piece {
  id: number;
  name: string;
  stock: number;
  categoryId: number;
}

export interface CreateOrderDto {
  pieceName: string;
  userId: number;
  quantity: number;
}

export interface UpdateOrderDto {
  status?: string;
  quantity?: number;
  date?: Date;
}

export interface Order {
  id: number;
  date: Date;
  status: string;
  quantity: number;
  userId: number;
  pieceId: number;
}

export const orderService = {
  async placeOrder(dto: CreateOrderDto): Promise<Order> {
    try {
      console.log('Envoi de la commande:', dto);
      const response = await axios.post(`${API_URL}/order-by-name`, dto);
      console.log('Réponse de la commande:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      if (axios.isAxiosError(error)) {
        console.error('Détails de l\'erreur:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<Order> {
    try {
      const response = await axios.patch(`${API_URL}/orders/${id}`, dto);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  },

  async cancelOrder(id: number): Promise<Order> {
    try {
      const response = await axios.patch(`${API_URL}/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      throw error;
    }
  },

  async completeOrder(id: number): Promise<Order> {
    try {
      const response = await axios.patch(`${API_URL}/orders/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la complétion de la commande:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return [];
    }
  },

  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }
  },

  async getAllPieces(): Promise<Piece[]> {
    try {
      const response = await axios.get(`${API_URL}/pieces`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces:', error);
      throw error;
    }
  }
}; 
