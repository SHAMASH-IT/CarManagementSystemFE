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
  const [initialPrice, setInitialPrice] = useState('')
  const [marque, setMarque] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [errors, setErrors] = useState({ 
    stock: '', 
    threshold: '', 
    price: '', 
    initialPrice: '',
    marque: '',
    categoryId: '' 
  })
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
        setInitialPrice(stockToUpdate.initialPrice.toString())
        setMarque(stockToUpdate.marque)
        setCategoryId(stockToUpdate.categoryId.toString())
      }
    }
  }, [stockId, stocks])

  const validateFields = () => {
    const newErrors = { 
      stock: '', 
      threshold: '', 
      price: '', 
      initialPrice: '',
      marque: '',
      categoryId: '' 
    }
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

    if (!initialPrice || parseFloat(initialPrice) <= 0) {
      newErrors.initialPrice = 'Le prix initial doit être supérieur à 0'
      isValid = false
    }

    if (!marque) {
      newErrors.marque = 'La marque est requise'
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
        initialPrice: parseFloat(initialPrice),
        marque,
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
    setInitialPrice('')
    setMarque('')
    setCategoryId('')
    setErrors({ 
      stock: '', 
      threshold: '', 
      price: '', 
      initialPrice: '',
      marque: '',
      categoryId: '' 
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm"
    >
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle className="text-emerald-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-800">Pièce mise à jour avec succès !</h2>
          <p className="text-gray-600">Les modifications ont été enregistrées.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Modifier la pièce</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-5">
                {/* Stock */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Quantité en stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Quantité disponible"
                    required
                  />
                  {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>

                {/* Marque */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Marque</label>
                  <input
                    type="text"
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Entrez la marque"
                    required
                  />
                  {errors.marque && <p className="text-red-500 text-sm mt-1">{errors.marque}</p>}
                </div>

                {/* Seuil */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Seuil d'alerte</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Seuil minimal d'alerte"
                    required
                  />
                  {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-5">
                {/* Prix Initial */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Prix Initial (DT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Prix initial (DT)"
                    required
                  />
                  {errors.initialPrice && <p className="text-red-500 text-sm mt-1">{errors.initialPrice}</p>}
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Prix de Vente (DT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Prix de vente (DT)"
                    required
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Catégorie</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-700"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-all shadow-sm font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}

export default UpdateStockModal
