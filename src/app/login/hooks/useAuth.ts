'use client'
import { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginData, RegisterData } from '../services/auth.service';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [user,setUser]=useState<any | null>(null);
  

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await  authService.login(data);
      setUser(response.access_token);
      if (response.role === 'CLIENT'){
        router.push('/users'); 
      }else if (response.role === 'PROVIDER'){
        router.push('/appointments');
      }else{
        router.push('/appointments');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register(data);
      router.push('/users'); // Redirige vers le tableau de bord après inscription
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    router.push('/login');
  };

  const getProfile = async()=>{
    try{
      const response = await authService.getProfile();
      setUser(response.data);

    }catch(err:any){
      setError(err.response?.data?.message || 'Une erreur est survenue');

    }
  }

  return {
    login,
    register,
    logout,
    loading,
    error,
    
    user,
    isAuthenticated: authService.isAuthenticated(),
  };
}; 