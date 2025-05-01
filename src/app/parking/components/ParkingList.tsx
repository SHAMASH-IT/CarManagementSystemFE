import { useState } from 'react';
import useParking from '../hooks/useParking';
import { FaCheckCircle, FaTimesCircle, FaParking, FaCarAlt, FaSpinner, FaTrash, FaPlus, FaPencilAlt } from 'react-icons/fa';
import ParkingForm from './ParkingForm';
import { deleteParking } from '../services/parkingService';

export default function ParkingList() {
  const { parkingSlots, loading, error, refreshParkingSlots } = useParking();
  const [showForm, setShowForm] = useState(false);
  const [editingParking, setEditingParking] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingParking(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    const parking = parkingSlots[0];
    if (parking) {
      setEditingParking(parking);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce parking ?')) {
      setDeleteLoading(id);
      try {
        await deleteParking(id);
        await refreshParkingSlots();
      } catch (err) {
        console.error('Error deleting parking:', err);
        alert('Une erreur est survenue lors de la suppression');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingParking(null);
    await refreshParkingSlots();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="text-sm mt-2">Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 bg-gray-50 min-h-screen flex flex-col justify-start items-center'>
      <div className='w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 mt-0 h-full'>
        <div className="flex justify-between items-center mb-6">
          <h1 className='text-4xl font-bold text-blue-800 tracking-wide'>Gestion du Parking 🅿️</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
               Ajouter un parking
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
            >
              <FaPencilAlt /> Modifier le parking
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="max-w-md w-full">
              <ParkingForm
                parking={editingParking}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingParking(null);
                }}
              />
            </div>
          </div>
        )}

        <div className='overflow-y-auto rounded-lg shadow-md' style={{ maxHeight: '75vh' }}>
          <table className='w-full table-auto border-collapse text-left'>
            <thead className='bg-blue-800 text-white'>
              <tr className='text-lg font-semibold uppercase'>
                <th className='px-4 py-3 border-b border-gray-200'>ID</th>
                <th className='px-4 py-3 border-b border-gray-200'>Nom</th>
                <th className='px-4 py-3 border-b border-gray-200'>Statut</th>
                <th className='px-4 py-3 border-b border-gray-200'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parkingSlots.map(place => (
                <tr
                  key={place.id}
                  className={`transition duration-200 ease-in-out ${
                    place.status === 'Disponible' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <td className='px-4 py-3 border-b border-gray-200'>{place.id}</td>
                  <td className='px-4 py-3 border-b border-gray-200'>{place.name}</td>
                  <td className='px-4 py-3 border-b border-gray-200'>
                    <div className='flex items-center gap-2'>
                      {place.status === 'Disponible' ? (
                        <>
                          <FaCheckCircle className='text-green-500' />
                          <span className='text-green-700'>Disponible</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className='text-red-500' />
                          <span className='text-red-700'>Occupé</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-3 border-b border-gray-200'>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      disabled={deleteLoading === place.id}
                    >
                      {deleteLoading === place.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex justify-between items-center text-gray-600'>
          <p className='text-sm font-medium flex items-center gap-2'>
            <FaParking className='text-blue-800' /> Total des places :{' '}
            <span className='text-blue-800'>{parkingSlots.length}</span>
          </p>
          <p className='text-sm font-medium flex items-center gap-2'>
            <FaCarAlt className='text-green-600' /> Places disponibles :{' '}
            <span className='text-green-600'>
              {parkingSlots.filter(place => place.status === 'Disponible').length}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}