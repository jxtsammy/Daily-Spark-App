/**
 * Mock AdManager for Expo Go compatibility
 * Provides stub implementations of all AdManager methods
 * Used when Google Mobile Ads is not available
 */
class MockAdManager {
  constructor() {
    console.log('Using Mock AdManager (Expo Go mode - ads disabled)');
    this.isInterstitialLoaded = false;
    this.isRewardedLoaded = false;
    this.isAppOpenLoaded = false;
  }

  setupEventListeners() {
    // No-op
  }

  loadAds() {
    console.log('Mock: loadAds called (no-op in Expo Go)');
  }

  loadAppOpen() {
    console.log('Mock: loadAppOpen called (no-op in Expo Go)');
  }

  async showAppOpen() {
    console.log('Mock: showAppOpen called (no-op in Expo Go)');
    return false;
  }

  loadInterstitial() {
    console.log('Mock: loadInterstitial called (no-op in Expo Go)');
  }

  async showInterstitial() {
    console.log('Mock: showInterstitial called (no-op in Expo Go)');
    return false;
  }

  loadRewarded() {
    console.log('Mock: loadRewarded called (no-op in Expo Go)');
  }

  async showRewarded(onEarnedReward) {
    console.log('Mock: showRewarded called (no-op in Expo Go)');
    return false;
  }

  getBannerAd(size, onError) {
    console.log('Mock: getBannerAd called (no-op in Expo Go)');
    return null;
  }
}

export default new MockAdManager();
