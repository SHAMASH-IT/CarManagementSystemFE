import { useState, useCallback } from 'react';
import { Service, serviceService } from '../services/serviceService';

export const useService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(async (serviceData: Omit<Service, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newService = await serviceService.createService(serviceData);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = useCallback(async (id: number, serviceData: Partial<Service>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedService = await serviceService.updateService(id, serviceData);
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await serviceService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService
  };
}; 