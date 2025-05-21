"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useHistoryWithInvoice } from "../hooks/useHistoryWithInvoice"
import type { Intervention } from "../types/intervention.types"
import FacturePdf from "../../progress/components/FacturePdf"
import {
  Search,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Car,
  User,
  Eye,
  Printer,
  Clock,
  CalendarCheck,
} from "lucide-react"

interface HistoryViewProps {
  userRole: string;
  userId: number;
}

export default function HistoryView({ userRole, userId }: HistoryViewProps) {
  const router = useRouter();
  const { completedInterventions, isLoading, error } = useHistoryWithInvoice(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFacturePdf, setShowFacturePdf] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  useEffect(() => {
    console.log("Completed interventions:", completedInterventions);
  }, [completedInterventions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleViewInvoice = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setShowFacturePdf(true);
  };

  const handlePrintInvoice = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setShowFacturePdf(true);
  };

  const filteredInterventions = completedInterventions.filter((intervention) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      intervention.appointment?.vehicle.registration.toLowerCase().includes(searchTermLower) ||
      intervention.appointment?.vehicle.brand.toLowerCase().includes(searchTermLower) ||
      intervention.appointment?.vehicle.model.toLowerCase().includes(searchTermLower) ||
      (userRole === "ADMIN" && intervention.appointment?.service.name.toLowerCase().includes(searchTermLower)) ||
      intervention.description?.toLowerCase().includes(searchTermLower);

    const matchesService = !serviceFilter || intervention.appointment?.service.name === serviceFilter;

    return matchesSearch && matchesService;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  console.log("Filtered interventions:", filteredInterventions);

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Suivi des Interventions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Consultez l'historique complet de vos interventions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={userRole === "ADMIN" 
                  ? "Rechercher par plaque, marque, modèle, service..." 
                  : "Rechercher par plaque, marque, modèle..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {userRole === "ADMIN" && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <Filter className="h-5 w-5" />
                <span>Filtres</span>
                {showFilters ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && userRole === "ADMIN" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="">Tous les services</option>
                    {Array.from(new Set(completedInterventions.map(i => i.appointment?.service.name))).map(serviceName => (
                      <option key={serviceName} value={serviceName}>
                        {serviceName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                {userRole === "ADMIN" && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note & Avis
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInterventions.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "ADMIN" ? 6 : 5} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Aucune intervention trouvée</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInterventions.map((intervention) => (
                  <motion.tr
                    key={intervention.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm space-y-2">
                        <div className="flex items-center text-gray-900">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Début:</span>
                          <span className="ml-2">{formatDate(intervention.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <CalendarCheck className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium">Fin:</span>
                          <span className="ml-2">{formatDate(intervention.endDate)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        intervention.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {intervention.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {intervention.appointment?.vehicle.brand}{" "}
                            {intervention.appointment?.vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {intervention.appointment?.vehicle.registration}
                          </div>
                        </div>
                      </div>
                    </td>
                    {userRole === "ADMIN" && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {intervention.appointment?.service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {intervention.description}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {intervention.price.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "TND",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          {(intervention as any).rate ? (
                            <>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (intervention as any).rate
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {(intervention as any).rate}/5
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Non noté</span>
                          )}
                        </div>
                        {(intervention as any).commentaire ? (
                          <div className="text-sm text-gray-600">
                            {(intervention as any).commentaire}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Pas d'avis</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(intervention)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:bg-blue-50 rounded-lg"
                          title="Voir la facture"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(intervention)}
                          className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                          title="Imprimer la facture"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFacturePdf && selectedIntervention && (
        <FacturePdf
          intervention={selectedIntervention}
          onClose={() => {
            setShowFacturePdf(false);
            setSelectedIntervention(null);
          }}
        />
      )}
    </div>
  );
} 
