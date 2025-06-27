import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const Register = async ({ email, password }) => {
    try {
        const {idToken} = useStore.getState();

        console.log(idToken ,email,password);

        

        if (!idToken) {
            console.log("No ID token found");
            return false;
        }

        const response = await api.post('/auth/init-link-account', { idToken, email, password });

       return response.data

    } catch (error) {
        console.error('Error registering:', error);
        return false;
    }
};