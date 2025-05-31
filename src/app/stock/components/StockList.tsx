'use client'
import { useState } from 'react'
import { Pencil, Trash, FilePlus2, Boxes } from 'lucide-react' // Changement de l'icône
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil((stocks?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStocks = stocks?.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach(i => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

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
        <div className="flex items-center gap-2">
          <Boxes size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Gestion des Stocks</h2>
        </div>
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
            {currentStocks?.map((stock) => (
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

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Affichage de <b>{stocks?.length === 0 ? 0 : startIndex + 1}</b> à <b>{Math.min(endIndex, stocks?.length || 0)}</b> sur <b>{stocks?.length}</b> résultats
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <div className="hidden sm:flex items-center space-x-1">
              {getPageNumbers().map((pageNum, idx) =>
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
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
