import axios from 'axios';

const API_URL = 'http://localhost:3005/auth';

// Configuration d'axios pour afficher les erreurs
axios.interceptors.request.use(request => {
  console.log('Requête sortante:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Réponse reçue:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('Erreur axios:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  access_token: string;
  role: string;
  id: number;
  name: string;
  email: string;
  phone: string;
}

class AuthService {
  private isClient = typeof window !== 'undefined';
  private authCheckInProgress = false;

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/signin`, data);
      
      if (!response.data) {
        throw new Error('Réponse invalide du serveur');
      }

      const token = response.data.access_token || response.data.token;
      if (token && this.isClient) {
        localStorage.setItem('token', token);
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
        }
      }

      return {
        access_token: token,
        role: response.data.role,
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone
      };
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error.message);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/signup`, data);
      
      if (!response.data) {
        throw new Error('Réponse invalide du serveur');
      }

      const token = response.data.access_token || response.data.token;
      if (token && this.isClient) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error.message);
      throw error;
    }
  }

  logout() {
    if (this.isClient) {
      console.log('Tentative de déconnexion');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      console.log('Token et rôle supprimés du localStorage');
    }
  }

  async getProfile(): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('aucun token trouvé');
    }
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  getCurrentToken(): string | null {
    if (!this.isClient) return null;
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    if (!this.isClient) return false;
    if (this.authCheckInProgress) return false;
    
    this.authCheckInProgress = true;
    const token = this.getCurrentToken();
    const isAuth = !!token;
    
    if (isAuth) {
      try {
        // Décoder le token JWT pour obtenir les informations de l'utilisateur
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);
        console.log('Utilisateur authentifié:', {
          id: userData.sub,
          email: userData.email,
          role: userData.role
        });
      } catch (error) {
        console.log('Token présent mais impossible de décoder les données utilisateur');
      }
    }
    
    this.authCheckInProgress = false;
    return isAuth;
  }
}

export const authService = new AuthService(); 