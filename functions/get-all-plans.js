import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const GetAllPlans = async () => {
  const { userId } = useStore.getState();

  try {
    const response = await api.get('/subscriptions/plans');
    
   
    return response.data; 

  } catch (error) {
    console.error('Error getting plans:', {
      error: error.message,
      userId,
      status: error.response?.status
    });
    return false; 
  }
};