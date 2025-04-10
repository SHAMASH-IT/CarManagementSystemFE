import { useState } from 'react';
import { createParking, updateParking } from '../services/parkingService';

interface ParkingFormProps {
  parking?: {
    id: number;
    name: string;
    places: number;
    serviceId: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ParkingForm({ parking, onSuccess, onCancel }: ParkingFormProps) {
  const [formData, setFormData] = useState({
    name: parking?.name || '',
    places: parking?.places || 0,
    serviceId: parking?.serviceId || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (parking?.id) {
        await updateParking(parking.id, formData);
      } else {
        await createParking(formData);
      }
      onSuccess();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        {parking ? 'Modifier le parking' : 'Ajouter un nouveau parking'}
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du parking
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="places" className="block text-sm font-medium text-gray-700">
          Nombre de places
        </label>
        <input
          type="number"
          id="places"
          value={formData.places}
          onChange={(e) => setFormData(prev => ({ ...prev, places: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          required
          min="0"
        />
      </div>

      <div>
        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
          ID du service
        </label>
        <input
          type="number"
          id="serviceId"
          value={formData.serviceId}
          onChange={(e) => setFormData(prev => ({ ...prev, serviceId: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          required
          min="1"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : parking ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}