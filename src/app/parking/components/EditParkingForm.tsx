// components/EditParkingForm.tsx
import React, { useState, useEffect } from 'react';
import { FaSave, FaSpinner, FaTimes } from 'react-icons/fa';

interface Parking {
  id: number;
  name: string;
  places: number;
  serviceId?: number;
}

interface EditParkingFormProps {
  parking: Parking;
  onClose: () => void;
  onParkingUpdated: () => void;
}

const EditParkingForm: React.FC<EditParkingFormProps> = ({ 
  parking, 
  onClose, 
  onParkingUpdated 
}) => {
  const [name, setName] = useState(parking.name);
  const [places, setPlaces] = useState(parking.places.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(parking.name);
    setPlaces(parking.places.toString());
  }, [parking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !places) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const parkingData = {
        name,
        places: parseInt(places)
      };
      
      const response = await fetch(`http://localhost:3005/parking/edit-parking/${parking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkingData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du parking');
      }
      
      // Notification du composant parent que le parking a été modifié
      onParkingUpdated();
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Modifier le parking</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Nom du parking *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="places" className="block mb-2 font-medium text-gray-700">
              Nombre de places *
            </label>
            <input
              type="number"
              id="places"
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
            {parseInt(places) !== parking.places && (
              <p className="mt-1 text-sm text-orange-600">
                Attention : modifier le nombre de places recréera toutes les locations existantes !
              </p>
            )}
          </div>
          
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSave className="mr-2" />
              )}
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditParkingForm;