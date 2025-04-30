import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { stockService } from '../../stock/services/stockService';
import { Stock } from '../../types';
import { toast } from 'react-hot-toast';

interface AddPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPiece: (pieceId: number, quantity: number) => void;
  interventionId: number;
}

const AddPieceModal: React.FC<AddPieceModalProps> = ({ isOpen, onClose, onAddPiece, interventionId }) => {
  const [pieces, setPieces] = useState<Stock[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPieces();
    }
  }, [isOpen]);

  const loadPieces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockService.getAllStocks();
      setPieces(data);
    } catch (error) {
      console.error('Error loading pieces:', error);
      setError('Erreur lors du chargement des pièces');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPieceId && quantity > 0) {
      const selectedPiece = pieces.find(p => String(p.id) === String(selectedPieceId));
      if (selectedPiece && quantity > selectedPiece.stock) {
        setError(`Stock insuffisant. Disponible: ${selectedPiece.stock}`);
        return;
      }
      try {
        onAddPiece(Number(selectedPieceId), quantity);
        onClose();
        toast.success('Pièce ajoutée avec succès');
      } catch (err) {
        setError('Erreur lors de l\'ajout de la pièce');
      }
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock <= 0) return 'text-red-500';
    if (stock <= threshold) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ajouter une pièce</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="piece" className="block text-sm font-medium text-gray-700 mb-1">
              Pièce
            </label>
            <select
              id="piece"
              value={selectedPieceId}
              onChange={(e) => {
                setSelectedPieceId(e.target.value);
                setError(null);
              }}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Sélectionner une pièce</option>
              {pieces.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.name} - {piece.price} DT (Stock: {piece.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => {
                const newQuantity = Math.max(1, Number(e.target.value));
                setQuantity(newQuantity);
                setError(null);
              }}
              min="1"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPieceModal; 