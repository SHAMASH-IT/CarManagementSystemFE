import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaParking } from 'react-icons/fa';
import AddParkingForm from './AddParkingForm';
import EditParkingForm from './EditParkingForm';

interface Location {
  id: number;
  name: string;
  parkingId: number;
  status: 'EMPTY' | 'OCCUPIED';
}

interface Parking {
  id: number;
  name: string;
  places: number;
  serviceId?: number;
  locations: Location[];
}

const ParkingManagement: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingParking, setEditingParking] = useState<Parking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/parking/all-parkings');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des parkings');
      }
      
      const data = await response.json();
      setParkings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const handleDeleteParking = async (id: number) => {
    try {
      setLoading(true);
      console.log(`🗑️ Suppression du parking ID: ${id}`);

      const response = await fetch(`http://localhost:3000/parking/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du parking');
      }
      
      await fetchParkings(); // ✅ Recharge la liste après suppression
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleParkingAdded = async () => {
    console.log('✅ Parking ajouté, rechargement en cours...');
    await fetchParkings();
  };

  const handleParkingUpdated = async () => {
    console.log('🔄 Parking mis à jour, rechargement en cours...');
    await fetchParkings();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
          <FaParking className="mr-2" /> Gestion des Parkings
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <AddParkingForm onParkingAdded={handleParkingAdded} />
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Liste des parkings</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-4xl text-blue-800" />
            </div>
          ) : parkings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun parking disponible. Ajoutez-en un !
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Nom</th>
                    <th className="px-4 py-3 text-left">Places</th>
                    <th className="px-4 py-3 text-left">Service ID</th>
                    <th className="px-4 py-3 text-left">Disponibilité</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parkings.map((parking) => (
                    <tr key={parking.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{parking.id}</td>
                      <td className="px-4 py-3 font-medium">{parking.name}</td>
                      <td className="px-4 py-3">{parking.places}</td>
                      <td className="px-4 py-3">{parking.serviceId || '-'}</td>
                      <td className="px-4 py-3">
                        {parking.locations.filter(loc => loc.status === 'EMPTY').length} / {parking.places}
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
    </div>
  );
};

export default ParkingManagement;
