'use client';

import React, { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../services/order.service';

const OrderList: React.FC = () => {
  const { orders, loading, error, cancelOrder, refreshOrders } = useOrders();

  useEffect(() => {
    console.log('Liste des commandes mise à jour:', orders);
  }, [orders]);

  const handleCancelOrder = async (id: number) => {
    try {
      await cancelOrder(id);
      refreshOrders(); // Rafraîchir la liste après l'annulation
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(orders)) return <div className="text-red-500">Erreur: Format de données invalide</div>;
  if (orders.length === 0) return <div className="text-gray-500">Aucune commande trouvée</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Commandes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Statut</th>
              <th className="px-4 py-2 border-b">Quantité</th>
              <th className="px-4 py-2 border-b">ID Pièce</th>
              <th className="px-4 py-2 border-b">ID Utilisateur</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{order.id}</td>
                <td className="px-4 py-2 border-b">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{order.quantity}</td>
                <td className="px-4 py-2 border-b">{order.pieceId}</td>
                <td className="px-4 py-2 border-b">{order.userId}</td>
                <td className="px-4 py-2 border-b">
                  {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList; 