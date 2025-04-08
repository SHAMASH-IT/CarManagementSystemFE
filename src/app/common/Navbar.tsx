"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Search,
  Calendar,
  Clock,
  Car,
  Wrench,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  UserCircle2,
  MessageSquare,
  LogOut,
  Settings,
  Mail,
  Loader2,
  AlertCircle,
  CalendarDays,
  Tag,
} from "lucide-react"
import moment from "moment"

// Define the interface for search results
interface SearchResult {
  id: number
  date: string
  vehicle?: {
    brand: string
    model: string
  }
  service?: {
    name: string
  }
}

// Define the interface for notifications
interface Notification {
  id: number
  icon: React.ReactNode
  message: string
  avatar: string
  time: string
}

const notifications: Notification[] = [
  {
    id: 1,
    icon: <Calendar className="h-6 w-6 text-green-500" />,
    message: "Nouvelle demande de rendez-vous de John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    time: "Il y a 2 heures",
  },
  {
    id: 2,
    icon: <Calendar className="h-6 w-6 text-blue-500" />,
    message: "Rappel : rendez-vous avec Jane Smith demain",
    avatar: "https://i.pravatar.cc/40?img=2",
    time: "Il y a 1 jour",
  },
  {
    id: 3,
    icon: <Mail className="h-6 w-6 text-yellow-500" />,
    message: "Nouveau message de Paul Brown",
    avatar: "https://i.pravatar.cc/40?img=3",
    time: "Il y a 3 jours",
  },
]

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchType, setSearchType] = useState("date")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedResult, setSelectedResult] = useState<number | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  // Effet pour faire disparaître automatiquement le message d'erreur
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 3000) // Le message disparaîtra après 3 secondes

      return () => clearTimeout(timer)
    }
  }, [error])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Fermer également les résultats de recherche si on clique en dehors
        if (searchResults.length > 0) {
          setSearchResults([])
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchResults.length])

  // Handle keyboard navigation for search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Fermer les résultats de recherche
        setSearchResults([])
        setSelectedResult(null)
        return
      }

      if (searchResults.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedResult((prev) => (prev === null || prev >= searchResults.length - 1 ? 0 : prev + 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedResult((prev) => (prev === null || prev <= 0 ? searchResults.length - 1 : prev - 1))
      } else if (e.key === "Enter" && selectedResult !== null) {
        e.preventDefault()
        // Handle selection - for now just log it
        console.log("Selected result:", searchResults[selectedResult])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [searchResults, selectedResult])

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      setError("")
      setSelectedResult(null)
      let endpoint = ""

      // D'abord, récupérer tous les rendez-vous pour debug
      const allAppointmentsEndpoint = `${API_URL}/appointments/all-appointments`
      console.log("Récupération de tous les rendez-vous...")
      const allAppointmentsResponse = await fetch(allAppointmentsEndpoint)
      const allAppointments = await allAppointmentsResponse.json()
      console.log("Tous les rendez-vous disponibles:", allAppointments)
      
      // Afficher les dates des rendez-vous disponibles
      allAppointments.forEach((appointment: any, index: number) => {
        console.log(`Rendez-vous ${index + 1}:`, {
          date: appointment.date,
          dateFormatée: moment(appointment.date).format('YYYY-MM-DD'),
          vehicle: appointment.vehicle
        })
      })

      if (searchType === "date") {
        // Vérifier si la date est valide
        if (!searchQuery) {
          throw new Error("Veuillez sélectionner une date")
        }
        
        // Convertir la date en objet moment et s'assurer qu'elle est au début de la journée
        const momentDate = moment(searchQuery).startOf('day')
        console.log("Date sélectionnée:", searchQuery)
        console.log("Date moment (début de journée):", momentDate.format())
        
        if (!momentDate.isValid()) {
          throw new Error("Format de date invalide")
        }
        
        // Formater la date en YYYY-MM-DD pour éviter les problèmes de fuseau horaire
        const formattedDate = momentDate.format('YYYY-MM-DD')
        console.log("Date formatée pour l'API:", formattedDate)
        
        endpoint = `${API_URL}/appointments/date-appointments/${formattedDate}`
        console.log("URL de recherche (date):", endpoint)
      } else {
        if (isNaN(Number(searchQuery))) {
          throw new Error("ID du véhicule invalide. Utilisez un nombre")
        }
        endpoint = `${API_URL}/appointments/vehicle-appointments/${searchQuery}`
        console.log("URL de recherche (véhicule):", endpoint)
      }

      console.log("Envoi de la requête à:", endpoint)

      const response = await fetch(endpoint)
      console.log("Statut de la réponse:", response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error("Erreur API:", errorData)
        throw new Error(`Erreur lors de la recherche: ${response.status}`)
      }

      const data = await response.json()
      console.log("Données reçues:", data)
      
      if (!Array.isArray(data)) {
        console.error("Format de données invalide:", data)
        throw new Error("Format de données invalide reçu du serveur")
      }

      setSearchResults(data as SearchResult[])
      if (data.length === 0) {
        const formattedDate = moment(searchQuery).format("DD/MM/YYYY")
        setError(`Aucun rendez-vous trouvé pour le ${formattedDate}. Veuillez vérifier la date ou essayer une autre date.`)
      }
    } catch (err: any) {
      console.error("Erreur complète:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  // Group search results by date
  const groupedResults = searchResults.reduce(
    (acc, result) => {
      const date = moment(result.date).format("DD/MM/YYYY")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>
  )

  // Get status color based on time
  const getStatusColor = (dateStr: string) => {
    const now = moment()
    const date = moment(dateStr)
    const diffHours = date.diff(now, "hours")

    if (diffHours < 0) return "text-gray-500" // Past
    if (diffHours < 24) return "text-red-500" // Today
    if (diffHours < 48) return "text-orange-500" // Tomorrow
    return "text-green-500" // Future
  }

  // Get status text based on time
  const getStatusText = (dateStr: string) => {
    const now = moment()
    const date = moment(dateStr)
    const diffHours = date.diff(now, "hours")

    if (diffHours < 0) return "Passé"
    if (diffHours < 24) return "Aujourd'hui"
    if (diffHours < 48) return "Demain"
    return "À venir"
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Barre de recherche */}
          <div
            className={`${
              isSearchOpen ? "flex" : "hidden md:flex"
            } flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end`}
          >
            <div className="max-w-lg w-full" ref={searchRef}>
              <label htmlFor="search" className="sr-only">
                Rechercher
              </label>
              <div className="relative">
                {/* Conteneur global de la barre de recherche */}
                <div
                  className={`flex items-center space-x-2 rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                    searchFocused ? "shadow-md ring-2 ring-indigo-200" : "shadow-sm"
                  } bg-gray-50`}
                >
                  {/* Boutons de filtre (Date / Véhicule) */}
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      type="button"
                      onClick={() => setSearchType("date")}
                      className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        searchType === "date" ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Date
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType("vehicle")}
                      className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        searchType === "vehicle" ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Car className="h-3 w-3 mr-1" />
                      Véhicule
                    </button>
                  </div>

                  {/* Input de recherche (avec icône Search à gauche) */}
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        searchFocused ? "text-indigo-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="search"
                      name="search"
                      type={searchType === "date" ? "date" : "number"}
                      placeholder={searchType === "date" ? "Sélectionnez une date" : "ID du véhicule"}
                      className="w-full pl-8 pr-2 py-2 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                      value={searchQuery}
                      onChange={(e) => {
                        const value = e.target.value
                        console.log("Nouvelle valeur:", value)
                        setSearchQuery(value)
                      }}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                      min={searchType === "date" ? moment().format("YYYY-MM-DD") : undefined}
                    />
                  </div>

                  {/* Bouton "Rechercher" */}
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center relative overflow-hidden"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1" />
                        Rechercher
                      </>
                    )}
                  </button>

                  {/* Bouton reset si besoin (facultatif) */}
                  {searchQuery && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div
                    className="mt-3 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm flex items-center justify-between opacity-0 animate-errorIn"
                    style={{
                      animation: "errorIn 0.3s ease-out forwards",
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <p className="mt-1 text-sm text-red-700">Veuillez réessayer avec des données valides</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setError("")}
                      className="ml-4 flex-shrink-0 flex"
                    >
                      <X className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors" />
                    </button>
                  </div>
                )}

                {/* Liste des résultats */}
                {searchResults.length > 0 && (
                  <div
                    className="absolute w-full bg-white border rounded-xl shadow-xl max-h-[70vh] overflow-y-auto z-50 opacity-0 translate-y-[10px] animate-resultsIn"
                    style={{
                      animation: "resultsIn 0.3s ease-out forwards",
                    }}
                  >
                    {/* En-tête sticky des résultats (nombre de résultats, etc.) */}
                    <div className="sticky top-0 bg-white p-3 border-b flex justify-between items-center z-20">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-gray-500">
                          {searchType === "date"
                            ? `Recherche par date: ${moment(searchQuery).format("DD/MM/YYYY")}`
                            : `Recherche par véhicule: ID ${searchQuery}`}
                        </span>
                      </div>
                      <button
                        onClick={() => setSearchResults([])}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Contenu des résultats */}
                    <div className="p-2">
                      {Object.entries(groupedResults).map(([date, results]) => (
                        <div key={date} className="mb-2 bg-white rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b">
                            <div className="flex items-center">
                              <CalendarDays className="h-5 w-5 mr-2 text-indigo-500" />
                              <span className="font-medium text-gray-800">{date}</span>
                              <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                {results.length} rendez-vous
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{moment(date, "DD/MM/YYYY").format("dddd")}</span>
                          </div>

                          {results.map((result, index) => (
                            <div
                              key={result.id}
                              className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0 ${
                                selectedResult === index ? "bg-indigo-50" : ""
                              }`}
                              onClick={() => setSelectedResult(index)}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`p-3 rounded-lg mr-3 ${getStatusColor(result.date)
                                    .replace("text-", "bg-")
                                    .replace("-500", "-100")}`}
                                >
                                  <Car className={`h-6 w-6 ${getStatusColor(result.date)}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 flex items-center">
                                        {result.vehicle?.brand} {result.vehicle?.model}
                                        <span
                                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(result.date)
                                            .replace("text-", "bg-")
                                            .replace("-500", "-100")} ${getStatusColor(result.date)}`}
                                        >
                                          {getStatusText(result.date)}
                                        </span>
                                      </h3>
                                      <div className="flex items-center mt-1 text-sm text-gray-600">
                                        <Tag className="h-4 w-4 mr-1 text-gray-400" />
                                        <span>ID: {result.id}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span className="text-sm font-medium text-gray-900 flex items-center">
                                        <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                                        {moment(result.date).format("HH:mm")}
                                      </span>
                                      <span className="text-xs text-gray-500 mt-1">
                                        {moment(result.date).fromNow()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                      <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                                      {result.service?.name || "Service non spécifié"}
                                    </div>
                                    <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center font-medium">
                                      Voir détails <ChevronRight className="h-3 w-3 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Bouton de fermeture en bas */}
                    <div className="p-3 border-t sticky bottom-0 bg-white">
                      <button
                        onClick={() => setSearchResults([])}
                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center font-medium"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Fermer les résultats
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de fermeture sur mobile */}
            <button className="ml-2 md:hidden" onClick={() => setIsSearchOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Icônes de notifications, messages, profil */}
          <div className="flex items-center">
            <button
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-6 w-6" />
            </button>

            <div className="relative">
              <button
                className="ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative"
                onClick={() => {
                  setIsNotificationMenuOpen(!isNotificationMenuOpen)
                  setIsProfileMenuOpen(false)
                }}
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {isNotificationMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 opacity-0 translate-y-[10px] animate-menuIn overflow-hidden"
                  style={{
                    animation: "menuIn 0.2s ease-out forwards",
                  }}
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                    <span className="font-bold">Notifications</span>
                    <button
                      onClick={() => setIsNotificationMenuOpen(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors border-b last:border-b-0"
                      >
                        <img
                          src={notification.avatar || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-sm">{notification.message}</span>
                          <span className="text-xs text-gray-500 block mt-1">{notification.time}</span>
                        </div>
                        {notification.icon}
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-indigo-500"></span>
            </button>

            <div className="ml-3 relative">
              <button
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen)
                  setIsNotificationMenuOpen(false)
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500">
                  <UserCircle2 size={24} className="text-indigo-600" />
                </div>
                <div className="hidden md:flex items-center">
                  <span className="text-sm font-medium text-gray-700">Marie Dupont</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </div>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10 opacity-0 translate-y-[10px] animate-menuIn overflow-hidden"
                  style={{
                    animation: "menuIn 0.2s ease-out forwards",
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Marie Dupont</p>
                    <p className="text-xs text-gray-500 mt-1">marie.dupont@example.com</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="inline mr-2 h-4 w-4" /> Paramètres
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="inline mr-2 h-4 w-4" /> Déconnexion
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes menuIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes filterIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes errorIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes resultsIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </nav>
  )
}

export default Navbar
