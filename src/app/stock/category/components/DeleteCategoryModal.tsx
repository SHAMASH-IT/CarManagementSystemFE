"use client";

import { useCategory } from "../hooks/useCategory";

interface DeleteCategoryModalProps {
  category: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCategoryModal({ category, isOpen, onClose }: DeleteCategoryModalProps) {
  const { deleteCategory } = useCategory();

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteCategory(category.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Supprimer la catégorie</h2>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer la catégorie "{category?.name}" ? Cette action est irréversible.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}