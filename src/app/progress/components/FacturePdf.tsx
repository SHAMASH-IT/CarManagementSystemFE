import React from 'react'
import { Intervention } from '../services/progress.service'
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCar, 
  FaTools, 
  FaFileInvoice, 
  FaEuroSign, 
  FaCalendarAlt,
  FaBuilding,
  FaUser,
  FaIdCard
} from 'react-icons/fa'

interface FacturePdfProps {
  intervention: Intervention
  onClose: () => void
  isCompany?: boolean
  matriculeFiscale?: string
  rne?: string
}

const FacturePdf: React.FC<FacturePdfProps> = ({ 
  intervention, 
  onClose, 
  isCompany = false,
  matriculeFiscale,
  rne
}) => {
  const [clientRne, setClientRne] = React.useState(rne || '')
  const [isEditing, setIsEditing] = React.useState(!rne)
  const [remise, setRemise] = React.useState(0)
  const [isEditingRemise, setIsEditingRemise] = React.useState(false)

  const handleSave = () => {
    setIsEditing(false)
  }

  const calculateTotal = () => {
    if (!intervention) return 0
    const piecesTotal = intervention.interventionPieces?.reduce(
      (sum, piece) => sum + (piece.totalPrice || 0),
      0
    ) || 0
    return piecesTotal + intervention.price
  }

  const calculatePiecesTVA = () => {
    if (!intervention?.interventionPieces) return 0
    return intervention.interventionPieces.reduce(
      (sum, piece) => sum + ((piece.totalPrice || 0) * 0.07),
      0
    )
  }

  const calculateMainTVA = () => {
    return (intervention.price || 0) * 0.19
  }

  const totalTVA = calculatePiecesTVA() + calculateMainTVA()
  const fiscalStamp = 1 // 1 dinar tunisien
  const totalSansRemise = calculateTotal() + totalTVA + fiscalStamp
  const montantRemise = (totalSansRemise * remise) / 100
  const totalAvecRemise = totalSansRemise - montantRemise

  const numberToWords = (num: number): string => {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
      'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt']

    if (num === 0) return 'zéro'

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return ''
      
      if (n < 20) return units[n]
      
      if (n < 100) {
        const unit = n % 10
        const ten = Math.floor(n / 10)
        
        if (ten === 7 || ten === 9) {
          return tens[ten] + (unit === 1 ? ' et ' : '-') + units[unit + 10]
        }
        
        if (ten === 8 && unit === 0) return 'quatre-vingts'
        
        return tens[ten] + (unit === 0 ? '' : unit === 1 && ten !== 8 ? ' et ' : '-') + units[unit]
      }
      
      const hundred = Math.floor(n / 100)
      const remainder = n % 100
      
      return (hundred === 1 ? 'cent' : units[hundred] + ' cent') + 
        (remainder ? ' ' + convertLessThanThousand(remainder) : '')
    }

    const total = Math.round(num * 100) / 100
    const integerPart = Math.floor(total)
    const decimalPart = Math.round((total - integerPart) * 100)

    let result = convertLessThanThousand(integerPart)
    result += ' dinar' + (integerPart > 1 ? 's' : '')

    if (decimalPart > 0) {
      result += ' et ' + convertLessThanThousand(decimalPart)
      result += ' centime' + (decimalPart > 1 ? 's' : '')
    }

    return result
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto print:p-0 print:bg-white print:fixed print:inset-0 print:overflow-visible">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-xl print:shadow-none print:max-w-none print:mx-0 print:rounded-none print:p-4 print:absolute print:inset-0 print:overflow-visible">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 1cm;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
              }
              .print-break-inside-avoid {
                break-inside: avoid;
              }
              .print-scale {
                transform: scale(0.95);
                transform-origin: top left;
              }
              html, body {
                height: 100%;
                overflow: hidden;
              }
            }
          `}
        </style>

        {/* En-tête avec logo et informations */}
        <div className="flex justify-between items-start mb-6 print:mb-4 print-break-inside-avoid">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center print:bg-transparent print:border-2 print:border-blue-600 shadow-lg print:shadow-none">
              <FaFileInvoice className="text-white text-4xl print:text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">FACTURE</h1>
              <p className="text-blue-600 font-semibold text-base mt-1">N° {intervention.id}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end space-x-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
              <FaCalendarAlt className="text-blue-600" />
              <p className="text-sm">Date: {new Date(intervention.startDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center justify-end space-x-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
              <FaCalendarAlt className="text-blue-600" />
              <p className="text-sm">Échéance: {new Date(intervention.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Informations du prestataire et du client */}
        <div className="grid grid-cols-2 gap-6 mb-6 print:mb-4 print-break-inside-avoid">
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaTools className="mr-2 text-blue-600 text-lg" />
              Prestataire
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Rue des Mécaniciens, 1000 Tunis
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhone className="mr-2 text-blue-600" />
                +216 71 234 567
              </p>
              <p className="text-gray-600 flex items-center">
                <FaEnvelope className="mr-2 text-blue-600" />
                contact@garageautopro.tn
              </p>
              <p className="text-gray-600 flex items-center">
                <FaIdCard className="mr-2 text-blue-600" />
                Matricule Fiscale: 123 456 789
              </p>
              <p className="text-gray-600 flex items-center">
                <FaBuilding className="mr-2 text-blue-600" />
                RNE: 123 456 789
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaCar className="mr-2 text-blue-600 text-lg" />
              {isCompany ? 'Entreprise' : 'Client'}
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Client
              </p>
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Adresse non spécifiée
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhone className="mr-2 text-blue-600" />
                Téléphone non spécifié
              </p>
              {clientRne && !isEditing && (
                <div className="flex items-center">
                  <p className="text-gray-600 flex items-center">
                    <FaBuilding className="mr-2 text-blue-600" />
                    RNE:
                  </p>
                  <span className="text-gray-800 ml-2">{clientRne}</span>
                </div>
              )}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={clientRne}
                    onChange={(e) => setClientRne(e.target.value)}
                    placeholder="Ajouter le RNE si c'est une entreprise"
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSave}
                    className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setClientRne('');
                      setIsEditing(false);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    title="Supprimer le RNE"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {isCompany && (
                <p className="text-gray-600 flex items-center">
                  <FaBuilding className="mr-2 text-blue-600" />
                  Matricule Fiscale: {matriculeFiscale || 'Non spécifié'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Détails de l'intervention */}
        <div className="mb-6 print:mb-4 print-break-inside-avoid">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Détails de l'intervention</h2>
          <div className="border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Prix unitaire</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Quantité</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">Main d'œuvre</td>
                  <td className="px-4 py-3 text-right">{intervention.price?.toFixed(2)} DT</td>
                  <td className="px-4 py-3 text-right">1</td>
                  <td className="px-4 py-3 text-right font-semibold">{intervention.price?.toFixed(2)} DT</td>
                </tr>
                {intervention.interventionPieces?.map((piece) => (
                  <tr key={piece.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{piece.piece?.name}</td>
                    <td className="px-4 py-3 text-right">{piece.piece?.price?.toFixed(2)} DT</td>
                    <td className="px-4 py-3 text-right">{piece.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold">{piece.totalPrice?.toFixed(2)} DT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total et conditions */}
        <div className="border-t-2 border-gray-200 pt-6 print:pt-4 print-break-inside-avoid">
          <div className="flex justify-end mb-4">
            <div className="w-80 bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium text-gray-800">{calculateTotal().toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-600">TVA Pièces (7%):</span>
                  <span className="font-medium text-gray-800">{calculatePiecesTVA().toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-600">TVA Main d'œuvre (19%):</span>
                  <span className="font-medium text-gray-800">{calculateMainTVA().toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-600">Timbre Fiscal:</span>
                  <span className="font-medium text-gray-800">{fiscalStamp.toFixed(2)} DT</span>
                </div>
                {isEditingRemise ? (
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Remise:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={remise}
                        onChange={(e) => setRemise(Number(e.target.value))}
                        min="0"
                        max="100"
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="%"
                      />
                      <button
                        onClick={() => setIsEditingRemise(false)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Remise:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">
                        {remise > 0 ? `${remise}% (-${montantRemise.toFixed(2)} DT)` : '0%'}
                      </span>
                      <button
                        onClick={() => setIsEditingRemise(true)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                        title="Modifier la remise"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 mt-1 border-t-2 border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Total TTC:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {totalAvecRemise.toFixed(2)} DT
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl shadow-sm print:bg-transparent print:border print:border-gray-200">
            <p className="font-semibold text-gray-700 mb-2">Conditions de paiement:</p>
            <p className="mb-1">30 jours net</p>
            <p className="mb-1">RIB: TN59 1234 5678 9012 3456 7890</p>
            <p className="text-xs text-gray-400">Mentions légales: Conformément à la législation tunisienne en vigueur, des pénalités de retard sont dues à défaut de règlement le jour suivant la date de paiement qui figure sur la facture.</p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500 print:mt-4 print:pt-2">
          <p className="font-semibold text-gray-700">Garage Auto Pro</p>
          <p className="mt-1">Matricule Fiscale: 123 456 789 - TVA: TN12 34567890123</p>
          <p className="mt-1">www.garageautopro.tn - contact@garageautopro.tn - Tél: +216 71 234 567</p>
        </div>

        {/* Boutons d'action - masqués à l'impression */}
        <div className="mt-6 flex justify-end space-x-4 no-print">
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