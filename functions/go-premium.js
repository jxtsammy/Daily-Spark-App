import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const GoPremium = async ( planId ) => {
  const { userId } = useStore.getState();

  try {
    const response = await api.post('/subscriptions/subscribe-paid', { userId, planId });
    console.log('Go premium function response :', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error in go premium function:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; // Default to false on error (no trial)
  }
};