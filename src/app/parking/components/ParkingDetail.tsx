// components/ParkingDetail.tsx
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSpinner, FaParking, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

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

const ParkingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParking = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/parking/parking/${id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du parking');
        }
        
        const data = await response.json();
        setParking(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-800" />
      </div>
    );
  }

  if (error || !parking) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Retour
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Parking non trouvé"}
          </div>
        </div>
      </div>
    );
  }

  // Calcul des statistiques
  const emptyCount = parking.locations.filter(loc => loc.status === 'EMPTY').length;
  const occupiedCount = parking.locations.filter(loc => loc.status === 'OCCUPIED').length;
  const availabilityPercentage = (emptyCount / parking.places) * 100;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Retour
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-800 flex items-center">
              <FaParking className="mr-2" /> {parking.name}
            </h1>
            {parking.serviceId && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Service ID: {parking.serviceId}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Places totales</h3>
              <p className="text-2xl font-bold">{parking.places}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-medium text-green-700">Places disponibles</h3>
              <p className="text-2xl font-bold">{emptyCount}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-medium text-red-700">Places occupées</h3>
              <p className="text-2xl font-bold">{occupiedCount}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">État d'occupation</h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full" 
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {availabilityPercentage.toFixed(0)}% d'emplacements disponibles
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Emplacements</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {parking.locations.map((location) => (
              <div 
                key={location.id}
                className={`p-4 rounded-lg border ${
                  location.status === 'EMPTY' 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium mb-2">{location.name}</p>
                  {location.status === 'EMPTY' ? (
                    <div className="flex items-center justify-center text-green-600">
                      <FaCheckCircle className="mr-1" />
                      <span>Libre</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-red-600">
                      <FaTimesCircle className="mr-1" />
                      <span>Occupé</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;