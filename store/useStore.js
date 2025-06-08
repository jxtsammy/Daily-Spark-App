// stores/useStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AsyncStorage } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
    persist(
        (set) => ({
            onboarded: false,
            loggedIn: false,
            user: {},
            subscriptionId: "",
            setUser: (user) => set({ user }),
            loginUser: () => set({ loggedIn: true }),
            logOutUser: () => set({ loggedIn: false, user: "" }),
            setOnboardedTrue: () => set({ onboarded: true }),
            setOnboardedFalse: () => set({ onboarded: false }),
            resetStore: () => set({ onboarded: false, loggedIn: false, user: {}, subscriptionId: ""  }),
            setSubscriptionId: (subscriptionId) => set({ subscriptionId })
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);