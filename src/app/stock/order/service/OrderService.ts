import axios from 'axios';

const API_URL = 'http://localhost:3005/stock';

export interface Piece {
  id: number;
  name: string;
  marque: string;
  stock: number;
  price: number;
  categoryId: number;

}

export interface OrderPiece {
  id: number;
  orderId: number;
  pieceId: number;
  quantity: number;
  piece?: Piece;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface Order {
  id: number;
  date: Date;
  status: string;
  ordertype: string;
  userId?: number;
  user?: User;
  orderPieces?: OrderPiece[];
}

export interface CreateOrderDto {
  pieces: { pieceId: number, quantity: number }[];
  userId?: number;
}

export interface UpdateOrderDto {
  status?: string;
  quantity?: number;
  date?: Date;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
}
const getProviderIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const userData = JSON.parse(jsonPayload);
    return userData?.sub ? parseInt(userData.sub) : null;
  } catch (error) {
    console.error("Erreur de décodage du token:", error);
    return null;
  }
};
export const orderService = {
 async getPiecesByProvider(): Promise<Piece[]> {
  try {
    const providerId = getProviderIdFromToken();;
    console.log('Provider ID:', providerId); // Ajoutez ce log
    
    if (!providerId) throw new Error("Provider non identifié");
    
    const url = `${API_URL}/pieces/provider/${providerId}`;
    console.log('Request URL:', url); // Ajoutez ce log
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw error;
  }
},

  // Corrigez la méthode getOrdersByProvider
async getOrdersByProvider(): Promise<Order[]> {
  try {
    const providerId = getProviderIdFromToken();
    if (!providerId) throw new Error("Provider non identifié");
    
    // Utilisez le bon endpoint
    const response = await axios.get(`${API_URL}/orders/buying/provider/${providerId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
},
 async placeOrder(dto: CreateOrderDto): Promise<Order> {
  try {
    const payload = {
      pieces: dto.pieces,
      userId: dto.userId,
    };

    console.log('Envoi de la commande:', payload);
    const response = await axios.post(`${API_URL}/buying`, payload);
    console.log('Réponse de la commande:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur Axios détaillée:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
    } else if (error instanceof Error) {
      console.error('Erreur générique:', error.message);
    } else {
      console.error('Erreur inconnue:', error);
    }

    throw error; // Re-lancer l'erreur pour gestion plus haut si besoin
  }},

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
      const response = await axios.patch(`${API_URL}/buying/cancel/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      throw error;
    }
  },

  async completeOrder(id: number): Promise<Order> {
    try {
      const response = await axios.patch(`${API_URL}/buying/complete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la complétion de la commande:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/buying`);
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
  },

  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      return [];
    }
  }
};
