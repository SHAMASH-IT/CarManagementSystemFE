"use client";

import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategory } from "../hooks/useCategory";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  providerId: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { addCategory, providerId } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState // On garde formState complet
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      providerId: undefined
    }
  }) as UseFormReturn<FormValues> & { 
    formState: { 
      errors: Record<string, any>;
      isSubmitting: boolean;
    } 
  };

  useEffect(() => {
    if (providerId) {
      setValue("providerId", providerId);
    }
  }, [providerId, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!data.providerId) {
      console.error("Provider ID manquant");
      return;
    }

    try {
      await addCategory({
        name: data.name,
        providerId: data.providerId
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter une catégorie</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le nom de la catégorie"
            />
            {formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formState.isSubmitting ? "Envoi..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
