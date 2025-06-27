import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const SignIn = async ({ email, password }) => {

    try {

        const {
            setUserId,
            setIdToken,
            setRefreshToken,
            setUserEmail,
            setUserEmailVerified,
            setUserIsAnonymous
        } = useStore.getState();

        const response = await api.post('/auth/login', { email, password });

        console.log('Sign in response:', response.data);

        if (response.data.success) {
            const userData = response.data.data || {};
            const user = userData.user || {};

            const storedData = {
                uid: user.uid,
                idToken: userData.idToken,
                refreshToken: userData.refreshToken,
                email: user.email || null,
                emailVerified: user.emailVerified || false,
                isAnonymous: false
            };

            console.log('Storing user data:', {
                uid: storedData.uid,
                idToken: storedData.idToken ,
                refreshToken: storedData.refreshToken ,
                email: storedData.email,
                emailVerified: storedData.emailVerified,
                isAnonymous:false
            });
            // Update store with new user data
            setUserId(storedData.uid);
            setIdToken(storedData.idToken);
            setRefreshToken(storedData.refreshToken);
            setUserEmail(storedData.email);
            setUserEmailVerified(storedData.emailVerified);
            setUserIsAnonymous(storedData.isAnonymous);
        }
        return response.data;


    } catch (error) {
        console.error('Error signing in:', {
            error: error.message,
        });
        return false;
    }
};