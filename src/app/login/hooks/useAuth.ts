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
      const base64Url = response.access_token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const userData = JSON.parse(jsonPayload)
      console.log("response login",response);
      setUser(response.access_token);
      if (userData.role === 'CLIENT'){
        router.push('/users'); 
      }else if (userData.role === 'PROVIDER'){
        router.push('/appointments');
      }else{
        // Redirection de l'administrateur vers la page de gestion des utilisateurs
        router.push('/reports');
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