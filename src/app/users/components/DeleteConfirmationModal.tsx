'use client'

import { useState } from 'react'

import Modal from 'react-modal'
import { Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  eventId: string | null
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, eventId }: DeleteConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_APP_URL

  const handleDelete = async () => {
    if (!eventId) return

    setIsDeleting(true)
    console.log('Début de la suppression du rendez-vous avec ID:', eventId)
    console.log('URL de l\'API:', `${API_URL}/appointments/cancel/${eventId}`)

    try {
      const response = await fetch(`${API_URL}/appointments/cancel/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Statut de la réponse:', response.status)
      console.log('Headers de la réponse:', response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur détaillée:', errorData)
        
        // Si le rendez-vous n'existe plus, on considère que la suppression est réussie
        if (errorData.message === 'Appointment not found!') {
          console.log('Le rendez-vous a déjà été supprimé')
          onConfirm() // Rafraîchir la liste
          onClose()
          return
        }
        
        throw new Error(errorData.message || 'Erreur lors de la suppression du rendez-vous')
      }

      console.log('Appel API réussi pour la suppression du rendez-vous:', eventId)
      onConfirm()
      console.log('Rendez-vous supprimé avec succès')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Erreur lors de la suppression du rendez-vous')
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className='max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
    >
      <div className='text-center'>
        <h2 className='text-xl font-semibold mb-4'>Confirmer la suppression</h2>
        <p className='mb-6'>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
        <div className='flex justify-center space-x-4'>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors disabled:opacity-50'
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center disabled:opacity-50'
          >
            <Trash2 size={16} className='mr-2' />
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmationModal
