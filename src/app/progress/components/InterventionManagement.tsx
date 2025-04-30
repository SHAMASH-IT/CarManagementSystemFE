
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "../hooks/useProgress"
import { type Intervention, Status, type UpdateInterventionDto } from "../services/progress.service"
import Sidebar from "../../common/Sidebar"
import Navbar from "../../common/Navbar"
import { FaPrint, FaPlus } from 'react-icons/fa'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import FacturePdf from './FacturePdf'
import AddPieceModal from './AddPieceModal'
import { stockService } from '../../stock/services/stockService'

export default function InterventionManagement({ interventionId }: { interventionId: number }) {
  const router = useRouter()
  const { loading, error, getIntervention, updateIntervention, completeIntervention } = useProgress()
  const [intervention, setIntervention] = useState<Intervention | null>(null)
  const [pendingIntervention, setPendingIntervention] = useState<Intervention | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [showFacturePdf, setShowFacturePdf] = useState(false)
  const [showAddPieceModal, setShowAddPieceModal] = useState(false)
  const [pendingInterventionPieces, setPendingInterventionPieces] = useState<any[]>([])
  const [pieces, setPieces] = useState<any[]>([])

  useEffect(() => {
    loadIntervention()
  }, [interventionId])

  const loadIntervention = async () => {
    try {
      const data = await getIntervention(interventionId)
      const stocks = await stockService.getAllStocks()
      const interventionPieces = data.interventionPieces?.map((piece) => {
        const stockPiece = stocks.find((s) => Number(s.id) === piece.pieceId)
        return {
          ...piece,
          piece: stockPiece
            ? { id: Number(stockPiece.id), name: stockPiece.name, price: stockPiece.price }
            : piece.piece,
        }
      }) || []
      const updatedIntervention = { ...data, interventionPieces }
      setIntervention(updatedIntervention)
      setPendingIntervention(updatedIntervention)
      setPendingInterventionPieces(interventionPieces)
      setPieces(stocks)
      setValidationErrors([])
      setSuccessMessage("")
    } catch (err) {
      console.error("Error loading intervention:", err)
      setValidationErrors(["Erreur lors du chargement de l'intervention"])
    }
  }

  const handleStartEditing = () => {
    if (!intervention) return;
    setPendingIntervention({ 
      id: intervention.id,
      description: intervention.description,
      startDate: intervention.startDate,
      endDate: intervention.endDate,
      price: intervention.price,
      status: intervention.status,
      appointmentId: intervention.appointmentId,
      appointment: intervention.appointment,
      interventionPieces: intervention.interventionPieces || []
    });
    setPendingInterventionPieces([...(intervention.interventionPieces || [])]);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (!intervention) return;
    setPendingIntervention({ 
      id: intervention.id,
      description: intervention.description,
      startDate: intervention.startDate,
      endDate: intervention.endDate,
      price: intervention.price,
      status: intervention.status,
      appointmentId: intervention.appointmentId,
      appointment: intervention.appointment,
      interventionPieces: intervention.interventionPieces || []
    });
    setPendingInterventionPieces([...(intervention.interventionPieces || [])]);
    setIsEditing(false);
    setValidationErrors([]);
  };

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
    if (!pendingIntervention) return;
    const errors = validateIntervention({ ...pendingIntervention, interventionPieces: pendingInterventionPieces });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      setIsSubmitting(true);
      const updateData = {
        description: pendingIntervention.description,
        price: pendingIntervention.price,
        status: pendingIntervention.status,
        endDate: pendingIntervention.endDate,
        pieces: pendingInterventionPieces.map((piece: any) => ({
          id: piece.pieceId,
          quantity: piece.quantity,
          price: piece.piece?.price || 0,
        })),
      };
      await updateIntervention(interventionId, updateData);
      setIsEditing(false);
      setSuccessMessage("Intervention mise à jour avec succès");
      await loadIntervention();
    } catch (err) {
      console.error("Error updating intervention:", err);
      setValidationErrors(["Erreur lors de la mise à jour de l'intervention"]);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setPendingInterventionPieces(prev =>
      prev.map((p: any) =>
        p.pieceId === pieceId
          ? { ...p, quantity: Math.max(0, quantity), totalPrice: Math.max(0, quantity) * (p.piece?.price || 0) }
          : p
      )
    );
  };

  const calculateTotal = () => {
    if (!pendingInterventionPieces) return 0
    const piecesTotal = pendingInterventionPieces.reduce((sum, piece) => sum + (piece.totalPrice || 0), 0) || 0
    return piecesTotal + (pendingIntervention?.price || 0)
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

  const handleAddPiece = (pieceId: number, quantity: number) => {
    const pieceData = pieces.find(p => Number(p.id) === Number(pieceId));
    if (!pieceData) return;
    setPendingInterventionPieces(prev => {
      const existing = prev.find((p: any) => p.pieceId === pieceId);
      if (existing) {
        return prev.map((p: any) =>
          p.pieceId === pieceId
            ? { ...p, quantity: p.quantity + quantity, totalPrice: (p.quantity + quantity) * (pieceData.price || 0) }
            : p
        );
      } else {
        return [
          ...prev,
          {
            id: Date.now(),
            pieceId,
            quantity,
            totalPrice: quantity * (pieceData.price || 0),
            piece: pieceData
          }
        ];
      }
    });
  };

  const handleRemovePiece = (pieceId: number) => {
    setPendingInterventionPieces(prev => prev.filter((p: any) => p.pieceId !== pieceId));
  };

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

  const displayedPieces = isEditing ? pendingInterventionPieces : intervention.interventionPieces || [];

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
                  onClick={() => isEditing ? handleCancelEditing() : handleStartEditing()}
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
                      value={isEditing ? pendingIntervention?.description || "" : intervention?.description || ""}
                      onChange={(event) => setPendingIntervention(prev => ({ ...prev!, description: event.target.value }))}
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
                      value={isEditing ? pendingIntervention?.price : intervention?.price}
                      onChange={(event) =>
                        setPendingIntervention(prev => ({ ...prev!, price: Number.parseFloat(event.target.value) }))
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
                      value={isEditing 
                        ? new Date(pendingIntervention?.endDate || "").toISOString().slice(0, 16)
                        : new Date(intervention.endDate).toISOString().slice(0, 16)
                      }
                      onChange={(event) => setPendingIntervention(prev => ({ ...prev!, endDate: event.target.value }))}
                      disabled={!isEditing || intervention.status === Status.COMPLETED}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Pièces détachées</h3>
                  {isEditing && intervention.status !== Status.COMPLETED && (
                    <button
                      onClick={() => setShowAddPieceModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                      <FaPlus className="text-sm" />
                      <span>Ajouter une pièce</span>
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Pièce</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Quantité</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Prix unitaire</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Total</th>
                        {isEditing && intervention.status !== Status.COMPLETED && (
                          <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedPieces.length ? (
                        displayedPieces.map((piece) => (
                          <tr key={piece.pieceId} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {piece.piece?.name || "Pièce inconnue"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {piece.pieceId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={piece.quantity}
                                    onChange={(event) => handlePieceQuantityChange(piece.pieceId, parseInt(event.target.value))}
                                    className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                  />
                                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-900">{piece.quantity}</span>
                                  <span className="text-xs text-gray-400">unités</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm text-gray-900">
                                {piece.piece?.price?.toFixed(2) || "0.00"} DT
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-medium text-gray-900">
                                {piece.totalPrice?.toFixed(2) || "0.00"} DT
                              </span>
                            </td>
                            {isEditing && intervention.status !== Status.COMPLETED && (
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleRemovePiece(piece.pieceId)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                  title="Supprimer la pièce"
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isEditing ? 5 : 4} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <p className="text-sm">Aucune pièce détachée pour cette intervention</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                      {pendingInterventionPieces?.length ? (
                        pendingInterventionPieces.map((piece) => (
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
        </main>
      </div>

      <AddPieceModal
        isOpen={showAddPieceModal}
        onClose={() => setShowAddPieceModal(false)}
        onAddPiece={handleAddPiece}
        interventionId={interventionId}
      />
    </div>
  )
}
