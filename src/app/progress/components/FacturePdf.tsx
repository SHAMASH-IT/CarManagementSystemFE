import React from 'react'
import { Intervention } from '../services/progress.service'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaTools, FaFileInvoice, FaEuroSign, FaCalendarAlt } from 'react-icons/fa'

interface FacturePdfProps {
  intervention: Intervention
  onClose: () => void
}

const FacturePdf: React.FC<FacturePdfProps> = ({ intervention, onClose }) => {
  const calculateTotal = () => {
    if (!intervention) return 0
    const piecesTotal = intervention.interventionPieces?.reduce(
      (sum, piece) => sum + (piece.totalPrice || 0),
      0
    ) || 0
    return piecesTotal + intervention.price
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-xl print:shadow-none print:max-w-none print:mx-0 print:rounded-none">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          `}
        </style>

        {/* En-tête avec logo et informations */}
        <div className="flex justify-between items-start mb-10 print:mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center print:bg-transparent print:border-2 print:border-blue-600 shadow-lg print:shadow-none">
              <FaFileInvoice className="text-white text-4xl print:text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">FACTURE</h1>
              <p className="text-blue-600 font-semibold text-lg mt-1">N° {intervention.id}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end space-x-2 text-gray-600">
              <FaCalendarAlt className="text-blue-600" />
              <p>Date: {new Date(intervention.startDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center justify-end space-x-2 text-gray-600">
              <FaCalendarAlt className="text-blue-600" />
              <p>Échéance: {new Date(intervention.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Informations du prestataire et du client */}
        <div className="grid grid-cols-2 gap-8 mb-10 print:mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTools className="mr-3 text-blue-600 text-xl" />
              Prestataire
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-blue-600 text-lg" />
                123 Rue des Mécaniciens, 75000 Paris
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhone className="mr-3 text-blue-600 text-lg" />
                01 23 45 67 89
              </p>
              <p className="text-gray-600 flex items-center">
                <FaEnvelope className="mr-3 text-blue-600 text-lg" />
                contact@garageautopro.com
              </p>
              <p className="text-gray-600">SIRET: 123 456 789 00000</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCar className="mr-3 text-blue-600 text-xl" />
              Client
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">Client</p>
              <p className="text-gray-600">Adresse non spécifiée</p>
              <p className="text-gray-600">Téléphone non spécifié</p>
            </div>
          </div>
        </div>

        {/* Détails de l'intervention */}
        <div className="mb-10 print:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Détails de l'intervention</h2>
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Prix unitaire</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Quantité</th>
                  <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Main d'œuvre */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-sm">Main d'œuvre</td>
                  <td className="px-8 py-5 text-sm text-right">{intervention.price?.toFixed(2)} DT</td>
                  <td className="px-8 py-5 text-sm text-right">1</td>
                  <td className="px-8 py-5 text-sm text-right font-semibold">{intervention.price?.toFixed(2)} DT</td>
                </tr>
                {/* Pièces détachées */}
                {intervention.interventionPieces?.map((piece) => (
                  <tr key={piece.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-sm">{piece.piece?.name}</td>
                    <td className="px-8 py-5 text-sm text-right">{piece.piece?.price?.toFixed(2)} DT</td>
                    <td className="px-8 py-5 text-sm text-right">{piece.quantity}</td>
                    <td className="px-8 py-5 text-sm text-right font-semibold">{piece.totalPrice?.toFixed(2)} DT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total et conditions */}
        <div className="border-t-2 border-gray-200 pt-8 print:pt-6">
          <div className="flex justify-end mb-6">
            <div className="text-right space-y-3">
              <p className="text-gray-600 flex items-center justify-end">
                Sous-total: {calculateTotal().toFixed(2)} DT
              </p>
              <p className="text-gray-600 flex items-center justify-end">
                TVA (20%): {(calculateTotal() * 0.2).toFixed(2)} DT
              </p>
              <p className="text-3xl font-bold text-blue-600 flex items-center justify-end">
               
                Total TTC: {(calculateTotal() * 1.2).toFixed(2)} DT
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <p className="font-semibold text-gray-700 mb-3">Conditions de paiement:</p>
            <p className="mb-2">30 jours net</p>
            <p className="mb-2">IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXXX</p>
            <p className="text-xs text-gray-400">Mentions légales: Conformément à l'article L. 441-6 du code de commerce, des pénalités de retard sont due à défaut de règlement le jour suivant la date de paiement qui figure sur la facture.</p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 print:mt-6 print:pt-4">
          <p className="font-semibold text-gray-700">Garage Auto Pro</p>
          <p className="mt-1">RCS Paris B 123 456 789 - TVA intracommunautaire: FR12 34567890123</p>
          <p className="mt-2">www.garageautopro.com - contact@garageautopro.com - Tél: 01 23 45 67 89</p>
        </div>

        {/* Boutons d'action - masqués à l'impression */}
        <div className="mt-10 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow"
          >
            Fermer
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-sm hover:shadow"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default FacturePdf