import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdEventType,
  RewardedAdEventType
} from 'react-native-google-mobile-ads';

/**
 * Ad unit configuration object.
 * Uses test IDs in development and real IDs in production.
 * @constant {Object}
 * @property {string} APP_OPEN - App Open ad unit ID
 * @property {string} INTERSTITIAL - Interstitial ad unit ID
 * @property {string} REWARDED - Rewarded ad unit ID
 * @property {string} BANNER - Banner ad unit ID
 */
const AD_UNITS = {
  APP_OPEN: __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-xxxx/xxxx',
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxx/xxxx',
  REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxx/xxxx',
  BANNER: __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxx/xxxx'
};

/**
 * Singleton class for managing Google Mobile Ads in React Native applications.
 * Handles the complete lifecycle of App Open, Interstitial, Rewarded, and Banner ads.
 * 
 * @class AdManager
 * @example
 * // Basic usage:
 * import AdManager from './AdManager';
 * 
 * // Show app open ad when app comes to foreground
 * await AdManager.showAppOpen();
 * 
 * // Show interstitial at natural break points
 * await AdManager.showInterstitial();
 * 
 * // Show rewarded ad with reward handler
 * await AdManager.showRewarded((reward) => {
 *   console.log('Reward earned:', reward);
 * });
 * 
 * // Display banner ad in component
 * function MyComponent() {
 *   return (
 *     <View>
 *       {AdManager.getBannerAd()}
 *     </View>
 *   );
 * }
 */
class AdManager {
  /**
   * Initializes ad instances and sets up event listeners.
   * @constructor
   */
  constructor() {
    this.appOpenAd = AppOpenAd.createForAdRequest(AD_UNITS.APP_OPEN);
    this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL);
    this.rewardedAd = RewardedAd.createForAdRequest(AD_UNITS.REWARDED);
    
    this.isInterstitialLoaded = false;
    this.isRewardedLoaded = false;
    this.isAppOpenLoaded = false;
    
    this.setupEventListeners();
    this.loadAds();
  }

  /**
   * Sets up event listeners for all ad types.
   * @private
   */
  setupEventListeners() {
    // App Open Listeners (uses AdEventType)
    this.appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isAppOpenLoaded = true;
    });
    
    this.appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isAppOpenLoaded = false;
      this.loadAppOpen();
    });

    // Interstitial Listeners (uses AdEventType)
    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isInterstitialLoaded = true;
    });
    
    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isInterstitialLoaded = false;
      this.loadInterstitial();
    });

    // Rewarded Listeners (must use RewardedAdEventType for loaded event)
    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isRewardedLoaded = true;
    });
    
    // Closed event still uses AdEventType
    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isRewardedLoaded = false;
      this.loadRewarded();
    });
  }

  /**
   * Loads all ad types (App Open, Interstitial, Rewarded).
   * Called automatically during initialization.
   * @public
   */
  loadAds() {
    this.loadAppOpen();
    this.loadInterstitial();
    this.loadRewarded();
  }

  // ========================
  // APP OPEN ADS
  // ========================

  /**
   * Loads a new App Open ad.
   * Automatically called after an ad is closed.
   * @public
   */
  loadAppOpen() {
    this.isAppOpenLoaded = false;
    this.appOpenAd.load();
  }

  /**
   * Shows an App Open ad if loaded.
   * @async
   * @public
   * @returns {Promise<boolean>} True if ad was shown, false otherwise
   * @example
   * // When app comes to foreground:
   * await AdManager.showAppOpen();
   */
  async showAppOpen() {
    if (this.isAppOpenLoaded) {
      try {
        await this.appOpenAd.show();
        return true;
      } catch (error) {
        console.error('App Open error:', error);
        return false;
      }
    }
    return false;
  }

  // ========================
  // INTERSTITIAL ADS
  // ========================

  /**
   * Loads a new Interstitial ad.
   * Automatically called after an ad is closed.
   * @public
   */
  loadInterstitial() {
    this.isInterstitialLoaded = false;
    this.interstitialAd.load();
  }

  /**
   * Shows an Interstitial ad if loaded.
   * @async
   * @public
   * @returns {Promise<boolean>} True if ad was shown, false otherwise
   * @example
   * // At natural transition points:
   * await AdManager.showInterstitial();
   */
  async showInterstitial() {
    if (this.isInterstitialLoaded) {
      try {
        await this.interstitialAd.show();
        return true;
      } catch (error) {
        console.error('Interstitial error:', error);
        return false;
      }
    }
    return false;
  }

  // ========================
  // REWARDED ADS
  // ========================

  /**
   * Loads a new Rewarded ad.
   * Automatically called after an ad is closed.
   * @public
   */
  loadRewarded() {
    this.isRewardedLoaded = false;
    this.rewardedAd.load();
  }

  /**
   * Shows a Rewarded ad if loaded.
   * @async
   * @public
   * @param {Function} [onEarnedReward] - Callback when user earns reward
   * @returns {Promise<boolean>} Resolves to true if reward was earned
   * @example
   * // With reward handling:
   * await AdManager.showRewarded((reward) => {
   *   console.log('Earned reward:', reward);
   * });
   */
async showRewarded(onEarnedReward) {
  if (!this.isRewardedLoaded) return false;

  return new Promise((resolve) => {
    const onEarned = (reward) => {
      onEarnedReward?.(reward);
      resolve(true);
    };

    const onClosed = () => {
      this.isRewardedLoaded = false;
      this.loadRewarded();
      resolve(false);
    };

    const onError = (error) => {
      console.error('Rewarded ad error:', error);
      resolve(false);
    };

    // Add one-time listeners
    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, onEarned);
    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, onClosed);
    this.rewardedAd.addAdEventListener(AdEventType.ERROR, onError);

    this.rewardedAd.show()
      .catch((error) => {
        console.error('Rewarded ad show error:', error);
        resolve(false);
      });
  });
}
  // ========================
  // BANNER ADS
  // ========================

  /**
   * Creates a Banner Ad component.
   * @public
   * @param {BannerAdSize} [size=BannerAdSize.BANNER] - Ad size from BannerAdSize enum
   * @param {Function} [onError] - Error callback
   * @returns {JSX.Element} BannerAd component
   * @example
   * // In component render:
   * {AdManager.getBannerAd(BannerAdSize.FULL_BANNER, (error) => {
   *   console.error('Banner load failed:', error);
   * })}
   */
  getBannerAd(size = BannerAdSize.BANNER, onError) {
    return (
      <BannerAd
        unitId={AD_UNITS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={onError || ((error) => console.error('Banner error:', error))}
      />
    );
  }
}

/**
 * Singleton instance of AdManager.
 * @type {AdManager}
 */
export default new AdManager();