"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useOrders } from "../hooks/useOrders"
import type { CreateOrderDto } from "../service/OrderService"
import { Check, Loader2, PackageOpen, ShoppingCart, User, X, Plus } from "lucide-react"

interface CreateOrderFormProps {
  onSuccess?: () => void
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSuccess }) => {
  const { placeOrder, refreshOrders } = useOrders()
  const [formData, setFormData] = useState<CreateOrderDto>({
    pieceId: 0,
    userId: 0,
    quantity: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Effet pour gérer le timer du message de succès
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (success) {
      timer = setTimeout(() => {
        setSuccess(null)
        setIsFormOpen(false)
        if (onSuccess) onSuccess()
      }, 5000) // 5 secondes
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [success, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      await placeOrder(formData)
      setFormData({ pieceId: 0, userId: 0, quantity: 0 })
      setSuccess("Commande créée avec succès !")
      refreshOrders() // Rafraîchir la liste des commandes
    } catch (err: any) {
      console.error("Erreur détaillée:", err)
      setError(err.response?.data?.message || "Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  if (!isFormOpen) {
    return (
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        Nouvelle Commande
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Nouvelle Commande
        </h2>
        <p className="text-sm text-blue-100 mt-1">
          Créez une nouvelle commande en remplissant le formulaire ci-dessous
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Succès</p>
              <p className="text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1.5">
                <div className="bg-blue-100 p-1 rounded-md">
                  <PackageOpen className="h-4 w-4 text-blue-600" />
                </div>
                ID Pièce
              </label>
              <input
                type="number"
                name="pieceId"
                value={formData.pieceId || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                placeholder="Entrez l'ID de la pièce"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1.5">
                <div className="bg-blue-100 p-1 rounded-md">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                ID Utilisateur
              </label>
              <input
                type="number"
                name="userId"
                value={formData.userId || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                placeholder="Entrez l'ID de l'utilisateur"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1.5">
                <div className="bg-blue-100 p-1 rounded-md">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                Quantité
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                placeholder="Entrez la quantité"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-6 py-2.5 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-md text-white font-medium flex items-center justify-center transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Passer la commande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateOrderForm
