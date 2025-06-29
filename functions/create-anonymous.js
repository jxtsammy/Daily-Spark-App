import api from '../helpers/api';
import { useStore } from '../store/useStore';
import ToastManager, { Toast } from 'toastify-react-native';

export const createAnonymous = async (location) => {
  try {
    const { 
      userId, 
      isAnonymous,
      setUser, 
      setUserId,
      setIdToken,
      setRefreshToken,
      setUserEmail,
      setUserEmailVerified,
      setUserIsAnonymous
    } = useStore.getState();
    
    console.log(`[${location}] Current User State:`, { 
      existingUserId: userId,
      isAnonymous
    });
    
    if (userId && isAnonymous) {
      console.log(`[${location}] User is already anonymous - no action needed`);
      Toast.info('You are already signed in anonymously.');
      return true;
    } else if (userId && !isAnonymous) {
      console.log(`[${location}] User is already registered with email.`);
      Toast.info('You are already registered with an email.');
      return true;
    }

    console.log(`[${location}] Creating new anonymous user...`);
    const responseAuth = await api.get('/auth/anonymous');
    console.log(`[${location}] Response from anonymous user creation:`, responseAuth.data);

    if (responseAuth.data.success) {
      const userData = responseAuth.data.data;
      const user = userData.user || {};
      const storedData = {
        uid: user.uid,
        idToken: userData.idToken,
        refreshToken: userData.refreshToken,
        email: user.email || null,
        emailVerified: user.emailVerified || false,
        isAnonymous: user.isAnonymous || true
      };

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
      Toast.success('Anonymous user created successfully.');
      return true;
    }

    console.log(`[${location}] Anonymous creation failed - response:`, responseAuth.data);
    Toast.error('Failed to create anonymous user.');
    return false;
  } catch (error) {
    console.error(`[${location}] Error creating anonymous user:`, {
      error: error.message,
      stack: error.stack
    });
    if (error.message === 'Network Error') {
      Toast.error('Network error: Please check your internet connection.');
    } else {
      Toast.error(`Error: ${error.message}`);
    }
    return false;
  }
};
