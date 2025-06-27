import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CancelSubscription = async (planId) => {
    const { userId  } = useStore.getState();

    try {
        const response = await api.get('/subscriptions/cancel', {
            params: { subscriptionId : planId, userId :userId }
        });
        console.log('Cancel subscription response:', response.data);

        return response.data;

    } catch (error) {
        console.error('Error in CancelSubscription function:', {
            error: error.message,
            userId,
            subscriptionId,
            status: error.response?.status
        });
        return false;
    }
};