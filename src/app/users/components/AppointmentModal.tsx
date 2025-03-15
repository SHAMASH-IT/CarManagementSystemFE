'use client'

import type React from 'react'

import { useEffect } from 'react'

import Modal from 'react-modal'

import type { AppointmentDetails } from '../../types/index'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  isEditMode: boolean
  appointmentDetails: AppointmentDetails
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
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
  // Set the app element for react-modal
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(44, 62, 80, 0.75)',
          zIndex: 1000
        },
        content: {
          position: 'fixed',
          top: '0',
          left: 'auto',
          right: '0',
          bottom: '0',
          transform: 'none',
          width: '400px',
          height: '100vh',
          overflow: 'auto',
          padding: '25px',
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.2)',
          border: 'none',
          borderRadius: '0',
          zIndex: 1001
        }
      }}
      contentLabel='Réserver un rendez-vous'
      className='modal-right'
    >
      <div className='flex justify-between items-center mb-5 border-b-2 border-[#3498db] pb-4'>
        <h2 className='m-0 text-[#2c3e50] flex items-center text-2xl font-bold bg-gradient-to-r from-[#3498db] to-[#2c3e50] bg-clip-text text-transparent'>
          {isEditMode ? 'Modifier le rendez-vous' : 'Réserver un rendez-vous'}
        </h2>
        <button
          onClick={onClose}
          className='bg-none border-none text-2xl cursor-pointer p-0 px-1 text-black transition-colors'
        >
          ×
        </button>
      </div>
      <form>
        <div className='mb-4'>
          <label className='block mb-1 font-bold text-[#2c3e50]'>Véhicule</label>
          <select
            name='vehicle'
            value={appointmentDetails.vehicle}
            onChange={handleInputChange}
            className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
          >
            <option value=''>Sélectionner un véhicule</option>
            <option value='Toyota'>Toyota</option>
            <option value='Honda'>Honda</option>
            <option value='Ford'>Ford</option>
            <option value='BMW'>BMW</option>
            <option value='Mercedes'>Mercedes</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-bold text-[#2c3e50]'>Service</label>
          <select
            name='service'
            value={appointmentDetails.service}
            onChange={handleInputChange}
            className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
          >
            <option value=''>Sélectionner un service</option>
            <option value='Oil Change'>Changement d&apos;huile</option>
            <option value='Tire Rotation'>Rotation des pneus</option>
            <option value='Brake Inspection'>Inspection des freins</option>
            <option value='Battery Check'>Vérification de la batterie</option>
            <option value='Full Service'>Service complet</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-bold text-[#2c3e50]'>Date</label>
          <input
            type='date'
            name='date'
            value={appointmentDetails.date}
            onChange={handleInputChange}
            className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 font-bold text-[#2c3e50]'>Heure</label>
          <input
            type='time'
            name='time'
            value={appointmentDetails.time}
            onChange={handleInputChange}
            className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
          />
        </div>
        <div className='mb-6'>
          <label className='block mb-1 font-bold text-[#2c3e50]'>Infos complémentaires (facultatif)</label>
          <input
            type='text'
            name='additionalInfo'
            value={appointmentDetails.additionalInfo}
            onChange={handleInputChange}
            className='w-full p-3 mb-1 rounded border border-[#ddd] text-base'
            placeholder='Détails supplémentaires'
          />
        </div>
        <button
          type='button'
          onClick={handleSubmit}
          className={`w-full p-3.5 text-white border-none rounded cursor-pointer font-bold text-base transition-colors ${
            isEditMode ? 'bg-[#f39c12] hover:bg-[#e67e22]' : 'bg-[#3498db] hover:bg-[#2980b9]'
          }`}
        >
          {isEditMode ? 'Mettre à jour' : 'Réserver'}
        </button>
      </form>
    </Modal>
  )
}

export default AppointmentModal
