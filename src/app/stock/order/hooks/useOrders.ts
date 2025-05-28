'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { orderService, Order, CreateOrderDto, UpdateOrderDto } from '../service/OrderService';

const REFRESH_INTERVAL = 5000;

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      if (isInitialLoad) setLoading(true);

      const data = await orderService.getOrdersByProvider();
      const formattedOrders = data.map(order => ({
        ...order,
        date: new Date(order.date),
      }));

      setOrders(formattedOrders);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erreur Axios:', {
          message: err.message,
          response: err.response?.data,
        });
      } else if (err instanceof Error) {
        console.error('Erreur générale:', err.message);
      } else {
        console.error('Erreur inconnue:', err);
      }
      setError('Erreur lors du chargement des commandes');
    } finally {
      if (isInitialLoad) {
  setLoading(false);
  setIsInitialLoad(false);
}
    }
  }, [isInitialLoad]);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const placeOrder = async (dto: CreateOrderDto) => {
    try {
      console.log("Création d'une nouvelle commande:", dto);
      const newOrder = await orderService.placeOrder(dto);
      console.log('Nouvelle commande créée:', newOrder);
      await fetchOrders();
      return newOrder;
    } catch (err: unknown) {
      handleError(err, 'Erreur lors de la création de la commande');
      throw err;
    }
  };

  const updateOrder = async (id: number, dto: UpdateOrderDto) => {
    try {
      const updatedOrder = await orderService.updateOrder(id, dto);
      await fetchOrders();
      return updatedOrder;
    } catch (err: unknown) {
      handleError(err, 'Erreur lors de la mise à jour de la commande');
      throw err;
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      const cancelledOrder = await orderService.cancelOrder(id);
      await fetchOrders();
      return cancelledOrder;
    } catch (err: unknown) {
      handleError(err, "Erreur lors de l'annulation de la commande");
      throw err;
    }
  };

  const completeOrder = async (id: number) => {
    try {
      const completedOrder = await orderService.completeOrder(id);
      await fetchOrders();
      return completedOrder;
    } catch (err: unknown) {
      handleError(err, 'Erreur lors de la complétion de la commande');
      throw err;
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(err)) {
      console.error(defaultMessage, {
        message: err.message,
        response: err.response?.data,
      });
    } else if (err instanceof Error) {
      console.error(defaultMessage, err.message);
    } else {
      console.error(defaultMessage, err);
    }
    setError(defaultMessage);
  };

  return {
    orders,
    loading,
    error,
    placeOrder,
    updateOrder,
    cancelOrder,
    completeOrder,
    refreshOrders: fetchOrders,
  };
};
