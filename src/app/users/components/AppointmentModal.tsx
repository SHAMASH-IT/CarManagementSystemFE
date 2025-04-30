'use client'

import { useState, useEffect } from 'react'

import Modal from 'react-modal'

import { toast } from 'react-toastify'

import type { AppointmentDetails, Vehicle } from '../../types/index'
import { createAppointment } from '@/app/appointments/services/appointmentService'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  isEditMode: boolean
  appointmentDetails: AppointmentDetails
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSubmit: () => void
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

  useEffect(() => {
    Modal.setAppElement('body')
    const fetchVehicles = async () => {
      try {
        const userId = 1; // À remplacer par l'ID réel du client connecté plus tard
        const API_URL = process.env.NEXT_PUBLIC_APP_URL;
        const response = await fetch(`${API_URL}/users/vehicle/user/${userId}`)
        if (!response.ok) throw new Error('Erreur lors de la récupération des véhicules')
        const data = await response.json()
        setVehicles(data)
      } catch (err) {
        setVehicles([])
      }
    }
    fetchVehicles()
  }, [])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { vehicle, service, date, time } = appointmentDetails

    if (!vehicle || !service || !date || !time) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    console.log('date', date)
    console.log('time', time)

    try {
      setIsLoading(true)
      handleSubmit()
      await createAppointment({
        date: date,
        time: time,
        serviceId: Number(service),
        vehicleId: Number(vehicle)
      })
      toast.success('rendez-vous crée avec succées')
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
      className='modal-content max-w-lg w-full mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg'
      overlayClassName='modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
      contentLabel={isEditMode ? 'Modifier le rendez-vous' : 'Ajouter un rendez-vous'}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      style={{
        content: {
          position: 'relative',
          maxWidth: '32rem',
          width: '100%',
          margin: '0 auto',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '1.5rem',
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
        <h2 className='text-xl font-semibold mb-4 text-gray-800'>
          {isEditMode ? 'Modifier le rendez-vous' : 'Ajouter un rendez-vous'}
        </h2>

        {error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1'>
              Véhicule<span className='text-red-500'>*</span>
            </label>
            <select
              name='vehicle'
              value={appointmentDetails.vehicle}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white'
              required
            >
              <option value=''>Sélectionnez un véhicule</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.registration})
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-1'>
              Service<span className='text-red-500'>*</span>
            </label>
            <select
              name='service'
              value={appointmentDetails.service}
              onChange={handleInputChange}
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white'
              required
            >
              <option value=''>Sélectionnez un service</option>
              <option value='1'>Lavage</option>
              <option value='Réparation'>Réparation</option>
              <option value='Entretien'>Entretien</option>
            </select>
          </div>

          <div className='flex flex-wrap mb-4 -mx-2'>
            <div className='w-1/2 px-2'>
              <label className='block text-gray-700 mb-1'>
                Date<span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                name='date'
                value={appointmentDetails.date}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div className='w-1/2 px-2'>
              <label className='block text-gray-700 mb-1'>
                Heure<span className='text-red-500'>*</span>
              </label>
              <input
                type='time'
                name='time'
                value={appointmentDetails.time}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
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
