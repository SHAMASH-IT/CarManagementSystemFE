"use client"

import { useState, useMemo } from "react"
import { useHistory } from "../hooks/useHistory"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Car,
  Wrench,
  FileText,
  AlertCircle,
  Send,
  CheckCircle2,
  Tag,
  X,
  BarChart3,
  Clock3,
  Sparkles,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function InterventionHistory() {
  const {
    completedInterventions,
    filteredInterventions,
    isLoading,
    error,
    filterInterventions,
    rateIntervention,
  } = useHistory()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIntervention, setSelectedIntervention] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState<string>("")
  const [dateRange, setDateRange] = useState<string>("all")

  const mostRequestedService = useMemo(() => {
    if (!completedInterventions.length) return { name: "Aucun service", count: 0 }

    const serviceCounts = completedInterventions.reduce(
      (acc, intervention) => {
        const serviceName = intervention.appointment?.service.name || "Service inconnu"
        acc[serviceName] = (acc[serviceName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const [mostRequested] = Object.entries(serviceCounts).sort(([, a], [, b]) => b - a)
    return {
      name: mostRequested[0],
      count: mostRequested[1],
    }
  }, [completedInterventions])

  const uniqueVehicles = useMemo(() => {
    if (!completedInterventions.length) return 0

    const vehicles = new Set(
      completedInterventions.map(
        (intervention) => intervention.appointment?.vehicle.registration || "",
      ),
    )
    return vehicles.size
  }, [completedInterventions])

  const serviceTypes = useMemo(() => {
    const types = new Set<string>()
    completedInterventions.forEach((intervention) => {
      if (intervention.appointment?.service.name) {
        types.add(intervention.appointment.service.name)
      }
    })
    return Array.from(types)
  }, [completedInterventions])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterInterventions(value)
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy 'à' HH:mm", { locale: fr })
  }

  const handleSubmitReview = async (interventionId: number) => {
    if (rating === 0) return
    setIsSubmitting(true)
    try {
      await rateIntervention(interventionId, rating, comment)
      setRating(0)
      setComment("")
      setSelectedIntervention(null)
    } catch (error) {
      console.error("Error saving review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="w-full px-0 pt-2 pb-8 bg-gray-50/50 min-h-screen">
      {/* Header avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="bg-indigo-100 p-2 rounded-xl mr-3">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          Historique des interventions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 20px -12px rgba(79, 70, 229, 0.3)" }}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-3 border border-indigo-100 shadow-sm transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="bg-indigo-100 p-1 rounded-md">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">Total</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{completedInterventions.length}</div>
            <div className="text-xs text-gray-500">Interventions réalisées</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 20px -12px rgba(245, 158, 11, 0.3)" }}
            className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-3 border border-amber-100 shadow-sm transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="bg-amber-100 p-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Populaire</span>
            </div>
            <div className="text-sm font-bold text-gray-800 line-clamp-1">{mostRequestedService.name}</div>
            <div className="text-xs text-gray-500">
              {mostRequestedService.count} intervention{mostRequestedService.count > 1 ? "s" : ""}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 20px -12px rgba(14, 165, 233, 0.3)" }}
            className="bg-gradient-to-br from-sky-50 to-white rounded-lg p-3 border border-sky-100 shadow-sm transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="bg-sky-100 p-1 rounded-md">
                <Car className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <span className="text-[10px] font-medium text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full">Véhicules servis</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{uniqueVehicles}</div>
            <div className="text-xs text-gray-500">Véhicules uniques</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par immatriculation, marque, modèle..."
              className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 hover:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex gap-3">
           
          
          </div>
        </div>

      
      </motion.div>

      {/* Liste des interventions */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-gray-200"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Chargement en cours</h3>
            <p className="text-gray-500">Nous récupérons votre historique d'interventions...</p>
          </div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start shadow-lg"
          >
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-1">Erreur lors du chargement</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        ) : filteredInterventions.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100"
          >
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Aucune intervention trouvée</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nous n'avons trouvé aucune intervention correspondant à vos critères. Essayez de modifier vos filtres.
            </p>
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch("")}
                className="mt-6 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors inline-flex items-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Effacer la recherche
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-300 to-transparent rounded-full"></div>
            {filteredInterventions.map((intervention, index) => (
              <motion.div key={index} variants={itemVariants} className="relative pl-16">
                <div className="absolute left-8 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 shadow-md z-10"></div>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.1)" }}
                  className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 transition-all cursor-pointer ${
                    selectedIntervention === intervention.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() =>
                    setSelectedIntervention(selectedIntervention === intervention.id ? null : intervention.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-xl shadow-md">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {intervention.appointment?.vehicle.brand} {intervention.appointment?.vehicle.model}
                        </h3>
                        <p className="text-gray-500 flex items-center mt-1">
                          <Tag className="w-4 h-4 mr-1.5 text-indigo-500" />
                          {intervention.appointment?.vehicle.registration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <span className="text-sm font-medium text-emerald-700 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Terminé
                        </span>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          selectedIntervention === intervention.id
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            selectedIntervention === intervention.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Calendar className="w-4 h-4 mr-2.5 text-indigo-500" />
                      {formatDate(intervention.startDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Wrench className="w-4 h-4 mr-2.5 text-violet-500" />
                      {intervention.appointment?.service.name}
                    </div>
                    <div className="flex items-center text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 mr-2.5" />
                      Intervention réussie
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedIntervention === intervention.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 pt-8 border-t border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 shadow-md border border-amber-100">
                          <h4 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                            <div className="bg-amber-100 p-2 rounded-lg mr-3">
                              <Star className="w-5 h-5 text-amber-600" />
                            </div>
                            Partagez votre expérience
                          </h4>

                          <div className="space-y-6">
                            {/* Note */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                              <label className="block text-sm font-medium text-gray-700 mb-4">
                                Comment évalueriez-vous cette intervention ?
                              </label>
                              <div className="flex gap-3 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.button
                                    key={star}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setRating(star)
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-2 rounded-full transition-all ${
                                      star <= rating
                                        ? "text-amber-500 bg-amber-50 border border-amber-200"
                                        : "text-gray-300 hover:text-amber-400 hover:bg-amber-50/50 border border-transparent"
                                    }`}
                                  >
                                    <Star className="w-8 h-8" fill={star <= rating ? "currentColor" : "none"} />
                                  </motion.button>
                                ))}
                              </div>
                              <div className="mt-3 text-sm text-center font-medium">
                                {rating === 0 && <span className="text-gray-400">Sélectionnez une note</span>}
                                {rating === 1 && <span className="text-red-500">Insatisfait</span>}
                                {rating === 2 && <span className="text-orange-500">Peut mieux faire</span>}
                                {rating === 3 && <span className="text-amber-500">Correct</span>}
                                {rating === 4 && <span className="text-lime-500">Très bien</span>}
                                {rating === 5 && <span className="text-emerald-500">Excellent</span>}
                              </div>
                            </div>

                            {/* Commentaire */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-4">
                                Votre commentaire
                              </label>
                              <textarea
                                id="comment"
                                rows={4}
                                value={comment}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  setComment(e.target.value)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors bg-gray-50/50 hover:bg-white focus:bg-white"
                                placeholder="Dites-nous ce que vous avez pensé de cette intervention..."
                              />
                              <div className="mt-3 text-sm text-gray-500 flex items-start">
                                <div className="bg-amber-100 p-1 rounded-md mr-2 mt-0.5">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                </div>
                                Votre avis aidera d'autres clients à faire le meilleur choix.
                              </div>
                            </div>

                            {/* Bouton d'envoi */}
                            <div className="flex justify-end">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSubmitReview(intervention.id)
                                }}
                                disabled={rating === 0 || isSubmitting}
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -10px rgba(245, 158, 11, 0.5)" }}
                                whileTap={{ scale: 0.97 }}
                                className={`inline-flex items-center px-8 py-3.5 rounded-xl text-sm font-medium transition-all ${
                                  rating === 0 || isSubmitting
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg"
                                }`}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                    Envoi en cours...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-5 h-5 mr-3" />
                                    Publier mon avis
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
