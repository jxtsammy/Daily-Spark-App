import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CheckActivePaidSubscriptions = async () => {
    const { userId } = useStore.getState();

    try {
        const response = await api.get('/subscriptions/my-subscription', {
            params: { userId: userId }
        });
        console.log('CHeck active paid plan:', response.data);

        return response.data;

    } catch (error) {
        console.error('Error in CheckActivePaidSubscriptions function:', {
            error: error.message,
            userId,
            status: error.response?.status
        });
        return false;
    }
};