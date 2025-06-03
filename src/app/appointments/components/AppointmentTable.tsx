'use client'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/fr'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaTrashAlt, FaTools, FaCheck, FaClock, FaSearch, FaFilter, FaCalendarAlt, FaListUl, FaUser, FaCar } from 'react-icons/fa'
import type { AppointmentTableProps } from '../../types/index'

// Configurer moment.js pour utiliser le français
moment.locale('fr')

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments: initialAppointments,
  onDelete,
  onAccept,
  onUpdateToReserved
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const filteredAppointments = initialAppointments
    .filter(appointment => {
      const matchesSearch = appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'ALL' 
        ? appointment.status !== 'CANCELED'  // Exclure les annulés par défaut
        : appointment.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Trier par date décroissante (les plus récents en premier)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex)

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Fonction pour générer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2 // Nombre de pages à afficher de chaque côté de la page courante
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const getStatusStyle = (status: string) => {
    const normalizedStatus = status?.trim()?.toUpperCase()

    switch (normalizedStatus) {
      case 'CONFIRMED':
        return {
          badge: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
          icon: <FaCheckCircle className="w-4 h-4" />,
          label: 'Terminé'
        }
      case 'RESERVED':
        return {
          badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          icon: <FaCalendarAlt className="w-4 h-4" />,
          label: 'Réservé'
        }
      case 'IN_PROGRESS':
        return {
          badge: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
          icon: <FaTools className="w-4 h-4" />,
          label: 'En cours'
        }
      case 'CANCELED':
        return {
          badge: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
          icon: <FaTrashAlt className="w-4 h-4" />,
          label: 'Annulé'
        }
      case 'PENDING':
        return {
          badge: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
          icon: <FaClock className="w-4 h-4" />,
          label: 'En attente'
        }
      default:
        return {
          badge: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
          icon: <FaClock className="w-4 h-4" />,
          label: status || 'Inconnu'
        }
    }
  }

  const filterOptions = [
    { value: 'ALL', label: 'Tous les rendez-vous', icon: <FaListUl className="w-4 h-4" /> },
    { value: 'PENDING', label: 'En attente', icon: <FaClock className="w-4 h-4" /> },
    { value: 'IN_PROGRESS', label: 'En cours', icon: <FaTools className="w-4 h-4" /> },
    { value: 'RESERVED', label: 'Réservés', icon: <FaCalendarAlt className="w-4 h-4" /> },
    { value: 'CONFIRMED', label: 'Terminés', icon: <FaCheckCircle className="w-4 h-4" /> },
  ]

  const getCurrentFilterLabel = () => {
    return filterOptions.find(option => option.value === filterStatus)?.label || 'Filtrer par statut'
  }

  return (
    <div className="space-y-6 p-0 sm:p-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6 mx-0"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Gestion des Rendez-vous
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border border-blue-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <FaFilter className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{getCurrentFilterLabel()}</span>
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-full sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-2">
                      {filterOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            setFilterStatus(option.value)
                            setIsFilterOpen(false)
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            filterStatus === option.value
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className={`${
                            filterStatus === option.value
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {option.icon}
                          </div>
                          <span>{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaCar className="w-4 h-4" />
                    <span className="hidden sm:inline">Véhicule</span>
                  </div>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4" />
                    <span className="hidden sm:inline">Client</span>
                  </div>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaTools className="w-4 h-4" />
                    <span className="hidden sm:inline">Service</span>
                  </div>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span className="hidden sm:inline">Date</span>
                  </div>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="w-4 h-4" />
                    <span className="hidden sm:inline">Statut</span>
                  </div>
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {currentAppointments.map(appointment => {
                  const statusStyle = getStatusStyle(appointment.status)
                  
                  return (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <FaCar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
                              {appointment.vehicleName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                            <FaUser className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                              {appointment.clientName || 'Client non spécifié'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                          {appointment.service}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                        {moment(appointment.date).subtract(1, 'hour').format('DD/MM/YYYY à HH:mm')}

                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 ${statusStyle.badge} shadow-sm`}>
                            {statusStyle.icon}
                            <span className="hidden sm:inline">{statusStyle.label}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={appointment.status === 'PENDING' ? { scale: 1.05 } : {}}
                            whileTap={appointment.status === 'PENDING' ? { scale: 0.95 } : {}}
                            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                              appointment.status === 'PENDING'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg cursor-pointer'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => appointment.status === 'PENDING' && onUpdateToReserved(appointment.id)}
                            title={appointment.status === 'PENDING' ? "Réserver" : "Non disponible"}
                            disabled={appointment.status !== 'PENDING'}
                          >
                            <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={appointment.status !== 'CANCELED' && appointment.status !== 'CONFIRMED' ? { scale: 1.05 } : {}}
                            whileTap={appointment.status !== 'CANCELED' && appointment.status !== 'CONFIRMED' ? { scale: 0.95 } : {}}
                            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                              appointment.status !== 'CANCELED' && appointment.status !== 'CONFIRMED'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg cursor-pointer'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => appointment.status !== 'CANCELED' && appointment.status !== 'CONFIRMED' && onDelete(appointment.id)}
                            title={
                              appointment.status === 'CONFIRMED'
                                ? "Impossible d'annuler un rendez-vous terminé"
                                : appointment.status === 'CANCELED'
                                ? "Déjà annulé"
                                : "Annuler"
                            }
                            disabled={appointment.status === 'CANCELED' || appointment.status === 'CONFIRMED'}
                          >
                            <FaTrashAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
              <span className="font-medium">
                {Math.min(endIndex, filteredAppointments.length)}
              </span>{' '}
              sur{' '}
              <span className="font-medium">{filteredAppointments.length}</span> résultats
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <nav className="flex justify-center sm:justify-end" aria-label="Pagination">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Précédent
                </motion.button>

                <div className="hidden sm:flex items-center space-x-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        ...
                      </span>
                    ) : (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pageNum as number)}
                        className={`relative inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    )
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Suivant
                </motion.button>
              </div>
            </nav>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AppointmentTable
