// a function to create an anonymous user
import api from '../helpers/api';
import { useStore } from '../store/useStore';


export const createFreeTrial = async () => {
    const {userId ,setSubscriptionId} = useStore.getState();

    try {
        if (!userId) {
            console.error('User ID is required to create a free trial');
            return false;
        }

        const response = await api.get('/payments/free-trial-plan');
        const planId = response.data.id;

        console.log('Subscription ID set in store:', response.data.id);

         const response0 = await api.post('/payments/has-active-free-trial', {
            userId});

        console.log('Check has active free trial response:', response0.data);

        if (response0.data.exists) {
            console.log('User already has an active free trial');
            return false;
        }

         const response1 = await api.post('/payments/create-user-subscription', {
            userId, subscriptionId: planId});

            console.log('User Subscription ID response:', response1.data);

            if (!response1.data) {
            console.error('Failed to create user subscription:', response1.data);
            return false;
        }
            setSubscriptionId(response1.data);


        return true;
    } catch (error) {
        console.error('Error creating anonymous user:', error);
        return false;
    }
}