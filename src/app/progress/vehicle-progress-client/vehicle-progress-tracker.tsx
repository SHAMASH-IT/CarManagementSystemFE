"use client"

import { useState, useEffect } from "react"
import { useProgress } from "../hooks/useProgress"
import { type Intervention, Status } from "../services/progress.service"
import {
  Search,
  Calendar,
  Clock,
  PenToolIcon as Tool,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
  FileText,
  RefreshCw,
  Car,
  Clock3,
  ShieldCheck,
  BarChart3,
  Wrench,
  MapPin,
  Phone,
  History,
  ChevronRight,
  User,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function VehicleProgressTracker() {
  const [registration, setRegistration] = useState("")
  const [searchResult, setSearchResult] = useState<Intervention | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const { searchVehicle } = useProgress()

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("vehicleSearchHistory")
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse search history", e)
      }
    }
  }, [])

  const handleSearch = async () => {
    if (!registration.trim()) {
      setError("Veuillez entrer une immatriculation")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const result = await searchVehicle(registration)

      if (result) {
        setSearchResult(result)

        // Add to search history if not already present
        if (!searchHistory.includes(registration)) {
          const newHistory = [registration, ...searchHistory].slice(0, 5)
          setSearchHistory(newHistory)
          localStorage.setItem("vehicleSearchHistory", JSON.stringify(newHistory))
        }
      } else {
        setError("Aucun véhicule trouvé avec cette immatriculation")
        setSearchResult(null)
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la recherche")
      console.error(err)
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non disponible"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTimeRemaining = (endDate: string) => {
    if (!endDate) return null

    const end = new Date(endDate)
    const now = new Date()

    if (now > end) return null

    const diffMs = end.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays} jour${diffDays > 1 ? "s" : ""} et ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return `${diffHours} heure${diffHours > 1 ? "s" : ""}`
    }
  }

  const selectFromHistory = (reg: string) => {
    setRegistration(reg)
  }

  const getStatusInfo = (status: Status) => {
    switch (status) {
      case Status.RESERVED:
        return {
          label: "Réservé",
          color: "bg-blue-50 text-blue-700 border-blue-100",
          badgeColor: "bg-blue-50 text-blue-700",
          icon: <Calendar className="w-4 h-4 mr-1" />,
          progress: 25,
          description: "Votre véhicule est réservé pour une intervention",
          steps: [
            { done: true, label: "Réservation confirmée" },
            { done: false, label: "Intervention" },
            { done: false, label: "Finalisation" },
          ],
        }
      case Status.IN_PROGRESS:
        return {
          label: "En cours",
          color: "bg-[#FFEB3B] text-gray-800 border-[#FFEB3B]/20",
          badgeColor: "bg-[#FFEB3B] text-gray-800",
          icon: <Tool className="w-4 h-4 mr-1" />,
          progress: 60,
          description: "Votre véhicule est actuellement en cours d'intervention",
          steps: [
            { done: true, label: "Réservation confirmée" },
            { done: true, label: "Intervention en cours" },
            { done: false, label: "Finalisation" },
          ],
        }
      case Status.COMPLETED:
        return {
          label: "Terminé",
          color: "bg-green-50 text-green-700 border-green-100",
          badgeColor: "bg-green-50 text-green-700",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
          progress: 100,
          description: "L'intervention sur votre véhicule est terminée",
          steps: [
            { done: true, label: "Réservation confirmée" },
            { done: true, label: "Intervention" },
            { done: true, label: "Finalisation" },
          ],
        }
      case Status.CANCELLED:
        return {
          label: "Annulé",
          color: "bg-gray-50 text-gray-700 border-gray-100",
          badgeColor: "bg-gray-50 text-gray-700",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
          progress: 0,
          description: "L'intervention sur votre véhicule a été annulée",
          steps: [
            { done: false, label: "Intervention annulée" },
            { done: false, label: "Contactez-nous pour plus d'informations" },
          ],
        }
      default:
        return {
          label: status,
          color: "bg-gray-50 text-gray-700 border-gray-100",
          badgeColor: "bg-gray-50 text-gray-700",
          icon: <Clock className="w-4 h-4 mr-1" />,
          progress: 0,
          description: "Statut indéterminé",
          steps: [],
        }
    }
  }

  const getDynamicColors = (status: Status) => {
    switch (status) {
      case Status.RESERVED:
        return {
          gradient: "from-blue-400 to-blue-500",
          gradientLight: "from-blue-50 to-blue-100",
          primary: "blue-500",
          primaryLight: "blue-50",
          primaryDark: "blue-600",
          accent: "blue-400",
          border: "blue-100",
          text: "blue-700",
          progressBar: "from-blue-400 to-blue-500",
          buttonHover: "blue-600",
          buttonBg: "blue-500",
        }
      case Status.IN_PROGRESS:
        return {
          gradient: "from-[#FFEB3B] to-[#FFEB3B]/90",
          gradientLight: "from-[#FFEB3B]/10 to-[#FFEB3B]/20",
          primary: "[#FFEB3B]",
          primaryLight: "[#FFEB3B]/10",
          primaryDark: "[#FFEB3B]/80",
          accent: "[#FFEB3B]",
          border: "[#FFEB3B]/20",
          text: "gray-800",
          progressBar: "from-[#FFEB3B] to-[#FFEB3B]/90",
          buttonHover: "[#FFEB3B]/80",
          buttonBg: "[#FFEB3B]",
        }
      case Status.COMPLETED:
        return {
          gradient: "from-green-400 to-green-500",
          gradientLight: "from-green-50 to-green-100",
          primary: "green-500",
          primaryLight: "green-50",
          primaryDark: "green-600",
          accent: "green-400",
          border: "green-100",
          text: "green-700",
          progressBar: "from-green-400 to-green-500",
          buttonHover: "green-600",
          buttonBg: "green-500",
        }
      case Status.CANCELLED:
        return {
          gradient: "from-gray-400 to-gray-500",
          gradientLight: "from-gray-50 to-gray-100",
          primary: "gray-500",
          primaryLight: "gray-50",
          primaryDark: "gray-600",
          accent: "gray-400",
          border: "gray-100",
          text: "gray-700",
          progressBar: "from-gray-400 to-gray-500",
          buttonHover: "gray-600",
          buttonBg: "gray-500",
        }
      default:
        return {
          gradient: "from-gray-400 to-gray-500",
          gradientLight: "from-gray-50 to-gray-100",
          primary: "gray-500",
          primaryLight: "gray-50",
          primaryDark: "gray-600",
          accent: "gray-400",
          border: "gray-100",
          text: "gray-700",
          progressBar: "from-gray-400 to-gray-500",
          buttonHover: "gray-600",
          buttonBg: "gray-500",
        }
    }
  }

  return (
    <div className="w-full px-0 pt-0 pb-8 bg-gray-50">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
        <div className="p-6 md:p-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Car className="w-6 h-6 mr-2 text-gray-600" />
            Suivi de votre véhicule
          </h2>
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  placeholder="Saisissez votre immatriculation"
                  className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm [&::placeholder]:flex [&::placeholder]:items-center [&::placeholder]:gap-1 [&::placeholder]:before:content-['🔍'] [&::placeholder]:before:text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3.5 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[120px] shadow-sm"
              >
                {isSearching ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 space-y-6"
          >
            {/* Get dynamic colors based on status */}
            {(() => {
              const colors = getDynamicColors(searchResult.status)

              return (
                <>
                  {/* Vehicle Header */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center">
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mr-4 shadow-inner">
                            <Car className="w-8 h-8 text-gray-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                              {searchResult.appointment?.vehicle.brand} {searchResult.appointment?.vehicle.model}
                            </h2>
                            <p className="text-gray-600 flex items-center mt-1">
                              Immatriculation:{" "}
                              <span className="font-medium ml-1 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                {searchResult.appointment?.vehicle.registration}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusInfo(searchResult.status).color} shadow-sm`}
                          >
                            {getStatusInfo(searchResult.status).icon}
                            <span className="ml-1 font-medium">{getStatusInfo(searchResult.status).label}</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Status Card with Progress */}
                      <div className={`bg-white rounded-xl border border-${colors.border} shadow-sm overflow-hidden`}>
                        <div className={`p-4 border-b bg-gradient-to-r ${colors.gradientLight}`}>
                          <h3 className="text-lg font-medium flex items-center">
                            <BarChart3 className={`w-5 h-5 mr-2 text-${colors.primary}`} />
                            État d'avancement
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(searchResult.status).badgeColor}`}
                                >
                                  {getStatusInfo(searchResult.status).icon}
                                  {getStatusInfo(searchResult.status).label}
                                </span>
                                <p className="mt-2 text-sm text-gray-600">
                                  {getStatusInfo(searchResult.status).description}
                                </p>
                              </div>

                              {getTimeRemaining(searchResult.endDate) && (
                                <motion.div
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className={`bg-gradient-to-r ${colors.gradientLight} rounded-xl p-4 flex items-center shadow-sm border border-${colors.border}`}
                                >
                                  <Clock3 className={`w-6 h-6 text-${colors.primary} mr-3`} />
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">Temps estimé restant</p>
                                    <p className={`text-xl font-bold text-${colors.primary}`}>
                                      {getTimeRemaining(searchResult.endDate)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {searchResult.status !== Status.CANCELLED && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progression</span>
                                  <span className="font-medium">{getStatusInfo(searchResult.status).progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getStatusInfo(searchResult.status).progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full`}
                                  ></motion.div>
                                </div>
                              </div>
                            )}

                            <div className="pt-4">
                              <div className="flex justify-between mb-4">
                                {getStatusInfo(searchResult.status).steps.map((step, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col items-center"
                                    style={{ width: `${100 / getStatusInfo(searchResult.status).steps.length}%` }}
                                  >
                                    <motion.div
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: index * 0.2 }}
                                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                        step.done
                                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                                          : "bg-gray-100 border border-gray-300"
                                      }`}
                                    >
                                      {step.done ? (
                                        <CheckCircle className="w-5 h-5" />
                                      ) : (
                                        <span className="text-xs">{index + 1}</span>
                                      )}
                                    </motion.div>
                                    <span className="text-xs text-center font-medium">{step.label}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="relative mt-2">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getStatusInfo(searchResult.status).progress}%` }}
                                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                  className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${colors.progressBar} rounded-full`}
                                ></motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Two-column layout for vehicle and service info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vehicle Info */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`bg-white rounded-xl border border-${colors.border} shadow-sm overflow-hidden`}
                        >
                          <div className={`p-4 border-b bg-gradient-to-r ${colors.gradientLight}`}>
                            <h3 className="text-lg font-medium flex items-center">
                              <Car className={`w-5 h-5 mr-2 text-${colors.primary}`} />
                              Informations véhicule
                            </h3>
                          </div>
                          <div className="p-5">
                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Marque</p>
                                <p className="font-medium text-gray-800">{searchResult.appointment?.vehicle.brand}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Modèle</p>
                                <p className="font-medium text-gray-800">{searchResult.appointment?.vehicle.model}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Immatriculation</p>
                                <p
                                  className={`font-medium text-gray-800 bg-${colors.primaryLight} inline-block px-2 py-0.5 rounded`}
                                >
                                  {searchResult.appointment?.vehicle.registration}
                                </p>
                              </div>

                              <div className="flex items-center mt-2 pt-4 border-t border-gray-100">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" />
                                <span className="text-sm">Garantie 3 mois sur pièces et main d'œuvre</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Service Info */}
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className={`bg-white rounded-xl border border-${colors.border} shadow-sm overflow-hidden`}
                        >
                          <div className={`p-4 border-b bg-gradient-to-r ${colors.gradientLight}`}>
                            <h3 className="text-lg font-medium flex items-center">
                              <Wrench className={`w-5 h-5 mr-2 text-${colors.primary}`} />
                              Détails de l'intervention
                            </h3>
                          </div>
                          <div className="p-5">
                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Service</p>
                                <p className="font-medium text-gray-800">{searchResult.appointment?.service.name}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Prix estimé</p>
                                <p className={`font-medium text-${colors.primary} text-lg`}>
                                  {searchResult.price ? `${searchResult.price.toFixed(2)} DT` : "Non disponible"}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Date de début</p>
                                <div className="flex items-center">
                                  <Calendar className={`w-4 h-4 mr-1.5 text-${colors.primary}`} />
                                  <p className="font-medium text-gray-800">{formatDate(searchResult.startDate)}</p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">Date de fin prévue</p>
                                <div className="flex items-center">
                                  <Calendar className={`w-4 h-4 mr-1.5 text-${colors.primary}`} />
                                  <p className="font-medium text-gray-800">{formatDate(searchResult.endDate)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Description Card */}
                      {searchResult.description && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className={`bg-white rounded-xl border border-${colors.border} shadow-sm overflow-hidden`}
                        >
                          <div className={`p-4 border-b bg-gradient-to-r ${colors.gradientLight}`}>
                            <h3 className="text-lg font-medium flex items-center">
                              <FileText className={`w-5 h-5 mr-2 text-${colors.primary}`} />
                              Description de l'intervention
                            </h3>
                          </div>
                          <div className="p-5">
                            <p className="text-gray-700 leading-relaxed">{searchResult.description}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Contact Info */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className={`bg-gradient-to-r ${colors.gradientLight} rounded-xl border border-${colors.border} p-5 flex items-start shadow-sm`}
                      >
                        <div className="bg-white p-3 rounded-full mr-3 shadow-sm">
                          <Phone className={`w-5 h-5 text-${colors.primary}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium mb-1 text-${colors.text}`}>
                            Besoin d'informations supplémentaires ?
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Notre équipe est disponible pour répondre à toutes vos questions concernant votre véhicule.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href="tel:0123456789"
                              className={`inline-flex items-center px-3 py-1.5 bg-white border border-${colors.border} rounded-md text-sm font-medium text-${colors.primary} hover:bg-${colors.buttonBg} hover:text-white transition-colors shadow-sm`}
                            >
                              <Phone className="w-4 h-4 mr-1.5" />
                              01 23 45 67 89
                            </a>
                          
                          </div>
                        </div>
                      </motion.div>

                      {/* Feedback Section */}
                     

                   
                 
                    </div>
                  </div>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
