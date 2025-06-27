import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CheckHasExpiredSubscription = async () => {
  const { userId ,subscriptionId } = useStore.getState();

  try {
    const response = await api.post('/subscriptions/has-expired-subscription', { userId ,planId:subscriptionId });
    
   
    return response.data; // Returns true if subscription has expired

  } catch (error) {
    console.error('Error checking expired subscription:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; 
  }
};