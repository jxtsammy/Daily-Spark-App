// import React, { useEffect, useState } from 'react';
// import { 
//   AppOpenAd, 
//   InterstitialAd, 
//   RewardedAd, 
//   BannerAd, 
//   TestIds,
//   BannerAdSize,
//   AdEventType
// } from 'react-native-google-mobile-ads';

// // ========================
// // AD CONFIGURATION
// // ========================
// const AD_CONFIG = {
//   // Test IDs for development, real IDs for production
//   APP_OPEN: __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-xxxx/xxxx',
//   INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxx/xxxx',
//   REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxx/xxxx',
//   BANNER: __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxx/xxxx',
  
//   // Global ad load tracking
//   isInterstitialLoaded: false,
//   isRewardedLoaded: false,
  
//   // Ad instances
//   interstitialAd: null,
//   rewardedAd: null
// };

// // ========================
// // INITIALIZE ADS
// // ========================
// export const initializeAds = () => {
//   // Initialize ad instances
//   AD_CONFIG.interstitialAd = InterstitialAd.createForAdRequest(AD_CONFIG.INTERSTITIAL, {
//     requestNonPersonalizedAdsOnly: true,
//   });
  
//   AD_CONFIG.rewardedAd = RewardedAd.createForAdRequest(AD_CONFIG.REWARDED, {
//     requestNonPersonalizedAdsOnly: true,
//   });
  
//   // App Open Ad (auto-loads)
//   AppOpenAd.createForAdRequest(AD_CONFIG.APP_OPEN);
  
//   // Set up event listeners
//   AD_CONFIG.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//     AD_CONFIG.isInterstitialLoaded = true;
//   });
  
//   AD_CONFIG.rewardedAd.addAdEventListener(RewardedAd.LOADED, () => {
//     AD_CONFIG.isRewardedLoaded = true;
//   });
  
//   // Preload ads
//   loadInterstitial();
//   loadRewarded();
// };

// // ========================
// // AD FUNCTIONS
// // ========================
// export const loadInterstitial = () => {
//   AD_CONFIG.interstitialAd.load();
// };

// export const showInterstitial = async () => {
//   if (AD_CONFIG.isInterstitialLoaded) {
//     try {
//       await AD_CONFIG.interstitialAd.show();
//       AD_CONFIG.isInterstitialLoaded = false;
//       loadInterstitial(); // Preload next ad
//       return true;
//     } catch (error) {
//       console.error('Error showing interstitial:', error);
//       return false;
//     }
//   }
//   console.log('Interstitial not loaded yet');
//   loadInterstitial();
//   return false;
// };

// export const loadRewarded = () => {
//   AD_CONFIG.rewardedAd.load();
// };

// export const showRewarded = async () => {
//   if (AD_CONFIG.isRewardedLoaded) {
//     try {
//       await AD_CONFIG.rewardedAd.show();
//       AD_CONFIG.isRewardedLoaded = false;
//       loadRewarded(); // Preload next ad
//       return true;
//     } catch (error) {
//       console.error('Error showing rewarded:', error);
//       return false;
//     }
//   }
//   console.log('Rewarded not loaded yet');
//   loadRewarded();
//   return false;
// };

// // ========================
// // REUSABLE COMPONENTS
// // ========================
// export const AdBanner = ({ size = BannerAdSize.BANNER, onError }) => (
//   <BannerAd
//     unitId={AD_CONFIG.BANNER}
//     size={size}
//     onAdFailedToLoad={onError || ((error) => console.error('Banner error:', error))}
//   />
// );

// export const InterstitialTrigger = ({ trigger, onShow, onFail, children }) => {
//   const [internalTrigger, setInternalTrigger] = useState(false);
  
//   useEffect(() => {
//     const handleAd = async () => {
//       const shown = await showInterstitial();
//       if (shown && onShow) onShow();
//       if (!shown && onFail) onFail();
//     };
    
//     if (trigger || internalTrigger) {
//       handleAd();
//     }
//   }, [trigger, internalTrigger]);
  
//   return children 
//     ? React.cloneElement(children, { onPress: () => setInternalTrigger(true) })
//     : null;
// };

// export const RewardedTrigger = ({ trigger, onShow, onFail, children }) => {
//   const [internalTrigger, setInternalTrigger] = useState(false);
  
//   useEffect(() => {
//     const handleAd = async () => {
//       const shown = await showRewarded();
//       if (shown && onShow) onShow();
//       if (!shown && onFail) onFail();
//     };
    
//     if (trigger || internalTrigger) {
//       handleAd();
//     }
//   }, [trigger, internalTrigger]);
  
//   return children 
//     ? React.cloneElement(children, { onPress: () => setInternalTrigger(true) })
//     : null;
// };

// // Initialize ads when this module loads
// initializeAds();