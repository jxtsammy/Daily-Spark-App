import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Queue to store navigation actions when navigation is not ready
let navigationQueue = [];
let isNavigationReady = false;

export function customNavigate(name, params) {
  console.log('CustomNavigate called:', name, params);
  console.log('Navigation ready status:', isNavigationReady);
  console.log('navigationRef.isReady():', navigationRef.isReady());
  
  if (isNavigationReady && navigationRef.isReady()) {
    console.log('Navigation is ready, navigating immediately');
    navigationRef.navigate(name, params);
  } else {
    console.log('Navigation not ready, queueing navigation action');
    navigationQueue.push({ name, params });
    attemptQueuedNavigation();
  }
}

// Function to attempt queued navigation actions
function attemptQueuedNavigation() {
  if (isNavigationReady && navigationRef.isReady() && navigationQueue.length > 0) {
    console.log('Navigation ready, executing queued actions');
    const actionsToExecute = [...navigationQueue];
    navigationQueue = []; // Clear queue
    
    actionsToExecute.forEach(action => {
      console.log('Executing queued navigation:', action.name);
      navigationRef.navigate(action.name, action.params);
    });
  } else if (navigationQueue.length > 0) {
    console.log('Navigation still not ready, retrying in 200ms');
    setTimeout(() => {
      attemptQueuedNavigation();
    }, 200);
  }
}

// Enhanced navigate function with retry logic
export function navigateWithRetry(name, params, maxRetries = 15, delay = 200) {
  console.log('NavigateWithRetry called:', name, params);
  console.log('Navigation ready status:', isNavigationReady);
  console.log('navigationRef.isReady():', navigationRef.isReady());
  
  let retryCount = 0;
  
  const attemptNavigation = () => {
    const navReady = navigationRef.isReady();
    console.log(`Attempt ${retryCount + 1}: Navigation ready = ${navReady}, isNavigationReady = ${isNavigationReady}`);
    
    if (navReady && isNavigationReady) {
      console.log('Navigation successful!');
      navigationRef.navigate(name, params);
      return;
    }
    
    retryCount++;
    if (retryCount < maxRetries) {
      console.log(`Navigation not ready, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
      setTimeout(attemptNavigation, delay);
    } else {
      console.error('Navigation failed after maximum retries');
      console.log('Final status - navigationRef.isReady():', navigationRef.isReady());
      console.log('Final status - isNavigationReady:', isNavigationReady);
      
      // As a last resort, try to force navigation
      if (navigationRef.isReady()) {
        console.log('Forcing navigation as last resort');
        navigationRef.navigate(name, params);
      }
    }
  };
  
  attemptNavigation();
}

// Call this when navigation is ready (usually in App.js)
export function onNavigationReady() {
  console.log('Navigation container is ready - setting flag');
  isNavigationReady = true;
  
  // Execute any queued navigation actions
  attemptQueuedNavigation();
}

// Alternative function to check if navigation is truly ready
export function isNavigationReadyNow() {
  return isNavigationReady && navigationRef.isReady();
}

// Reset navigation ready state (useful for testing)
export function resetNavigationState() {
  isNavigationReady = false;
  navigationQueue = [];
}