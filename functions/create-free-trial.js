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

         const response0 = await api.post('/subscription/assign-free-plan', {
            userId});

        console.log('Free trial response:', response0.data);

        if (response0.data.exists) {
            console.log('User already has an active free trial');
            return false;
        }

            // setSubscriptionId(response1.data);


        return true;
    } catch (error) {
        console.error('Error creating anonymous user:', error);
        return false;
    }
}