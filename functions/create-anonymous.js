import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const createAnonymous = async () => {
  try {
    // Get current state directly from the store
    const { userId, setUser, setUserId } = useStore.getState();
    
    console.log('Current UserId:', userId);
    
    // If user already exists, return early
    if (userId) {
      console.log('User ID already exists:', userId);
      return true;
    }

    // Create new anonymous user
    const responseAuth = await api.get('/auth/anonymous');
    console.log('Anonymous user creation response:', responseAuth.data);

    if (responseAuth.data.success) {
      const userData = responseAuth.data.data;
      
      // Update store with new user data
      setUser(userData);
      setUserId(userData.user?.uid || userData.uid);
      
      console.log('New User ID set:', userData.user?.uid || userData.uid);
      return true;
    }

    console.log('Anonymous creation failed - no success flag');
    return false;
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    return false;
  }
};