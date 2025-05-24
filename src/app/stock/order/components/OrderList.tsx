"use client"

import React from 'react'
import { useOrders } from '../hooks/useOrders'
import { AlertCircle, CheckCircle, Clock, Filter, MoreVertical, Search, ShoppingCart, XCircle } from 'lucide-react'
import { orderService, Piece } from '../service/OrderService'
import { format } from 'date-fns'
import { de, fr } from 'date-fns/locale'

const OrderList = () => {
  const { orders, loading, error, cancelOrder, completeOrder, refreshOrders } = useOrders()
  const [actionMenuOpen, setActionMenuOpen] = React.useState<number | null>(null)
  const [pieces, setPieces] = React.useState<Map<number, Piece>>(new Map())
  const [modalOpen, setModalOpen] = React.useState<{ isOpen: boolean, order: any } | null>(null)
  
  // État pour la recherche avancée
  const [isAdvancedSearch, setIsAdvancedSearch] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [filters, setFilters] = React.useState({
    orderNumber: '',
    supplierName: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    pieceId: ''
  })

  // Récupération des pièces pour afficher leur nom
  React.useEffect(() => {
    const fetchPieces = async () => {
      try {
        const piecesList = await orderService.getAllPieces()
        const piecesMap = new Map()
        
        piecesList.forEach((piece: Piece) => {
          piecesMap.set(piece.id, piece)
        })
        
        setPieces(piecesMap)
      } catch (error) {
        console.error("Erreur lors de la récupération des pièces:", error)
      }
    }
    
    fetchPieces()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Complétée
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Annulée
          </span>
        )
      case 'RESERVED':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> En attente
          </span>
        )
    }
  }

  const handleAction = async (action: 'cancel' | 'complete', orderId: number) => {
    try {
      if (action === 'cancel') {
        await cancelOrder(orderId)
      } else {
        await completeOrder(orderId)
      }
      
      // Ne pas réinitialiser le filtre de statut après une action
      // pour garder le contexte de filtrage actuel
      setActionMenuOpen(null)
      
      // Force le rafraîchissement des commandes après l'action
      await refreshOrders()
      
      // Ajout d'un délai pour s'assurer que le rafraîchissement a eu le temps de s'effectuer
      setTimeout(() => {
        console.log('État des commandes après action:', orders)
      }, 500)
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error)
    }
  }

  // Gestionnaire de changement pour les filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      orderNumber: '',
      supplierName: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      pieceId: ''
    });
    setSearchTerm('');
    setStatusFilter(null);
  };

  // Compter les commandes par statut
  const countByStatus = {
    RESERVED: orders.filter(order => order.status === 'RESERVED').length,
    COMPLETED: orders.filter(order => order.status === 'COMPLETED').length,
    CANCELLED: orders.filter(order => order.status === 'CANCELLED').length
  };

  // Vérification de debug - afficher dans la console les commandes annulées
  React.useEffect(() => {
    const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');
    console.log('Commandes avec statut CANCELLED:', cancelledOrders);
  }, [orders]);

  const showOrderDetails = (order: any) => {
    setModalOpen({ isOpen: true, order })
  }

  // Filtrer les commandes en fonction des critères de recherche et du filtre de statut
  const filteredOrders = orders.filter(order => {
    // Filtrer d'abord par statut si un filtre est appliqué
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    
    // En mode de recherche simple
    if (!isAdvancedSearch && searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      
      // Recherche dans le numéro de commande
      if (order.id.toString().includes(searchTermLower)) return true;
      
      // Recherche dans le nom ou email du fournisseur
      if ((order.user?.name?.toLowerCase() || '').includes(searchTermLower) || 
          (order.user?.email?.toLowerCase() || '').includes(searchTermLower)) return true;
      
      // Recherche dans le statut
      if ((order.status?.toLowerCase() || '').includes(searchTermLower) ||
          (order.status === 'COMPLETED' && 'complétée'.includes(searchTermLower)) ||
          (order.status === 'CANCELLED' && 'annulée'.includes(searchTermLower)) ||
          (order.status === 'RESERVED' && 'en attente'.includes(searchTermLower))) return true;
      
      // Recherche dans la date (format français)
      const orderDate = format(new Date(order.date), 'dd MMM yyyy', { locale: fr });
      if (orderDate.toLowerCase().includes(searchTermLower)) return true;
      
      return false;
    } 
    // En mode de recherche avancée
    else if (isAdvancedSearch) {
      // Vérifier le numéro de commande
      if (filters.orderNumber && !order.id.toString().includes(filters.orderNumber)) {
        return false;
      }
      
      // Vérifier le nom du fournisseur
      if (filters.supplierName && !(order.user?.name?.toLowerCase() || '').includes(filters.supplierName.toLowerCase())) {
        return false;
      }
      
      // Vérifier le statut (si spécifié dans la recherche avancée)
      if (filters.status && order.status !== filters.status) {
        return false;
      }
      
      // Vérifier la date de début
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        const orderDate = new Date(order.date);
        if (orderDate < dateFrom) {
          return false;
        }
      }
      
      // Vérifier la date de fin
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        // Ajouter un jour pour inclure toute la journée
        dateTo.setDate(dateTo.getDate() + 1);
        const orderDate = new Date(order.date);
        if (orderDate > dateTo) {
          return false;
        }
      }
      
      // Vérifier l'ID de pièce
      if (filters.pieceId && order.orderPieces) {
        const hasPiece = order.orderPieces.some((op: any) => 
          op.pieceId.toString() === filters.pieceId
        );
        if (!hasPiece) {
          return false;
        }
      }
      
      return true;
    }
    
    // Si aucun filtre de recherche n'est appliqué, montrer toutes les commandes
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement des commandes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="font-medium">Erreur</p>
        </div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => refreshOrders()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commandes d'achat.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Liste des commandes d'achat
        </h2>
      </div>
      
      {/* Interface unifiée de filtrage et recherche en haut */}
      <div className="px-6 pt-4 flex justify-between items-start">
        {/* Boutons de recherche simple/avancée - maintenant à gauche */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsAdvancedSearch(false)} 
            className={`px-3 py-1.5 text-sm rounded-md ${!isAdvancedSearch 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Recherche simple
          </button>
          <button 
            onClick={() => setIsAdvancedSearch(true)} 
            className={`px-3 py-1.5 text-sm rounded-md ${isAdvancedSearch 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Filter className="h-3 w-3 inline mr-1" />
            Recherche avancée
          </button>
        </div>
        
        {/* Filtres rapides par statut - reste à droite - SUPPRESSION DU BOUTON ANNULÉES */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter(statusFilter === 'RESERVED' ? null : 'RESERVED')}
            className={`flex items-center px-3 py-1.5 text-sm rounded-full border ${
              statusFilter === 'RESERVED' 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            En attente ({countByStatus.RESERVED})
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? null : 'COMPLETED')}
            className={`flex items-center px-3 py-1.5 text-sm rounded-full border ${
              statusFilter === 'COMPLETED' 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Complétées ({countByStatus.COMPLETED})
          </button>
        </div>
      </div>
      
      {/* Séparation entre les boutons et les champs de recherche */}
      <div className="px-6 py-4 border-b border-gray-200">
        {/* Bouton réinitialiser les filtres */}
        {(searchTerm || statusFilter || Object.values(filters).some(value => value !== '')) && (
          <div className="flex justify-end mb-3">
            <button 
              onClick={resetFilters} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Recherche simple */}
        {!isAdvancedSearch && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une commande par numéro, fournisseur, statut..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Recherche avancée */}
        {isAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="orderNumber" className="block text-xs font-medium text-gray-700 mb-1">
                N° Commande
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                placeholder="Ex: 12345"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.orderNumber}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="supplierName" className="block text-xs font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <input
                type="text"
                id="supplierName"
                name="supplierName"
                placeholder="Nom du fournisseur"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.supplierName}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Tous les statuts</option>
                <option value="RESERVED">En attente</option>
                <option value="COMPLETED">Complétée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="block text-xs font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="pieceId" className="block text-xs font-medium text-gray-700 mb-1">
                ID de pièce
              </label>
              <input
                type="text"
                id="pieceId"
                name="pieceId"
                placeholder="Ex: 42"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={filters.pieceId}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Commande
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fournisseur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pièces
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(order.date), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(order.date), 'HH:mm', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.user?.name || "Fournisseur inconnu"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.user?.email || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderPieces?.length 
                        ? (
                            <button 
                              onClick={() => showOrderDetails(order)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {order.orderPieces.length} pièce(s)
                            </button>
                          ) 
                        : "Aucune pièce"
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      {order.status === 'RESERVED' && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleAction('complete', order.id)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-100"
                            aria-label="Compléter la commande"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Compléter</span>
                          </button>
                          <button
                            onClick={() => handleAction('cancel', order.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-100" 
                            aria-label="Annuler la commande"
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Annuler</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                    <p>Aucune commande ne correspond à votre recherche</p>
                    <button 
                      onClick={resetFilters} 
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Effacer la recherche
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for order details */}
      {modalOpen && modalOpen.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Détails de la commande #{modalOpen.order.id}
                </h3>
                <button
                  onClick={() => setModalOpen(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de commande</p>
                  <p className="mt-1">
                    {format(new Date(modalOpen.order.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <div className="mt-1">{getStatusBadge(modalOpen.order.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fournisseur</p>
                  <p className="mt-1">{modalOpen.order.user?.name || "Non spécifié"}</p>
                  <p className="text-sm text-gray-500">{modalOpen.order.user?.email || ""}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-3">Pièces commandées</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pièce
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modalOpen.order.orderPieces?.map((orderPiece: any) => {
                      const piece = pieces.get(orderPiece.pieceId)
                      return (
                        <tr key={orderPiece.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {orderPiece.pieceId}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {piece?.name || "Pièce inconnue"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {piece?.marque || ""}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {orderPiece.quantity}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList
