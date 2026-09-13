import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isLoadingGlobal: false,
  globalModal: {
    visible: false,
    title: '',
    message: '',
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
  },

  setGlobalLoading: (status) => set({ isLoadingGlobal: status }),
  
  showModal: (title, message, type = 'info') => set({
    globalModal: { visible: true, title, message, type }
  }),

  hideModal: () => set({
    globalModal: { visible: false, title: '', message: '', type: 'info' }
  }),
}));