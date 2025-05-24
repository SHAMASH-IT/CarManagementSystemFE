import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderSellService, CreateOrderSellRequest } from '../service/OrderSellService';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer l'état des ventes
 */
export type CreateOrderData = Omit<CreateOrderSellRequest, 'ordertype'>;

export const useOrderSell = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les commandes
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['sellOrders'],
    queryFn: () => orderSellService.getOrders(),
  });

  // Mutation pour créer une commande
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderData) => orderSellService.createOrder(data),
    onSuccess: async (data) => {
      console.log('Commande créée avec succès:', data);
      await queryClient.invalidateQueries({ queryKey: ['sellOrders'] });
      await refetch();
      toast.success('Commande créée avec succès');
    },
    onError: (error: any) => {
      console.error('Erreur création commande:', error);
      toast.error('Erreur lors de la création de la commande');
    },
  });

  // Mutation pour annuler une commande
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => orderSellService.cancelOrder(orderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sellOrders'] });
      await refetch();
      toast.success('Commande annulée avec succès');
    },
    onError: (error: any) => {
      console.error('Erreur annulation commande:', error);
      toast.error('Erreur lors de l\'annulation de la commande');
    },
  });

  // Mutation pour compléter une commande
  const completeOrderMutation = useMutation({
    mutationFn: (orderId: number) => orderSellService.completeOrder(orderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sellOrders'] });
      await refetch();
      toast.success('Commande complétée avec succès');
    },
    onError: (error: any) => {
      console.error('Erreur completion commande:', error);
      toast.error('Erreur lors de la completion de la commande');
    },
  });

  // Mutation pour récupérer une facture
  const getInvoiceMutation = useMutation({
    mutationFn: (orderId: number) => orderSellService.getInvoice(orderId),
    onError: (error: any) => {
      console.error('Erreur récupération facture:', error);
      toast.error('Erreur lors de la récupération de la facture');
    },
  });

  return {
    orders,
    isLoading,
    createOrder: (data: CreateOrderData, options?: { onSuccess?: () => void }) => 
      createOrderMutation.mutate(data, {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }
      }),
    isCreating: createOrderMutation.isPending,
    cancelOrder: cancelOrderMutation.mutate,
    isCancelling: cancelOrderMutation.isPending,
    completeOrder: completeOrderMutation.mutate,
    isCompleting: completeOrderMutation.isPending,
    getInvoice: getInvoiceMutation.mutate,
    isGettingInvoice: getInvoiceMutation.isPending,
  };
};