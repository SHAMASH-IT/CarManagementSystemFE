'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService, Order, CreateOrderDto, UpdateOrderDto } from '../service/OrderService';

// Intervalle de rafraîchissement en millisecondes (par exemple, toutes les 5 secondes)
const REFRESH_INTERVAL = 5000;

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      // Ne montrer le chargement que lors du chargement initial
      if (isInitialLoad) {
        setLoading(true);
      }
      console.log('Récupération des commandes...');
      const data = await orderService.getOrders();
      console.log('Commandes récupérées:', data);
      setOrders(data);
      setError(null);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Erreur lors du chargement des commandes');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [isInitialLoad]);

  useEffect(() => {
    // Chargement initial
    fetchOrders();

    // Mettre en place l'intervalle de rafraîchissement
    const intervalId = setInterval(fetchOrders, REFRESH_INTERVAL);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
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

  const completeOrder = async (id: number) => {
    try {
      const completedOrder = await orderService.completeOrder(id);
      await fetchOrders(); // Rafraîchir la liste après la complétion
      return completedOrder;
    } catch (err) {
      console.error('Erreur lors de la complétion de la commande:', err);
      setError('Erreur lors de la complétion de la commande');
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
    completeOrder,
    refreshOrders: fetchOrders
  };
}; 