import axios from 'axios';
import { API_CONFIG } from '../../config/api';
import { getSecureAuth, clearSecureAuth } from '../../store/secureStore'; 

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête : Récupération asynchrone du token depuis le stockage sécurisé
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { token } = await getSecureAuth();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de l\'injection du token JWT', error);
    }
  
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion centralisée du 401 et redirection vers le login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await clearSecureAuth();

        const { useAuthStore } = require('../../store/authStore');

        useAuthStore.getState().logout();
      
      } catch (logoutError) {
      
        console.error('Erreur lors de la réinitialisation de la session', logoutError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;