'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService, Order, CreateOrderDto, UpdateOrderDto } from '../services/order.service';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Récupération des commandes...');
      const data = await orderService.getOrders();
      console.log('Commandes récupérées:', data);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (dto: CreateOrderDto) => {
    try {
      console.log('Création d\'une nouvelle commande:', dto);
      const newOrder = await orderService.placeOrder(dto);
      console.log('Nouvelle commande créée:', newOrder);
      await fetchOrders(); // Rafraîchir la liste après la création
      return newOrder;
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      setError('Erreur lors de la création de la commande');
      throw err;
    }
  };

  const updateOrder = async (id: number, dto: UpdateOrderDto) => {
    try {
      const updatedOrder = await orderService.updateOrder(id, dto);
      await fetchOrders(); // Rafraîchir la liste après la mise à jour
      return updatedOrder;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la commande:', err);
      setError('Erreur lors de la mise à jour de la commande');
      throw err;
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      const cancelledOrder = await orderService.cancelOrder(id);
      await fetchOrders(); // Rafraîchir la liste après l'annulation
      return cancelledOrder;
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
      setError('Erreur lors de l\'annulation de la commande');
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    placeOrder,
    updateOrder,
    cancelOrder,
    refreshOrders: fetchOrders
  };
}; 