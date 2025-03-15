'use client'

import { useEffect } from 'react'

import Modal from 'react-modal'
import { Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
  // Set the app element for react-modal
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center'
    >
      <div className='text-center'>
        <h2 className='text-xl font-semibold mb-4'>Confirmer la suppression</h2>
        <p className='mb-6'>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
        <div className='flex justify-center space-x-4'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors'>
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center'
          >
            <Trash2 size={16} className='mr-2' /> Supprimer
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
