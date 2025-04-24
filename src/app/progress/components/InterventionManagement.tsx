"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "../hooks/useProgress"
import { type Intervention, Status, type UpdateInterventionDto } from "../services/progress.service"
import { stockService } from "../../stock/services/stockService"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"
import { FaPrint, FaPlus } from 'react-icons/fa'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import FacturePdf from './FacturePdf'

interface StockPiece {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface InterventionPiece {
  id: number;
  pieceId: number;
  quantity: number;
  totalPrice: number;
  piece?: {
    id: number;
    name: string;
    price: number;
  };
}

export default function InterventionManagement({ interventionId }: { interventionId: number }) {
  const router = useRouter()
  const { loading, error, getIntervention, updateIntervention, completeIntervention } = useProgress()
  const [intervention, setIntervention] = useState<Intervention | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [showFacturePdf, setShowFacturePdf] = useState(false)
  const [showAddPieceModal, setShowAddPieceModal] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState<StockPiece | null>(null)
  const [pieceQuantity, setPieceQuantity] = useState(1)
  const [pieces, setPieces] = useState<StockPiece[]>([])

  useEffect(() => {
    loadIntervention()
    loadPieces()
  }, [interventionId])

  const loadIntervention = async () => {
    try {
      const data = await getIntervention(interventionId)
      setIntervention(data)
      setValidationErrors([])
      setSuccessMessage("")
    } catch (err) {
      console.error("Error loading intervention:", err)
      setValidationErrors(["Erreur lors du chargement de l'intervention"])
    }
  }

  const loadPieces = async () => {
    try {
      const piecesData = await stockService.getAllStocks()
      console.log('Structure des pièces chargées:', piecesData)
      // Conversion des données pour assurer le bon format
      const formattedPieces = piecesData.map(piece => ({
        id: typeof piece.id === 'string' ? parseInt(piece.id) : piece.id,
        name: piece.name,
        price: typeof piece.price === 'string' ? parseFloat(piece.price) : piece.price,
        stock: typeof piece.stock === 'string' ? parseInt(piece.stock) : piece.stock
      }))
      setPieces(formattedPieces)
    } catch (err) {
      console.error("Error loading pieces:", err)
      toast.error("Erreur lors du chargement des pièces")
    }
  }

  const validateIntervention = (intervention: Intervention): string[] => {
    const errors: string[] = []
    
    if (!intervention.endDate) {
      errors.push("La date de fin est obligatoire")
    } else if (new Date(intervention.endDate) < new Date(intervention.startDate)) {
      errors.push("La date de fin doit être postérieure à la date de début")
    }
    
    if (intervention.price < 0) {
      errors.push("Le prix ne peut pas être négatif")
    }
    
    if (intervention.interventionPieces?.some(piece => piece.quantity < 0)) {
      errors.push("Les quantités des pièces ne peuvent pas être négatives")
    }
    
    return errors
  }

  const handleUpdate = async () => {
    if (!intervention) return
    
    const errors = validateIntervention(intervention)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    
    try {
      setIsSubmitting(true)
      const updateData: UpdateInterventionDto = {
        description: intervention.description,
        price: intervention.price,
        status: intervention.status,
        endDate: intervention.endDate,
        pieces: intervention.interventionPieces?.map((piece) => ({
          id: piece.pieceId,
          quantity: piece.quantity,
          price: piece.piece?.price || 0,
        })),
      }
      await updateIntervention(interventionId, updateData)
      setIsEditing(false)
      setSuccessMessage("Intervention mise à jour avec succès")
      await loadIntervention()
    } catch (err) {
      console.error("Error updating intervention:", err)
      setValidationErrors(["Erreur lors de la mise à jour de l'intervention"])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async () => {
    if (!intervention) return
    try {
      setIsSubmitting(true)
      await completeIntervention(interventionId)
      await loadIntervention() // Reload to get updated data
      setActiveTab("invoice")
    } catch (err) {
      console.error("Error completing intervention:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePieceQuantityChange = (pieceId: number, quantity: number) => {
    if (!intervention) return
    
    const newPieces = intervention.interventionPieces?.map((piece) => {
      if (piece.id === pieceId) {
        return {
          ...piece,
          quantity: Math.max(0, quantity),
          totalPrice: Math.max(0, quantity) * (piece.piece?.price || 0),
        }
      }
      return piece
    })
    
    setIntervention({
      ...intervention,
      interventionPieces: newPieces,
    })
  }

  const calculateTotal = () => {
    if (!intervention) return 0
    const piecesTotal = intervention.interventionPieces?.reduce((sum, piece) => sum + (piece.totalPrice || 0), 0) || 0
    return piecesTotal + intervention.price
  }

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.RESERVED:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
            En attente
          </span>
        )
      case Status.IN_PROGRESS:
        return (
            <span
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-full shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            En cours
          </span>
          
          
        )
      case Status.COMPLETED:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 border border-green-300">
            Terminé
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-300">
            {status}
          </span>
        )
    }
  }

  const generatePDF = async () => {
    const invoiceElement = document.getElementById('invoice-content')
    if (!invoiceElement) return

    try {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`facture-intervention-${interventionId}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      toast.error('Erreur lors de la génération du PDF')
    }
  }

  const handleAddPiece = async () => {
    if (!intervention || !selectedPiece) return
    
    try {
      // Vérifier si la pièce est en stock
      const piece = pieces.find(p => p.id === selectedPiece.id)
      if (!piece || piece.stock < pieceQuantity) {
        toast.error("Stock insuffisant pour cette pièce")
        return
      }
      
      const existingPiece = intervention.interventionPieces?.find(p => p.pieceId === selectedPiece.id)
      
      if (existingPiece) {
        const newPieces = intervention.interventionPieces?.map(piece => {
          if (piece.pieceId === selectedPiece.id) {
            return {
              ...piece,
              quantity: piece.quantity + pieceQuantity,
              totalPrice: (piece.quantity + pieceQuantity) * selectedPiece.price
            }
          }
          return piece
        })
        
        setIntervention({
          ...intervention,
          interventionPieces: newPieces
        })
      } else {
        const newPiece: InterventionPiece = {
          id: Date.now(),
          pieceId: selectedPiece.id,
          quantity: pieceQuantity,
          totalPrice: pieceQuantity * selectedPiece.price,
          piece: {
            id: selectedPiece.id,
            name: selectedPiece.name,
            price: selectedPiece.price
          }
        }
        
        setIntervention({
          ...intervention,
          interventionPieces: [...(intervention.interventionPieces || []), newPiece]
        })
      }
      
      // Mettre à jour le stock
      await stockService.updateStock(selectedPiece.id.toString(), {
        stock: piece.stock - pieceQuantity
      })
      
      setShowAddPieceModal(false)
      setSelectedPiece(null)
      setPieceQuantity(1)
      await loadPieces() // Recharger les pièces pour avoir les stocks à jour
      toast.success("Pièce ajoutée avec succès")
    } catch (err) {
      console.error("Error adding piece:", err)
      toast.error("Erreur lors de l'ajout de la pièce")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Chargement de l'intervention...</p>
        </div>
      </div>
    )
  }

  if (error || !intervention) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || "Intervention non trouvée"}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Intervention ID: {interventionId}</h1>
              <p className="text-gray-500">
                {intervention.appointment
                  ? `Véhicule: ${intervention.appointment.vehicle?.brand} ${intervention.appointment.vehicle?.model}`
                  : "Intervention sans rendez-vous"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(intervention.status)}
              {intervention.status !== Status.COMPLETED && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : null}
                  Terminer l'intervention
                </button>
              )}
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("details")}
              >
                Détails
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "invoice" ? "border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
                onClick={() => setActiveTab("invoice")}
              >
                Facture
              </button>
            </div>
          </div>

          {activeTab === "details" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Détails de l'intervention</h2>
                <button
                  className={`px-3 py-1 rounded-md ${isEditing ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={intervention.status === Status.COMPLETED}
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      id="description"
                      value={intervention.description || ""}
                      onChange={(event) => setIntervention({ ...intervention, description: event.target.value })}
                      disabled={!isEditing || intervention.status === Status.COMPLETED}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de la main d'œuvre (DT)
                    </label>
                    <input
                      id="price"
                      type="number"
                      value={intervention.price}
                      onChange={(event) =>
                        setIntervention({ ...intervention, price: Number.parseFloat(event.target.value) })
                      }
                      disabled={!isEditing || intervention.status === Status.COMPLETED}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      id="startDate"
                      type="datetime-local"
                      value={new Date(intervention.startDate).toISOString().slice(0, 16)}
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin estimée
                    </label>
                    <input
                      id="endDate"
                      type="datetime-local"
                      value={new Date(intervention.endDate).toISOString().slice(0, 16)}
                      onChange={(event) => setIntervention({ ...intervention, endDate: event.target.value })}
                      disabled={!isEditing || intervention.status === Status.COMPLETED}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Pièces détachées</h3>
                 
                </div>
                <div className="border rounded-md overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nom</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantité</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Prix unitaire (DT)</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total (DT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {intervention.interventionPieces?.length ? (
                        intervention.interventionPieces.map((piece) => (
                          <tr key={piece.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 text-sm font-medium">{piece.piece?.name || "Pièce inconnue"}</td>
                            <td className="px-4 py-2 text-sm">
                              {isEditing && intervention.status !== Status.COMPLETED ? (
                                <input
                                  type="number"
                                  value={piece.quantity}
                                  onChange={(event) => handlePieceQuantityChange(piece.id, parseInt(event.target.value))}
                                  className="w-20 p-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  min="0"
                                />
                              ) : (
                                piece.quantity
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-right">{piece.piece?.price?.toFixed(2) || "0.00"}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">{piece.totalPrice?.toFixed(2) || "0.00"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                            Aucune pièce détachée pour cette intervention
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Pièces utilisées</h3>
                  <button
                    onClick={() => setShowAddPieceModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaPlus className="mr-2" />
                    Ajouter une pièce
                  </button>
                </div>
                
                {intervention.interventionPieces && intervention.interventionPieces.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pièce</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {intervention.interventionPieces.map((piece) => (
                          <tr key={piece.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {piece.piece?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={piece.quantity}
                                  onChange={(e) => handlePieceQuantityChange(piece.id, parseInt(e.target.value))}
                                  className="w-20 px-2 py-1 border rounded"
                                />
                              ) : (
                                piece.quantity
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {piece.piece?.price.toFixed(2)} DT
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {(piece.totalPrice || 0).toFixed(2)} DT
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {isEditing && (
                                <button
                                  onClick={() => {
                                    const newPieces = intervention.interventionPieces?.filter(p => p.id !== piece.id)
                                    setIntervention({
                                      ...intervention,
                                      interventionPieces: newPieces
                                    })
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Supprimer
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune pièce utilisée</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">Total: {calculateTotal().toFixed(2)} DT</div>
                {isEditing && (
                  <button
                    onClick={handleUpdate}
                    disabled={isSubmitting || intervention.status === Status.COMPLETED}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : null}
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "invoice" && (
            <div className="bg-white p-6 rounded-lg shadow-md" id="invoice-content">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Facture</h2>
              
              </div>
              <p className="text-sm text-gray-500 mb-6">Détails de la facture pour l'intervention #{interventionId}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Informations générales</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Description:</span>
                      <span>{intervention.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date de début:</span>
                      <span>{new Date(intervention.startDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date de fin:</span>
                      <span>{new Date(intervention.endDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Statut:</span>
                      <span>{getStatusBadge(intervention.status)}</span>
                    </div>
                  </div>
                </div>

                {intervention.appointment && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informations du véhicule</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Marque:</span>
                        <span>{intervention.appointment.vehicle?.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Modèle:</span>
                        <span>{intervention.appointment.vehicle?.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Immatriculation:</span>
                        <span>{intervention.appointment.vehicle?.registration}</span>
                       
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service:</span>
                        <span>{intervention.appointment.service?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6 mb-6">
                <h3 className="text-sm font-medium mb-3">Détails des pièces</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Pièce</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Quantité</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Prix unitaire (DT)</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total (DT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {intervention.interventionPieces?.length ? (
                        intervention.interventionPieces.map((piece) => (
                          <tr key={piece.id}>
                            <td className="px-4 py-2 text-sm font-medium">{piece.piece?.name || "Pièce inconnue"}</td>
                            <td className="px-4 py-2 text-sm text-right">{piece.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{piece.piece?.price?.toFixed(2) || "0.00"}</td>
                            <td className="px-4 py-2 text-sm text-right">{piece.totalPrice?.toFixed(2) || "0.00"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                            Aucune pièce détachée pour cette intervention
                          </td>
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium">
                          Main d'œuvre
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-medium">{intervention.price.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex justify-between w-full md:w-1/3 border-t pt-4">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg">{calculateTotal().toFixed(2)} DT</span>
                </div>
                <div className="mt-6 flex gap-2">
                 
                  <button
                  onClick={() => setShowFacturePdf(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaPrint />
                  Imprimer la facture
                </button>
                </div>
              </div>
            </div>
          )}

          {showFacturePdf && intervention && (
            <FacturePdf
              intervention={intervention}
              onClose={() => setShowFacturePdf(false)}
            />
          )}

          {showAddPieceModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une pièce</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pièce</label>
                    <select
                      value={selectedPiece?.id || ''}
                      onChange={(e) => {
                        const pieceId = parseInt(e.target.value)
                        console.log('ID de la pièce sélectionnée:', pieceId)
                        console.log('Liste des pièces disponibles:', pieces)
                        const piece = pieces.find(p => p.id === pieceId)
                        console.log('Pièce trouvée:', piece)
                        if (piece) {
                          const newSelectedPiece: StockPiece = {
                            id: piece.id,
                            name: piece.name,
                            price: piece.price,
                            stock: piece.stock
                          }
                          console.log('Nouvelle pièce sélectionnée:', newSelectedPiece)
                          setSelectedPiece(newSelectedPiece)
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Sélectionner une pièce</option>
                      {pieces.map((piece) => (
                        <option key={piece.id} value={piece.id}>
                          {piece.name} - Prix: {piece.price.toFixed(2)} DT - Stock: {piece.stock}
                        </option>
                      ))}
                    </select>
                    {selectedPiece && (
                      <p className="mt-1 text-sm text-gray-500">
                        Pièce sélectionnée: {selectedPiece.name} - Prix: {selectedPiece.price.toFixed(2)} DT - Stock disponible: {selectedPiece.stock}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedPiece?.stock || 1}
                      value={pieceQuantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1
                        const maxStock = selectedPiece?.stock || 1
                        setPieceQuantity(Math.min(value, maxStock))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {selectedPiece && (
                      <p className="mt-1 text-sm text-gray-500">
                        Stock disponible: {selectedPiece.stock}
                      </p>
                    )}
                  </div>
                  {selectedPiece && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé</h4>
                      <p className="text-sm text-gray-600">Total: {(selectedPiece.price * pieceQuantity).toFixed(2)} DT</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddPieceModal(false)
                      setSelectedPiece(null)
                      setPieceQuantity(1)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddPiece}
                    disabled={!selectedPiece || pieceQuantity < 1 || pieceQuantity > (selectedPiece?.stock || 0)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
