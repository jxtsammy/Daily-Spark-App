import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const VerifyPayment = async (reference) => {
    const { userId } = useStore.getState();

    try {
        const response = await api.get('/subscriptions/verify', {
            params: { reference }
        });
        console.log('Verify payment response:', response.data);

        return response.data;

    } catch (error) {
        console.error('Error in verify payment function:', {
            error: error.message,
            userId,
            status: error.response?.status
        });
        return false;
    }
};