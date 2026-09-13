import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: true,
  pendingQueueCount: 0,
  
  setIsOnline: (status) => set({ isOnline: status }),
  setPendingQueueCount: (count) => set({ pendingQueueCount: count }),
  // Vous pouvez appeler cette méthode en interrogeant SQLite au démarrage ou après une insertion
}));