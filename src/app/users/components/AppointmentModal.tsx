'use client'

import { useState, useEffect } from 'react'

import Modal from 'react-modal'

import { toast } from 'react-toastify'

import type { AppointmentDetails, Vehicle, Service } from '../../types/index'
import { createAppointment } from '@/app/appointments/services/appointmentService'
import { useServices } from '../hooks/useServices'
import { Clock, Calendar, Car, Wrench, PlusCircle } from 'lucide-react'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  isEditMode: boolean
  appointmentDetails: AppointmentDetails
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSubmit: () => void
}

// Générer les créneaux horaires de 8h à 18h avec incréments de 45 minutes
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour <= 18; hour++) {
    // Ajouter l'heure pleine
    if (hour < 18) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`
      slots.push({
        value: timeString,
        display: `${hour}h00`,
      })
    }
  
  }
  // Ajouter 18h00 à la fin
  slots.push({
    value: "18:00",
    display: "18h00",
  })
  return slots
}

const AppointmentModal = ({
  isOpen,
  onClose,
  isEditMode,
  appointmentDetails,
  handleInputChange,
  handleSubmit
}: AppointmentModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const [selectedTime, setSelectedTime] = useState(appointmentDetails.time || "")

  const timeSlots = generateTimeSlots()

  useEffect(() => {
    Modal.setAppElement('body')
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('Vous devez être connecté pour voir vos véhicules')
          return
        }

        // Décoder le token pour obtenir l'ID de l'utilisateur
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        const userData = JSON.parse(jsonPayload)
        const userId = userData.sub

        const API_URL = process.env.NEXT_PUBLIC_APP_URL;
        const response = await fetch(`${API_URL}/users/vehicle/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des véhicules')
        }

        const data = await response.json()
        setVehicles(data)
      } catch (err) {
        setVehicles([])
        toast.error('Erreur lors de la récupération des véhicules')
      }
    }
    if (isOpen) {
      fetchVehicles()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedTime(appointmentDetails.time || "")
  }, [appointmentDetails.time])

  const handleTimeSelect = (timeValue: string) => {
    setSelectedTime(timeValue)
    // Simuler un événement pour maintenir la compatibilité avec handleInputChange
    const syntheticEvent = {
      target: {
        name: "time",
        value: timeValue,
      },
    } as React.ChangeEvent<HTMLInputElement>
    handleInputChange(syntheticEvent)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { vehicle, service, date } = appointmentDetails
    if (!vehicle || !service || !date || !selectedTime) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    try {
      setIsLoading(true)
      await createAppointment({
        date: date,
        time: selectedTime,
        serviceId: Number(service),
        vehicleId: Number(vehicle),
      })
      handleSubmit()
      toast.success('Rendez-vous créé avec succès')
      onClose()
      setIsLoading(false)
    } catch (err) {
      console.error('Error saving appointment:', err)
      setError("Une erreur est survenue lors de l'enregistrement du rendez-vous.")
      toast.error("Une erreur est survenue lors de l'enregistrement du rendez-vous.")
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='modal-content max-w-3xl w-full mx-auto mt-10 bg-white p-8 rounded-2xl shadow-2xl'
      overlayClassName='modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
      contentLabel={isEditMode ? 'Modifier le rendez-vous' : 'Ajouter un rendez-vous'}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      style={{
        content: {
          position: 'relative',
          maxWidth: '48rem',
          width: '100%',
          margin: '0 auto',
          border: 'none',
          borderRadius: '1rem',
          padding: '2rem',
          maxHeight: '90vh',
          overflow: 'auto'
        },
        overlay: {
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }
      }}
    >
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold mb-8 text-gray-900">
          <PlusCircle className="h-7 w-7 text-blue-600" />
          {isEditMode ? "Modifier l'intervention automobile" : "Planifier une intervention automobile"}
        </h2>

        {error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-5">
            <label className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
              <Car className="h-5 w-5 text-blue-500" />
              Véhicule concerné <span className="text-red-500 align-super text-sm">*</span>
            </label>
            <select
              name="vehicle"
              value={appointmentDetails.vehicle}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Sélectionnez un véhicule</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.registration})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
              <Wrench className="h-5 w-5 text-blue-500" />
              Type de service <span className="text-red-500 align-super text-sm">*</span>
            </label>
            <select
              name="service"
              value={appointmentDetails.service}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Sélectionnez un service</option>
              {servicesLoading ? (
                <option value="" disabled>
                  Chargement des services...
                </option>
              ) : servicesError ? (
                <option value="" disabled>
                  Erreur lors du chargement des services
                </option>
              ) : (
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Date du rendez-vous <span className="text-red-500 align-super text-sm">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                name="date"
                value={appointmentDetails.date}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                placeholder="jj/mm/aaaa"
                required
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-base font-medium text-gray-900 mb-4 mt-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Heure souhaitée <span className="text-red-500 align-super text-sm">*</span>
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-1 max-h-52 overflow-y-auto p-1 border border-gray-200 rounded-2xl bg-gray-50">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleTimeSelect(slot.value)}
                  className={
                    `flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm border-2 ` +
                    (selectedTime === slot.value
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg scale-105"
                      : "bg-white text-gray-800 border-gray-200 hover:shadow-blue-200 hover:shadow-lg hover:scale-105 hover:border-blue-400") +
                    " focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-95"
                  }
                  style={{ minWidth: 0 }}
                >
                  <Clock className={selectedTime === slot.value ? "h-3 w-3 mb-0.5 text-white" : "h-3 w-3 mb-0.5 text-blue-500"} />
                  <span>{slot.display}</span>
                </button>
              ))}
            </div>
            {selectedTime && (
              <p className="mt-4 text-base text-gray-700">
                Heure sélectionnée : <span className="font-bold text-blue-600">{selectedTime}</span>
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors'
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AppointmentModal
