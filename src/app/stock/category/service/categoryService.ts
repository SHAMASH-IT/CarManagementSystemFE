import { Category, CategoryFormData } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

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
 private getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
  }
async getCategoriesByProviderId(providerId: number): Promise<Category[]> {
    const response = await fetch(`${API_URL}/stock/categories/provider/${providerId}`, {
  
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  }
  async createCategory(data: { name: string; providerId: number }): Promise<Category> {
    const response = await fetch(`${API_URL}/stock/categories`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: JSON.stringify({
        name: data.name,
        providerId: data.providerId // Envoyer explicitement le providerId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create category");
    }

    categoryEvents.notify();
    return response.json();
  }

  async updateCategory(id: number, data: CategoryFormData): Promise<Category> {
    const response = await fetch(`${API_URL}/stock/categories/${id}`, {
      method: "PUT",
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    categoryEvents.notify();
    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/stock/categories/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    categoryEvents.notify();
  }

  onCategoryChange(listener: () => void) {
    return categoryEvents.subscribe(listener);
  }
}

export const categoryService = new CategoryService();
