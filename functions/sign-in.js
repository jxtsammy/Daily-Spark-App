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
            setUserIsAnonymous,
            loginUser
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
            loginUser();
        }
        return response.data;


    } catch (error) {
        console.error('Error signing in:', {
            error: error.message,
        });
        return false;
    }
};

export const ResetPassword = async ({ email }) => {
    try {
        const response = await api.post('/auth/reset', { email });

        console.log('Reset password response:', response.data);

        if (response.data.success) {
            console.log('Password reset email sent successfully');
        } else {
            console.warn('Password reset request failed:', response.data.message);
        }

        return response.data;

    } catch (error) {
        console.error('Error requesting password reset:', {
            error: error.message,
            response: error.response?.data
        });
        
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to request password reset',
            error: error.response?.data?.error || 'request_failed'
        };
    }
};