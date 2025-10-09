// stores/useStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
    persist(
        (set) => ({
            onboarded: false,
            themeSelected: false,
            loggedIn: false,
            currentTheme: null,
            idToken: "",
            refreshToken: "",
            userId: "",
            user: {},
            topics: [],
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
            setTopics: (topics) => set({ topics }),
            toggleTopic: (topicId) => set((state) => {
                const exists = Array.isArray(state.topics) && state.topics.includes(topicId);
                if (exists) {
                    return { topics: state.topics.filter(id => id !== topicId) };
                }
                return { topics: [...(state.topics || []), topicId] };
            }),
            loginUser: () => set({ loggedIn: true }),
            logOutUser: () => set({ loggedIn: false, user: "" }),
            setOnboardedTrue: () => set({ onboarded: true }),
            setOnboardedFalse: () => set({ onboarded: false }),
            setThemeSelected: (flag = true) => set({ themeSelected: flag }),
            setCurrentTheme: (theme) => set({ currentTheme: theme }),
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