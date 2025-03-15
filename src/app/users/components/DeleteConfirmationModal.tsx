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
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          border: 'none',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)'
        }
      }}
      contentLabel='Confirmation de suppression'
    >
      <div className='text-center'>
        <Trash2 size={48} color='#e74c3c' className='mb-4' />
        <h2 className='text-[#2c3e50] mb-4'>Confirmer la suppression</h2>
        <p className='mb-6 text-base text-[#7f8c8d]'>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onClose}
            className='px-5 py-2.5 bg-[#95a5a6] text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-[#7f8c8d]'
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2.5 bg-[#e74c3c] text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-[#c0392b]'
          >
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
