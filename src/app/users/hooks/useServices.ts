import { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import type { Service } from '../../types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, fetchServices };
}; 