// stores/useStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
    persist(
        (set) => ({
            onboarded: false,
            loggedIn: false,
            idToken: "",
            refreshToken: "",
            userId: "",
            user: {},
            subscriptionId: "",
            email: "",
            isAnonymous: true,
            emailVerified: false,

            setIdToken: (idToken) => set({ idToken }),
            setRefreshToken: (refreshToken) => set({ refreshToken }),
            setUserEmail: (email) => set({ email }),
            setUserEmailVerified: (emailVerified) => set({ emailVerified }),
            setUserIsAnonymous: (isAnonymous) => ({ isAnonymous }),
            setUserId: (userId) => set({ userId }),
            setUser: (user) => set({ user }),
            loginUser: () => set({ loggedIn: true }),
            logOutUser: () => set({ loggedIn: false, user: "" }),
            setOnboardedTrue: () => set({ onboarded: true }),
            setOnboardedFalse: () => set({ onboarded: false }),
            resetStore: () => set({ onboarded: false, loggedIn: false, user: {}, subscriptionId: "",
                idToken: "", refreshToken: "", userId: "", email: "", isAnonymous: true, emailVerified: false }),
            setSubscriptionId: (subscriptionId) => set({ subscriptionId })
        }),
        {
            name: 'appstorage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);