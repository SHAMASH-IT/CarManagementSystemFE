"use client";

import { useState } from "react";
import { Pencil, Trash, FilePlus2 } from 'lucide-react';
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import AddCategoryModal from "./AddCategory";
import { useCategory } from "../hooks/useCategory";

export default function CategoryTable() {
  const { categories, isLoading, toastMessage } = useCategory();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Catégories</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          <FilePlus2 size={20} />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-2/3">
                Nom de la catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-1/3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories?.map((category) => (
              <tr key={category.id} className={`bg-white hover:bg-gray-50`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="bg-yellow-400 text-white px-3 py-2 rounded-lg hover:bg-yellow-500 transition duration-150"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-150"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCategoryModal
        category={selectedCategory}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
      />

      <DeleteCategoryModal
        category={selectedCategory}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}
