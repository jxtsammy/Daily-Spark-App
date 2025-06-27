// a function to create an anonymous user
import api from '../helpers/api';
import { useStore } from '../store/useStore';
import { createAnonymous } from './create-anonymous';


export const createFreeTrial = async () => {
    const {userId ,setSubscriptionId} = useStore.getState();

    try {
        if (!userId) {
            console.log('User ID is required to create a free trial');
            await createAnonymous();
            return false;
        }

         const response0 = await api.post('/subscriptions/assign-free-plan', {
            userId});

        console.log('Free trial response:', response0.data);

        if (response0.data.message === 'Active subscription found') {
            console.log('User already has an active free trial');
            setSubscriptionId(response0.data.payload.id);
            return false; // User already has an active free trial
        }
            console.log('Free plan subscription successful');
            alert('Free plan subscription successful');

            setSubscriptionId(response0.data.payload.id);

        return true;
    } catch (error) {
        console.error('Error creating anonymous user:', error);
        return false;
    }
}