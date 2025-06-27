import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const GoPremium = async ( planId ) => {
  const { userId } = useStore.getState();

  try {
    const response = await api.post('/subscriptions/subscribe-paid', { userId, planId });
    console.log('Go premium response:', response.data);
    
    // Return TRUE if trial exists (matches your navigation logic)
    return response.data.exists;
    
  } catch (error) {
    console.error('Error checking free trial:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; // Default to false on error (no trial)
  }
};