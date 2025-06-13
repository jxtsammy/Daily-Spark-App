import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const SignIn = async ({ email, password }) => {

    try {

        if (!idToken) {
            console.log("No ID token found");
            return false;
        }

        const response = await api.post('/auth/signin', {  email, password });
        console.log('Register response:', response.data);


    } catch (error) {
        console.error('Error checking free trial:', {
            error: error.message,
            status: error.response?.status
        });
        return false; 
    }
};