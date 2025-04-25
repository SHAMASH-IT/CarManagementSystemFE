"use client"

import type React from "react"
import OrderList from "./components/OrderList"
import CreateOrderForm from "./components/CreateOrderForm"
import { ShoppingCart } from "lucide-react"
import Sidebar from "@/app/common/Sidebar"
import Navbar from "@/app/common/Navbar"

const OrderPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-[95%] mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg shadow-md">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
              </div>


            </div>

            <div className="space-y-6">
              {/* Formulaire de création */}
              <CreateOrderForm />

              {/* Liste des commandes */}
              <OrderList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
