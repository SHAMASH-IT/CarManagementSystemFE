"use client"

import type React from "react"
import { useState } from "react"
import { FaPlus, FaSpinner } from "react-icons/fa"

interface AddParkingFormProps {
  onParkingAdded: () => void
}

const AddParkingForm: React.FC<AddParkingFormProps> = ({ onParkingAdded }) => {
  const [name, setName] = useState("")
  const [places, setPlaces] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !places) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const parkingData = {
        name,
        places: Number.parseInt(places),
        serviceId: serviceId ? Number.parseInt(serviceId) : undefined,
      }

      const response = await fetch("http://localhost:3005/parking/create-parking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parkingData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création du parking")
      }

      // Réinitialiser le formulaire
      setName("")
      setPlaces("")
      setServiceId("")

      // Notification du composant parent que le parking a été ajouté
      onParkingAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Nom du parking
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Parking A"
              required
            />
          </div>

          <div>
            <label htmlFor="places" className="block mb-2 font-medium text-gray-700">
              Nombre de places
            </label>
            <input
              type="number"
              id="places"
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 10"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="serviceId" className="block mb-2 font-medium text-gray-700">
              ID du service
            </label>
            <input
              type="number"
              id="serviceId"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 1"
              min="1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isLoading ? "Création en cours..." : "Ajouter le parking"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddParkingForm
