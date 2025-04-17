
// 1. D'abord, voici le categoryService modifié :

import { Category, CategoryFormData } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

// Ajout d'un événement pour signaler les changements
const categoryEvents = {
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
  notify() {
    this.listeners.forEach(listener => listener());
  }
};

class CategoryService {
  async getCategories(): Promise<Category[]> {
    // Ajout d'un paramètre timestamp pour éviter le cache
    const timestamp = new Date().getTime();
    const response = await fetch(`${API_URL}/stock/categories?_t=${timestamp}`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  }

  async createCategory(data: CategoryFormData): Promise<Category> {
    const response = await fetch(`${API_URL}/stock/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    // Notifier les abonnés qu'un changement a eu lieu
    categoryEvents.notify();
    return response.json();
  }

  async updateCategory(id: number, data: CategoryFormData): Promise<Category> {
    const response = await fetch(`${API_URL}/stock/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    // Notifier les abonnés qu'un changement a eu lieu
    categoryEvents.notify();
    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/stock/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    // Notifier les abonnés qu'un changement a eu lieu
    categoryEvents.notify();
  }

  // Méthode pour s'abonner aux changements
  onCategoryChange(listener: () => void) {
    return categoryEvents.subscribe(listener);
  }
}

export const categoryService = new CategoryService();