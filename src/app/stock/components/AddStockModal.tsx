'use client'
import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
import { useStock } from '../hooks/useStock'
import { Plus, X, CheckCircle } from 'lucide-react'

// Configuration de React Modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next')
}

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSuccess: () => void
}

const AddStockModal = ({ isOpen, onClose, onAddSuccess }: AddStockModalProps) => {
  const [name, setName] = useState('')
  const [stock, setStock] = useState('')
  const [threshold, setThreshold] = useState('')
  const [price, setPrice] = useState('')
  const [initialPrice, setInitialPrice] = useState('')
  const [marque, setMarque] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [errors, setErrors] = useState({ 
    name: '', 
    stock: '', 
    threshold: '', 
    price: '', 
    initialPrice: '',
    marque: '',
    categoryId: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addStock, categories, fetchCategories } = useStock()

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (categories.length > 0) {
        setCategoryId(categories[0].id.toString())
      }
    }
  }, [isOpen, categories.length])

  const validateFields = () => {
    const newErrors = { 
      name: '', 
      stock: '', 
      threshold: '', 
      price: '', 
      initialPrice: '',
      marque: '',
      categoryId: '' 
    }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis'
      isValid = false
    }

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

    if (!marque.trim()) {
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
    
    if (!validateFields()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre ❌')
      return
    }

    setIsLoading(true)

    try {
      console.log('AddStockModal - Données du formulaire:', {
        name,
        stock,
        threshold,
        price,
        initialPrice,
        marque,
        categoryId
      })

      await addStock({
        name,
        stock: parseInt(stock),
        threshold: parseInt(threshold),
        price: parseFloat(price),
        initialPrice: parseFloat(initialPrice),
        marque,
        categoryId: parseInt(categoryId)
      })

      console.log('AddStockModal - Pièce ajoutée avec succès')
      setShowSuccess(true)
      toast.success('Pièce ajoutée avec succès 🎉')
      
      setTimeout(() => {
        onAddSuccess()
        onClose()
        resetForm()
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      console.error('AddStockModal - Erreur lors de l\'ajout:', error)
      toast.error('Une erreur est survenue ❌')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setStock('')
    setThreshold('')
    setPrice('')
    setInitialPrice('')
    setMarque('')
    setCategoryId('')
    setErrors({ 
      name: '', 
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
      className="relative w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-2xl animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm"
    >
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle className="text-green-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-800">Pièce ajoutée avec succès !</h2>
          <p className="text-gray-600">La pièce a été ajoutée à votre stock.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Ajouter une nouvelle pièce</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Nom de la pièce</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Entrez le nom"
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Marque */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Marque</label>
              <input
                type="text"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Entrez la marque"
                required
              />
              {errors.marque && <p className="text-red-500 text-sm">{errors.marque}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Quantité en stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Quantité disponible"
                required
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>

            {/* Seuil */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Seuil d'alerte</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Seuil minimal d'alerte"
                required
              />
              {errors.threshold && <p className="text-red-500 text-sm">{errors.threshold}</p>}
            </div>

            {/* Prix Initial */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Prix Initial (DT)</label>
              <input
                type="number"
                step="0.01"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Prix initial (DT)"
                required
              />
              {errors.initialPrice && <p className="text-red-500 text-sm">{errors.initialPrice}</p>}
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Prix de Vente (DT)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Prix de vente (DT)"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all"
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
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}

export default AddStockModal
