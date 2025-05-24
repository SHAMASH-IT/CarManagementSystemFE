"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaEdit, FaTrash, FaSpinner, FaParking, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa"
import AddParkingForm from "./AddParkingForm"
import EditParkingForm from "./EditParkingForm"
import { getParkingsByUserRole } from "../services/parkingService"

interface Location {
  id: number
  name: string
  parkingId: number
  status: "EMPTY" | "OCCUPIED"
}

interface Parking {
  id: number
  name: string
  places: number
  serviceId?: number
  locations: Location[]
}

const ParkingManagement: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingParking, setEditingParking] = useState<Parking | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [selectedParkingForDelete, setSelectedParkingForDelete] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const getCurrentUserData = () => {
    const userData = localStorage.getItem('user')
    if (!userData) return null

    try {
      const user = JSON.parse(userData)
      console.log('👤 Current user data:', user)
      return user
    } catch (error) {
      console.error('❌ Error parsing user data:', error)
      return null
    }
  }

  const fetchParkings = async () => {
    try {
      setLoading(true)
      const userData = getCurrentUserData()
      console.log('🔍 Fetching parkings for user:', userData)

      if (!userData?.id) {
        throw new Error("Utilisateur non connecté")
      }

      setUserRole(userData.role)
      const data = await getParkingsByUserRole(userData.id)
      console.log('📦 Parkings data received:', data)
      
      setParkings(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
      setError(null)
    } catch (err) {
      console.error('❌ Error in fetchParkings:', err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParkings()
  }, [])

  const handleDeleteParking = async (id: number) => {
    try {
      setLoading(true)
      console.log(`🗑️ Suppression du parking ID: ${id}`)

      const response = await fetch(`http://localhost:3005/parking/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du parking")
      }

      setParkings((prevParkings) => prevParkings.filter((parking) => parking.id !== id))
      const newTotalPages = Math.ceil((parkings.length - 1) / itemsPerPage)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }

      setConfirmDelete(null)
      setSelectedParkingForDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleParkingAdded = async () => {
    console.log("✅ Parking ajouté, rechargement en cours...")
    setShowAddForm(false)
    await fetchParkings()
  }

  const handleParkingUpdated = async () => {
    console.log("🔄 Parking mis à jour, rechargement en cours...")
    const currentParkingIndex = currentItems.findIndex((p) => p.id === editingParking?.id)
    if (currentParkingIndex !== -1) {
      try {
        const response = await fetch(`http://localhost:3005/parking/parking/${editingParking?.id}`)
        if (response.ok) {
          const updatedParking = await response.json()
          setParkings((prevParkings) => {
            const newParkings = [...prevParkings]
            const index = newParkings.findIndex((p) => p.id === updatedParking.id)
            if (index !== -1) {
              newParkings[index] = updatedParking
            }
            return newParkings
          })
        } else {
          await fetchParkings()
        }
      } catch (err) {
        await fetchParkings()
      }
    } else {
      await fetchParkings()
    }
    setEditingParking(null)
  }

  const handleConfirmDeleteModal = () => {
    if (selectedParkingForDelete !== null) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce parking ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedParkingForDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteParking(selectedParkingForDelete)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const renderAddFormModal = () => {
    if (!showAddForm) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Ajouter un parking</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <AddParkingForm onParkingAdded={handleParkingAdded} />
        </div>
      </div>
    )
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = parkings.slice(indexOfFirstItem, indexOfLastItem)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 flex items-center">
            <FaParking className="mr-2" /> Gestion des Parkings

            
          </h1>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Ajouter un parking
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}


        <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Vue d’ensemble des parkings</h2>
        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4"></h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Places Disponibles</p>
                  <p className="text-2xl font-bold text-green-700">
                    {parkings.reduce((total, parking) => 
                      total + parking.locations.filter(loc => loc.status === 'EMPTY').length, 0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Places Occupées</p>
                  <p className="text-2xl font-bold text-red-700">
                    {parkings.reduce((total, parking) => 
                      total + parking.locations.filter(loc => loc.status === 'OCCUPIED').length, 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div><br></br>
          
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Liste des parkings</h2><br></br>
          

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-4xl text-blue-800" />
            </div>
          ) : parkings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun parking disponible. Ajoutez-en un !</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-blue-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Nom</th>
                      <th className="px-4 py-3 text-left">Places</th>
                      <th className="px-4 py-3 text-left">Service ID</th>
                      <th className="px-4 py-3 text-left">Emplacements</th>
                      <th className="px-4 py-3 text-left">Disponibilité</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((parking) => (
                      <tr key={parking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{parking.id}</td>
                        <td className="px-4 py-3 font-medium">{parking.name}</td>
                        <td className="px-4 py-3">{parking.places}</td>
                        <td className="px-4 py-3">{parking.serviceId || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {parking.locations.map((location) => (
                              <span
                                key={location.id}
                                className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                                  location.status === "EMPTY"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {location.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {parking.locations.filter((loc) => loc.status === "EMPTY").length} / {parking.places}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {confirmDelete === parking.id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-sm text-red-600">Confirmer ?</span>
                              <button
                                onClick={() => handleDeleteParking(parking.id)}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                              >
                                Oui
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-300 text-gray-800 p-1 rounded hover:bg-gray-400"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setEditingParking(parking)}
                                className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(parking.id)}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, parkings.length)} sur{" "}
                  {parkings.length} parkings
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

       
      </div>

      {editingParking && (
        <EditParkingForm
          parking={editingParking}
          onClose={() => setEditingParking(null)}
          onParkingUpdated={handleParkingUpdated}
        />
      )}

      {handleConfirmDeleteModal()}
      {renderAddFormModal()}
    </div>
  )
}

export default ParkingManagement

