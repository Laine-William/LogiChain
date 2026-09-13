import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../services/api/userApi';

export const useAuth = () => {
  const { setAuth, logout, user, isAuthenticated, isLoading } = useAuthStore();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (email, password) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await userApi.login({ email, password });
      // Supposant que l'API retourne { user, token }
      await setAuth(response.user, response.token);
      setIsSubmitting(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
      setIsSubmitting(false);
      return false;
    }
  };

  const register = async (userData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userApi.register(userData);
      setIsSubmitting(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error,
    login,
    register,
    logout,
  };
};