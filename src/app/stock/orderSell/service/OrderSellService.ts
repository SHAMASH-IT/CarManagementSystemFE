/**
 * Service pour gérer les appels API des ventes
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export interface OrderPiece {
  pieceId: number;
  quantity: number;
  piece?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
}

export interface ClientInfo {
  name: string;
  phone: string;
}

export interface CreateOrderSellRequest {
  pieces: OrderPiece[];
  clientInfo: ClientInfo;
  ordertype: 'SELLING';
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Order {
  id: number;
  date: string;
  status: string;
  ordertype: string;
  clientInfo?: ClientInfo;
  orderPieces?: OrderPiece[];
  total?: number;
  discount?: Discount;
}

export interface InvoiceItem {
  pieceId: number;
  pieceName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: number;
  total: number;
  description: string;
  orderId: number;
  clientInfo: ClientInfo;
  items?: InvoiceItem[];
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
}

class OrderSellService {
  async createOrder(data: Omit<CreateOrderSellRequest, 'ordertype'>) {
    try {
      console.log('Envoi des données:', { ...data, ordertype: 'SELLING' });
      const response = await axios.post<Order>(`${API_URL}/stock/selling`, {
        ...data,
        ordertype: 'SELLING'
      });
      console.log('Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur création commande:', error);
      if (axios.isAxiosError(error)) {
        console.error('Détails de l\'erreur:', error.response?.data);
      }
      throw error;
    }
  }

  async getOrders() {
    try {
      console.log('Récupération des commandes...');
      const response = await axios.get<Order[]>(`${API_URL}/stock/selling`);
      console.log('Commandes reçues:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération commandes:', error);
      throw error;
    }
  }

  async cancelOrder(id: number) {
    try {
      const response = await axios.patch<Order>(`${API_URL}/stock/selling/cancel/${id}`, {});
      return response.data;
    } catch (error) {
      console.error('Erreur annulation commande:', error);
      throw error;
    }
  }

  async completeOrder(id: number) {
    try {
      const response = await axios.patch<Order>(`${API_URL}/stock/selling/complete/${id}`, {});
      return response.data;
    } catch (error) {
      console.error('Erreur complétion commande:', error);
      throw error;
    }
  }

  async getInvoice(orderId: number) {
    try {
      const response = await axios.get<Invoice>(`${API_URL}/stock/invoice/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération facture:', error);
      throw error;
    }
  }
}

export const orderSellService = new OrderSellService();