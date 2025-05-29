"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useOrders } from "../hooks/useOrders"
import type { Piece, Supplier } from "../service/OrderService"
import { orderService } from "../service/OrderService"
import { Check, Loader2, PackageOpen, ShoppingCart, User, X, Plus } from "lucide-react"
import axios from 'axios';
interface CreateOrderFormProps {
  onSuccess?: () => void
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSuccess }) => {
  const { placeOrder, refreshOrders } = useOrders()
  const [pieces, setPieces] = useState<Piece[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
useEffect(() => {
    const fetchData = async () => {
      try {
        // Utilisez la nouvelle méthode qui filtre par catégories du provider
        const piecesData = await orderService.getPiecesByProvider();
        const suppliersData = await orderService.getAllSuppliers();
        
        setPieces(piecesData);
        setSuppliers(suppliersData);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de chargement');
      }
    };
    
    if (isFormOpen) fetchData();
  }, [isFormOpen]);
  // Structure correcte pour les commandes d'achat
  const [selectedPieces, setSelectedPieces] = useState<{ pieceId: number, quantity: number }[]>([
    { pieceId: 0, quantity: 1 }
  ])
  const [selectedSupplier, setSelectedSupplier] = useState<number>(0)

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

  // Charger la liste des pièces et des fournisseurs au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [piecesData, suppliersData] = await Promise.all([
          orderService.getAllPieces(),
          orderService.getAllSuppliers()
        ]);
        setPieces(piecesData);
        setSuppliers(suppliersData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      }
    }
    
    if (isFormOpen) {
      fetchData();
    }
  }, [isFormOpen])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  const validPieces = selectedPieces.filter(p => p.pieceId > 0 && p.quantity > 0);

  if (validPieces.length === 0) {
    setError("Veuillez sélectionner au moins une pièce valide");
    setIsSubmitting(false);
    return;
  }

  if (!selectedSupplier) {
    setError("Veuillez sélectionner un fournisseur");
    setIsSubmitting(false);
    return;
  }

  try {
    const orderData = {
      pieces: validPieces,
      userId: selectedSupplier,
    };

    await placeOrder(orderData);

    // Réinitialisation
    setSelectedPieces([{ pieceId: 0, quantity: 1 }]);
    setSelectedSupplier(0);
    setSuccess("Commande créée avec succès !");
    refreshOrders();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Erreur Axios complète:", err);
      setError(err.response?.data?.message || "Erreur lors de la création de la commande");
    } else if (err instanceof Error) {
      console.error("Erreur générique:", err.message);
      setError(err.message);
    } else {
      console.error("Erreur inconnue:", err);
      setError("Une erreur inconnue est survenue");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const addPieceRow = () => {
    setSelectedPieces([...selectedPieces, { pieceId: 0, quantity: 1 }])
  }

  const removePieceRow = (index: number) => {
    if (selectedPieces.length > 1) {
      const newPieces = [...selectedPieces]
      newPieces.splice(index, 1)
      setSelectedPieces(newPieces)
    }
  }

  const updatePieceRow = (index: number, field: 'pieceId' | 'quantity', value: number) => {
    const newPieces = [...selectedPieces]
    newPieces[index][field] = value
    setSelectedPieces(newPieces)
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
          Nouvelle Commande d'Achat
        </h2>
        <p className="text-sm text-blue-100 mt-1">
          Créez une nouvelle commande d'achat en remplissant le formulaire ci-dessous
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
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-1.5">
              <div className="bg-blue-100 p-1 rounded-md">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              Fournisseur
            </label>
            <select
              value={selectedSupplier || ""}
              onChange={(e) => setSelectedSupplier(Number(e.target.value))}
              className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez un fournisseur</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.email})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-700">Pièces à commander</h3>
              <button 
                type="button" 
                onClick={addPieceRow}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter une pièce
              </button>
            </div>

            {selectedPieces.map((pieceItem, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 border border-gray-200 rounded-md p-4">
                <div className="col-span-6">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Pièce
                  </label>
                  <select
                    value={pieceItem.pieceId || ""}
                    onChange={(e) => updatePieceRow(index, 'pieceId', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionnez une pièce</option>
                    {pieces.map((piece) => (
                      <option key={piece.id} value={piece.id}>
                        {piece.name} ({piece.marque}) - Prix: {piece.price} DT
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Quantité
                  </label>
                  <input
                    type="number"
                    value={pieceItem.quantity || ""}
                    onChange={(e) => updatePieceRow(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
                
                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md"
                    onClick={() => removePieceRow(index)}
                    disabled={selectedPieces.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
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

export default CreateOrderForm
