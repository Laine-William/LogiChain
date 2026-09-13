import { create } from 'zustand';
import { setSecureAuth, clearSecureAuth, getSecureAuth } from './secureStore';
import { userApi } from '../services/api/userApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await setSecureAuth(user, token); // 🔒 Utilisation du secure store
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await clearSecureAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateAccountStatus: async (newAccountStatus) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const userId = currentUser.id || currentUser._id;
    const updatedUser = { ...currentUser, accountStatus: newAccountStatus };
    
    // Mise à jour optimiste UI + Stockage sécurisé
    set({ user: updatedUser });
    await setSecureAuth(updatedUser, get().token);
    
    try {
      await userApi.updateAccountStatus(userId, newAccountStatus);
    } catch (error) {
      // Rollback
      set({ user: currentUser });
      await setSecureAuth(currentUser, get().token);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const { token, user } = await getSecureAuth();
      if (token && user) {
        set({ user, token, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Erreur d'initialisation de l'authentification", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setStatus: async (newStatus) => {
    const currentUser = get().user;
    if (!currentUser || currentUser.availabilityStatus === newStatus) return;

    const updatedUser = { ...currentUser, availabilityStatus: newStatus };
    set({ user: updatedUser });
    await setSecureAuth(updatedUser, get().token);

    try {
      await userApi.updateAvailability(currentUser.id, newStatus);
    } catch (error) {
      set({ user: currentUser });
      await setSecureAuth(currentUser, get().token);
    }
  }
}));