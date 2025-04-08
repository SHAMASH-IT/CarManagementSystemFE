'use client'
import { useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useStock } from '../hooks/useStock'
import { X, CheckCircle, AlertTriangle } from 'lucide-react'

// Configuration de React Modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next')
}

interface DeleteStockModalProps {
  isOpen: boolean
  onClose: () => void
  stockId: string | null
  onDeleteSuccess: () => void
}

const DeleteStockModal = ({ isOpen, onClose, stockId, onDeleteSuccess }: DeleteStockModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { deleteStock } = useStock()

  const handleDelete = async () => {
    if (!stockId) return

    setIsLoading(true)

    try {
      await deleteStock(stockId)
      setShowSuccess(true)
      toast.success('Pièce supprimée avec succès 🎉')
      
      // Attendre 1.5 secondes avant de fermer le modal
      setTimeout(() => {
        onDeleteSuccess()
        onClose()
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression ❌')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-2xl animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm"
    >
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle className="text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-800">Pièce supprimée avec succès !</h2>
          <p className="text-gray-600">La pièce a été supprimée de votre stock.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
           
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition transform hover:scale-110"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <AlertTriangle className="text-red-500" size={64} />
            <p className="text-lg text-gray-700 text-center">
              Êtes-vous sûr de vouloir supprimer cette pièce ? Cette action est irréversible.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Suppression en cours...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

export default DeleteStockModal
