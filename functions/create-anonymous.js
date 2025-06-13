import api from '../helpers/api';
import { useStore } from '../store/useStore';

export const createAnonymous = async (location) => {
  try {
    // Get current state directly from the store
    const { 
      userId, 
      setUser, 
      setUserId,
      setIdToken,
      setRefreshToken,
      setUserEmail,
      setUserEmailVerified,
      setUserIsAnonymous
    } = useStore.getState();
    
    console.log(`[${location}] Current User State:`, { 
      existingUserId: userId 
    });
    
    // If user already exists, return early
    if (userId) {
      console.log(`[${location}] User already exists - no action needed`);
      return true;
    }

    // Create new anonymous user
    console.log(`[${location}] Creating new anonymous user...`);
    const responseAuth = await api.get('/auth/anonymous');
    
    if (responseAuth.data.success) {
      const userData = responseAuth.data.data;
      const user = userData.user || {};
      
      // Prepare data to be stored
      const storedData = {
        uid: user.uid,
        idToken: userData.idToken,
        refreshToken: userData.refreshToken,
        email: user.email || null,
        emailVerified: user.emailVerified || false,
        isAnonymous: user.isAnonymous || true
      };

      // Update store with new user data
      setUser(userData);
      setUserId(storedData.uid);
      setIdToken(storedData.idToken);
      setRefreshToken(storedData.refreshToken);
      setUserEmail(storedData.email);
      setUserEmailVerified(storedData.emailVerified);
      setUserIsAnonymous(storedData.isAnonymous);
      
      console.log(`[${location}] Successfully stored new user data:`, {
        userId: storedData.uid,
        idToken: storedData.idToken ? '*** (truncated)' : null,
        refreshToken: storedData.refreshToken ? '*** (truncated)' : null,
        email: storedData.email,
        emailVerified: storedData.emailVerified,
        isAnonymous: storedData.isAnonymous
      });
      
      return true;
    }

    console.log(`[${location}] Anonymous creation failed - response:`, responseAuth.data);
    return false;
  } catch (error) {
    console.error(`[${location}] Error creating anonymous user:`, {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};