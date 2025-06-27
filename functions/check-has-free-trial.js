import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const CheckHasFreeTrial = async () => {
  const { userId } = useStore.getState();

  try {
    const response = await api.post('/subscriptions/has-active-free-trial', { userId });
    
    if(response.data.status === 'error') {
      return false; // No active free trial
    }
    return true;

  } catch (error) {
    console.error('Error checking free trial:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; 
  }
};