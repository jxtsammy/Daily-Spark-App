import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CheckHasExpiredSubscription = async () => {
  const { userId ,subscriptionId } = useStore.getState();
  console.log('Checking expired subscription for user:', userId, 'with subscription ID:', subscriptionId);

  try {
    const response = await api.post('/subscriptions/has-expired-subscription', { userId ,subscriptionId });
    
   
    return response.data; 

  } catch (error) {
    console.error('Error checking expired subscription:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; 
  }
};