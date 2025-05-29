import { useState, useEffect } from "react";
import { categoryService } from "../service/categoryService";
import { Category, CategoryFormData } from "@/app/types";
import { Snackbar, Alert } from "@mui/material";

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [providerId, setProviderId] = useState<number | null>(null);

  const getProviderIdFromToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const userData = JSON.parse(jsonPayload);
      return userData?.sub ? parseInt(userData.sub.toString()) : null;
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  };

  const showToast = (message: string, severity: "success" | "error") => {
    setToastMessage({ message, severity });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerRefresh = () => {
    setRefreshFlag(prev => prev + 1);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentProviderId = getProviderIdFromToken();
      if (!currentProviderId) {
        throw new Error("Provider ID manquant");
      }
      setProviderId(currentProviderId);
      const data = await categoryService.getCategoriesByProviderId(currentProviderId); // Changé ici
      const sortedData = data.sort((a: Category, b: Category) => a.id - b.id); // Typage ajouté
      setCategories(sortedData);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      showToast("Impossible de charger les catégories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (refreshFlag >= 0) {
      loadData();
    }

    const unsubscribe = categoryService.onCategoryChange(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshFlag]);

  const addCategory = async (data: { name: string; providerId: number }) => {
    try {
      await categoryService.createCategory(data);
      showToast("Catégorie ajoutée avec succès", "success");
      triggerRefresh();
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      showToast("Impossible d'ajouter la catégorie", "error");
      throw error;
    }
  };

  const updateCategory = async (id: number, data: CategoryFormData) => {
    try {
      await categoryService.updateCategory(id, data);
      showToast("Catégorie mise à jour avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      showToast("Impossible de mettre à jour la catégorie", "error");
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      showToast("Catégorie supprimée avec succès", "success");
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
    refreshData: triggerRefresh,
    providerId,
  };
};
