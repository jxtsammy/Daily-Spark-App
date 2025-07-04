import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // User state
  userId: null,
  loggedIn: false,
  onboarded: false,
  
  // Actions
  setOnboardedTrue: () => set({ onboarded: true }),
  setLoggedIn: (value) => set({ loggedIn: value }),
  setUserId: (id) => set({ userId: id }),
  
  // Reset store
  resetStore: () => set({
    userId: null,
    loggedIn: false,
    onboarded: false,
  }),
}));
