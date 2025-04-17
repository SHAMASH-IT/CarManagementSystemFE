// Pour le fichier useCategory.ts - intégrant l'utilisation de onCategoryChange

import { useState, useEffect } from "react";
import { categoryService } from "../service/categoryService";
import { Category, CategoryFormData } from "@/app/types";
import { Snackbar, Alert } from "@mui/material";

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const showToast = (message: string, severity: "success" | "error") => {
    setToastMessage({ message, severity });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fonction pour forcer le rafraîchissement manuellement si nécessaire
  const triggerRefresh = () => {
    console.log("Déclenchement manuel du rafraîchissement");
    setRefreshFlag(prev => prev + 1);
  };

  // Chargement des catégories
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log("Chargement des catégories...");
      const data = await categoryService.getCategories();
      const sortedData = data.sort((a, b) => a.id - b.id);
      console.log("Catégories chargées:", sortedData);
      setCategories(sortedData);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      showToast("Impossible de charger les catégories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Effet principal pour le chargement et l'abonnement aux événements
  useEffect(() => {
    console.log("Effet de chargement exécuté, flag:", refreshFlag);
    
    // Chargement initial
    loadData();
    
    // S'abonner aux changements du service
    const unsubscribe = categoryService.onCategoryChange(() => {
      console.log("Changement détecté via le système d'événements");
      loadData();
    });
    
    // Nettoyer l'abonnement lors du démontage
    return () => {
      unsubscribe();
    };
  }, [refreshFlag]); // Dépendance sur refreshFlag pour permettre aussi le rechargement manuel

  const addCategory = async (data: CategoryFormData) => {
    try {
      console.log("Ajout d'une catégorie...");
      await categoryService.createCategory(data);
      showToast("Catégorie ajoutée avec succès", "success");
      // Pas besoin d'appeler triggerRefresh ici car le service va notifier via notify()
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      showToast("Impossible d'ajouter la catégorie", "error");
      throw error;
    }
  };

  const updateCategory = async (id: number, data: CategoryFormData) => {
    try {
      console.log(`Mise à jour de la catégorie ${id}...`);
      await categoryService.updateCategory(id, data);
      showToast("Catégorie mise à jour avec succès", "success");
      // Pas besoin d'appeler triggerRefresh ici car le service va notifier via notify()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      showToast("Impossible de mettre à jour la catégorie", "error");
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      console.log(`Suppression de la catégorie ${id}...`);
      await categoryService.deleteCategory(id);
      showToast("Catégorie supprimée avec succès", "success");
      // Pas besoin d'appeler triggerRefresh ici car le service va notifier via notify()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showToast("Impossible de supprimer la catégorie", "error");
      throw error;
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    toastMessage,
    showToast,
    refreshData: triggerRefresh, // Pour un rafraîchissement manuel si nécessaire
  };
};