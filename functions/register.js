import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const Register = async ({ email, password }) => {
    try {
        const {idToken} = useStore.getState();

        if (!idToken) {
            console.log("No ID token found");
            return false;
        }

        const response = await api.post('/auth/register', { idToken, email, password });
        console.log('Register response:', response.data);

return response.data.success

    } catch (error) {
        console.error('Error checking free trial:', {
            error: error.message,
            status: error.response?.status
        });
        return false; 
    }
};