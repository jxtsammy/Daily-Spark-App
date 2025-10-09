import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CheckActivePaidSubscriptions = async () => {
    const { userId } = useStore.getState();

    try {
        const response = await api.get('/subscriptions/my-subscription', {
            params: { userId: userId }
        });
        console.log('Check active paid plan:', response.data);

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
export const CheckActivePaidSubscriptionsBoolean = async () => {
    const { userId } = useStore.getState();

    try {
        const response = await api.get('/subscriptions/my-subscription', {
            params: { userId: userId }
        });
        console.log('Check active paid plan boolean:', response.data);

        if (response.data.message === 'No active subscription found' || response.data.status === 'error') {
            return false;
        }
        return true

    } catch (error) {
        console.error('Error in CheckActivePaidSubscriptions function:', {
            error: error.message,
            userId,
            status: error.response?.status
        });
        return false;
    }
};