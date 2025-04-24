import React from 'react';
import OrderList from './components/OrderList';
import CreateOrderForm from './components/CreateOrderForm';

const OrderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Commandes</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <CreateOrderForm />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <OrderList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
