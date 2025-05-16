'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '../services/serviceService';
import { useProviders, Provider } from '../hooks/useProviders';

interface ServiceFormProps {
  onSubmit: (serviceData: Omit<Service, 'id'>) => Promise<void>;
  initialData?: Service;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const { providers, loading: providersLoading, error: providersError, fetchProviders } = useProviders();
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    providerId: 0
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof typeof formData | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        providerId: initialData.providerId
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du service est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.providerId) {
      newErrors.providerId = 'Veuillez sélectionner un prestataire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      if (!initialData) {
        setFormData({ name: '', description: '', providerId: 0 });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (field: keyof typeof formData) => `
    w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
    ${errors[field] ? 'border-red-500' : 'border-gray-200'}
    ${focusedField === field ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          {initialData ? 'Modifier le service' : 'Ajouter un service'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom du service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={inputClasses('name')}
              placeholder="Entrez le nom du service"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              className={inputClasses('description')}
              rows={4}
              placeholder="Décrivez le service en détail"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="providerId" className="block text-sm font-medium text-gray-700 mb-1.5">
              Prestataire <span className="text-red-500">*</span>
            </label>
            {providersLoading ? (
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Chargement des prestataires...</span>
              </div>
            ) : providersError ? (
              <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                <p className="text-sm text-red-600">{providersError}</p>
              </div>
            ) : (
              <select
                id="providerId"
                value={formData.providerId}
                onChange={(e) => {
                  setFormData({ ...formData, providerId: Number(e.target.value) });
                  if (errors.providerId) setErrors({ ...errors, providerId: undefined });
                }}
                onFocus={() => setFocusedField('providerId')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('providerId')}
              >
                <option value="">Sélectionnez un prestataire</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.email})
                  </option>
                ))}
              </select>
            )}
            {errors.providerId && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.providerId}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData ? 'Modification...' : 'Ajout...'}
              </span>
            ) : (
              initialData ? 'Modifier' : 'Ajouter'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 