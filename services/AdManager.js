/**
 * AdManager wrapper that conditionally exports the real or mock implementation
 * based on whether Google Mobile Ads is available (i.e., not in Expo Go)
 */

let AdManager;

try {
  // Try to import the real AdManager
  // This will fail in Expo Go since google-mobile-ads is not available
  AdManager = require('./AdManager.real.js').default;
  console.log('Using real AdManager');
} catch (error) {
  // Fall back to mock AdManager for Expo Go
  AdManager = require('./AdManager.mock.js').default;
  console.log('Using mock AdManager (Expo Go mode)');
}

export default AdManager;
