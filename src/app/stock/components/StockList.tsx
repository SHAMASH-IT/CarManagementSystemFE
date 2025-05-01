'use client'
import { useState } from 'react'
import { Pencil, Trash, FilePlus2 } from 'lucide-react' // Icônes modernes
import AddStockModal from './AddStockModal'
import UpdateStockModal from './UpdateStockModal'
import DeleteStockModal from './DeleteStockModal'
import { useStock } from '../hooks/useStock'

const StockList = () => {
  const { stocks, isLoading, error, fetchStocks } = useStock()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<string | null>(null)

  const handleEditClick = (stockId: string) => {
    setSelectedStock(stockId)
    setIsUpdateModalOpen(true)
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleDeleteClick = (stockId: string) => {
    setSelectedStock(stockId)
    setIsDeleteModalOpen(true)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Erreur: {error}</div>
  }

  return (
    <div className='mb-6'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Stocks</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          <FilePlus2 size={20} />
          <span>Ajouter une pièce</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Pièce
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Marque
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Seuil
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Prix Initial
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Prix de Vente
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stocks.map((stock) => (
              <tr key={stock.id} className={`${stock.stock <= stock.threshold ? 'bg-red-50' : 'bg-white'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  {stock.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.marque}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.category?.name || 'Non catégorisé'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.threshold}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.initialPrice} DT
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.price} DT
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(stock.id)}
                      className="bg-yellow-400 text-white px-3 py-2 rounded-lg hover:bg-yellow-500 transition duration-150"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(stock.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-150"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={() => fetchStocks()}
      />

      <UpdateStockModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        stockId={selectedStock}
        onUpdateSuccess={() => fetchStocks()}
      />

      <DeleteStockModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        stockId={selectedStock}
        onDeleteSuccess={() => fetchStocks()}
      />
    </div>
  )
}

export default StockList
