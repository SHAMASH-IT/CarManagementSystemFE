'use client'
import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useStock } from '../hooks/useStock'
import { X, CheckCircle } from 'lucide-react'

// Configuration de React Modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next')
}

interface UpdateStockModalProps {
  isOpen: boolean
  onClose: () => void
  stockId: string | null
  onUpdateSuccess: () => void
}

const UpdateStockModal = ({ isOpen, onClose, stockId, onUpdateSuccess }: UpdateStockModalProps) => {
  const [stock, setStock] = useState('')
  const [threshold, setThreshold] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [errors, setErrors] = useState({ stock: '', threshold: '', price: '', categoryId: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { updateStock, stocks, categories, fetchCategories } = useStock()

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  useEffect(() => {
    if (stockId) {
      const stockToUpdate = stocks.find(s => s.id === stockId)
      if (stockToUpdate) {
        setStock(stockToUpdate.stock.toString())
        setThreshold(stockToUpdate.threshold.toString())
        setPrice(stockToUpdate.price.toString())
        setCategoryId(stockToUpdate.categoryId.toString())
      }
    }
  }, [stockId, stocks])

  const validateFields = () => {
    const newErrors = { stock: '', threshold: '', price: '', categoryId: '' }
    let isValid = true

    if (!stock || parseInt(stock) <= 0) {
      newErrors.stock = 'La quantité doit être supérieure à 0'
      isValid = false
    }

    if (!threshold || parseInt(threshold) <= 0) {
      newErrors.threshold = 'Le seuil doit être supérieur à 0'
      isValid = false
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0'
      isValid = false
    }

    if (!categoryId) {
      newErrors.categoryId = 'Veuillez sélectionner une catégorie'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stockId) return

    if (!validateFields()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre ❌')
      return
    }

    setIsLoading(true)

    try {
      await updateStock(stockId, {
        stock: parseInt(stock),
        threshold: parseInt(threshold),
        price: parseFloat(price),
        categoryId: parseInt(categoryId)
      })

      setShowSuccess(true)
      toast.success('Pièce mise à jour avec succès 🎉')
      
      // Attendre 1.5 secondes avant de fermer le modal
      setTimeout(() => {
        onUpdateSuccess()
        resetForm()
        onClose()
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      toast.error('Une erreur est survenue ❌')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStock('')
    setThreshold('')
    setPrice('')
    setCategoryId('')
    setErrors({ stock: '', threshold: '', price: '', categoryId: '' })
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
          <h2 className="text-2xl font-bold text-gray-800">Pièce mise à jour avec succès !</h2>
          <p className="text-gray-600">Les modifications ont été enregistrées.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Modifier une pièce</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition transform hover:scale-110"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stock */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Quantité en stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                } shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all`}
                placeholder="Quantité"
                required
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>

            {/* Threshold */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Seuil d'alerte</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.threshold ? 'border-red-500' : 'border-gray-300'
                } shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all`}
                placeholder="Seuil minimal d'alerte"
                required
              />
              {errors.threshold && <p className="text-red-500 text-sm">{errors.threshold}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                } shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all`}
                placeholder="Prix unitaire (€)"
                required
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                } shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all`}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition-all shadow"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}

export default UpdateStockModal
