
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Configuration
const AD_UNIT_ID = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : 'ca-app-pub-4921191810059647~9876543210'; // Your production ID

/**
 * InterstitialManager handles the loading, displaying, and lifecycle management
 * of interstitial ads using react-native-google-mobile-ads.
 *
 * ## How it works
 * - Initializes an interstitial ad instance with the appropriate ad unit ID (test or production).
 * - Listens for ad events to manage the loaded state and auto-reloads after an ad is closed.
 * - Provides methods to load and show ads, handling errors and reloading as needed.
 * - Offers a helper method to show an ad before navigating to a new screen.
 *
 * ## Usage
 * Import the singleton instance and use its methods:
 *
 * ```javascript
 * import InterstitialManager from './services/Ads/InterstitialManager';
 *
 * // To show an ad
 * await InterstitialManager.showAd();
 *
 * // To show an ad and then navigate
 * await InterstitialManager.showAdWithNavigation(navigation, 'TargetScreen', { param1: 'value' });
 * ```
 *
 * @class InterstitialManager
 * @classdesc Singleton class for managing interstitial ads in a React Native app.
 *
 * @method initialize
 * Initializes the interstitial ad instance and sets up event listeners.
 *
 * @method loadAd
 * Loads a new interstitial ad and resets the loaded state.
 *
 * @method showAd
 * @async
 * Attempts to show the interstitial ad if loaded. Reloads on error.
 * @returns {Promise<boolean>} Resolves to true if the ad was shown, false otherwise.
 *
 * @method showAdWithNavigation
 * @async
 * Shows an ad and then navigates to the specified route, regardless of ad success.
 * @param {object} navigation - React Navigation object.
 * @param {string} routeName - Name of the route to navigate to.
 * @param {object} [params={}] - Optional navigation parameters.
 *
 * @example
 * // Show an ad before navigating
 * await InterstitialManager.showAdWithNavigation(navigation, 'HomeScreen');
 */
class InterstitialManager {
  constructor() {
    this.ad = null;
    this.isLoaded = false;
    this.initialize();
  }

  initialize() {
    this.ad = InterstitialAd.createForAdRequest(AD_UNIT_ID);
    
    // Event listeners
    this.ad.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true;
    });
    
    this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      this.isLoaded = false;
      this.loadAd(); // Auto-reload after close
    });

    this.loadAd();
  }

  loadAd() {
    this.isLoaded = false;
    this.ad.load();
  }

  async showAd() {
    if (this.isLoaded) {
      try {
        await this.ad.show();
        return true;
      } catch (error) {
        console.error('Error showing ad:', error);
        this.loadAd(); // Try to reload if error
        return false;
      }
    }
    return false;
  }

  // Helper to show ad with navigation
  async showAdWithNavigation(navigation, routeName, params = {}) {
    const adShown = await this.showAd();
    if (adShown) {
      navigation.navigate(routeName, params);
    } else {
      navigation.navigate(routeName, params);
    }
  }
}

// Export a singleton instance
export default new InterstitialManager();