"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useOrders } from "../hooks/useOrders"
import type { Order, Piece } from "../service/OrderService"
import { orderService } from "../service/OrderService"
import { Calendar, Package, User, ShoppingCart, Loader2, AlertCircle, X, Check, Search, RefreshCw } from "lucide-react"

interface OrderListProps {
  filterStatus?: string | null
}

const OrderList: React.FC<OrderListProps> = ({ filterStatus = null }) => {
  const { orders, loading, error, cancelOrder, completeOrder, refreshOrders } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Toutes")
  const [pieces, setPieces] = useState<Map<number, Piece>>(new Map())

  useEffect(() => {
    console.log("Liste des commandes mise à jour:", orders)
  }, [orders])

  // Charger les pièces au montage du composant
  useEffect(() => {
    const loadPieces = async () => {
      try {
        const piecesData = await orderService.getAllPieces()
        const piecesMap = new Map(piecesData.map(piece => [piece.id, piece]))
        setPieces(piecesMap)
      } catch (err) {
        console.error('Erreur lors du chargement des pièces:', err)
      }
    }
    loadPieces()
  }, [])

  const handleCancelOrder = async (id: number) => {
    try {
      await cancelOrder(id)
      refreshOrders() // Rafraîchir la liste après l'annulation
    } catch (err) {
      console.error("Erreur lors de l'annulation de la commande:", err)
    }
  }

  const handleCompleteOrder = async (id: number) => {
    try {
      await completeOrder(id)
      refreshOrders()
    } catch (err) {
      console.error("Erreur lors de la complétion de la commande:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESERVED":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESERVED":
        return <Calendar className="h-4 w-4 mr-2" />
      case "COMPLETED":
        return <Check className="h-4 w-4 mr-2" />
      case "CANCELLED":
        return <X className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  // Obtenir le nom de la pièce à partir de son ID
  const getPieceName = (pieceId: number) => {
    const piece = pieces.get(pieceId)
    return piece ? piece.name : `Pièce #${pieceId}`
  }

  // Filtrer les commandes en fonction du terme de recherche et du statut actif
  const getFilteredOrders = () => {
    if (!Array.isArray(orders)) return []

    let filtered = orders

    // Filtrer par onglet
    if (activeTab === "Réservées") {
      filtered = filtered.filter((order) => order.status === "RESERVED")
    } else if (activeTab === "Complétées") {
      filtered = filtered.filter((order) => order.status === "COMPLETED")
    } else if (activeTab === "Annulées") {
      filtered = filtered.filter((order) => order.status === "CANCELLED")
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.pieceId.toString().includes(searchTerm) ||
          order.userId.toString().includes(searchTerm),
      )
    }

    return filtered
  }

  const filteredOrders = getFilteredOrders()

  // Statistiques
  const totalOrders = Array.isArray(orders) ? orders.length : 0
  const reservedOrders = Array.isArray(orders) ? orders.filter((o) => o.status === "RESERVED").length : 0
  const completedOrders = Array.isArray(orders) ? orders.filter((o) => o.status === "COMPLETED").length : 0
  const cancelledOrders = Array.isArray(orders) ? orders.filter((o) => o.status === "CANCELLED").length : 0

  // Calculer la quantité totale et la moyenne
  const totalQuantity = Array.isArray(orders) ? orders.reduce((sum, order) => sum + order.quantity, 0) : 0
  const averageQuantity = totalOrders > 0 ? Math.round((totalQuantity / totalOrders) * 10) / 10 : 0

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-lg text-gray-600">Chargement des commandes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cartes de statistiques - version très petite */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-sm p-2 text-white">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">{totalOrders}</p>
            <ShoppingCart className="h-4 w-4 opacity-80" />
          </div>
          <p className="text-xs opacity-90 mt-0.5">Total</p>
        </div>

        <div className="bg-white rounded-md shadow-sm p-2 border border-blue-100">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-blue-600">{reservedOrders}</p>
            <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="h-3 w-3 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-blue-800 mt-0.5">Réservées</p>
        </div>

        <div className="bg-white rounded-md shadow-sm p-2 border border-blue-100">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-blue-600">{completedOrders}</p>
            <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-blue-800 mt-0.5">Complétées</p>
        </div>

        <div className="bg-white rounded-md shadow-sm p-2 border border-blue-100">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-blue-600">{cancelledOrders}</p>
            <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-3 w-3 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-blue-800 mt-0.5">Annulées</p>
        </div>

        <div className="bg-blue-600 rounded-md shadow-sm p-2 text-white">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">{totalQuantity}</p>
            <Package className="h-4 w-4 opacity-80" />
          </div>
          <p className="text-xs opacity-90 mt-0.5">Pièces (Moy: {averageQuantity})</p>
        </div>
      </div>

      {/* Aperçu des commandes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        <div className="p-3 border-b border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Liste des Commandes
          </h2>
        </div>

        <div className="flex border-b border-blue-100">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "Toutes" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab("Toutes")}
          >
            Toutes
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "Réservées" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab("Réservées")}
          >
            Réservées
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "Complétées" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab("Complétées")}
          >
            Complétées
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "Annulées" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
            onClick={() => setActiveTab("Annulées")}
          >
            Annulées
          </button>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-b-xl">
          <div className="p-3 flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => refreshOrders()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium">Aucune commande trouvée</p>
              <p className="text-sm">
                {activeTab !== "Toutes"
                  ? `Aucune commande avec le statut ${activeTab}`
                  : "Créez une nouvelle commande pour commencer"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      Nom Pièce
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      Quantité
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      ID Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-500 mr-2" />
                          {getPieceName(order.pieceId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          {new Date(order.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ShoppingCart className="h-5 w-5 text-gray-500 mr-2" />
                          {order.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-500 mr-2" />
                          {order.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === "RESERVED" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCompleteOrder(order.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Compléter
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Annuler
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderList
