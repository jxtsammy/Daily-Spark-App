import ToastManager, { Toast } from 'toastify-react-native';
import api from '../helpers/api';
import { useStore } from '../store/useStore';
import { createAnonymous } from './create-anonymous';

export const createFreeTrial = async () => {
    const { userId, setSubscriptionId } = useStore.getState();

    try {
        if (!userId) {
            console.error('User ID is required to create a free trial');
            await createAnonymous();
            return false;
        }

        const response0 = await api.post('/subscriptions/assign-free-plan', {
            userId
        });

        console.log('Free trial response:', response0.data);

        if (response0.data.message === 'Active subscription found') {
            console.log('User already has an active free trial');
            setSubscriptionId(response0.data.payload.id);
            Toast.info('You already have an active free trial.');
            return false; // User already has an active free trial
        }

        if (response0.data.payload && response0.data.payload.id) {
            console.log('Free plan subscription successful');
            Toast.success('Free plan subscription successful');
            setSubscriptionId(response0.data.payload.id);
            return true; // Free trial created successfully
        }

        // If response does not contain expected payload
        Toast.error('Unexpected response. Please try again.');
        return false;
    } catch (error) {
        if (error.message && error.message.toLowerCase().includes('network')) {
            Toast.error('Network error. Please check your connection and try again.');
        } else {
            Toast.error('Error creating free trial. Please try again later.');
        }
        console.error('Error creating free trial:', error);
        return false;
    }
}
