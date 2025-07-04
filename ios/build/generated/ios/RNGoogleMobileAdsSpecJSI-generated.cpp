/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "RNGoogleMobileAdsSpecJSI.h"

namespace facebook::react {

static jsi::Value __hostFunction_NativeAppOpenModuleCxxSpecJSI_appOpenLoad(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeAppOpenModuleCxxSpecJSI *>(&turboModule)->appOpenLoad(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeAppOpenModuleCxxSpecJSI_appOpenShow(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeAppOpenModuleCxxSpecJSI *>(&turboModule)->appOpenShow(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asObject(rt))
  );
}

NativeAppOpenModuleCxxSpecJSI::NativeAppOpenModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsAppOpenModule", jsInvoker) {
  methodMap_["appOpenLoad"] = MethodMetadata {3, __hostFunction_NativeAppOpenModuleCxxSpecJSI_appOpenLoad};
  methodMap_["appOpenShow"] = MethodMetadata {3, __hostFunction_NativeAppOpenModuleCxxSpecJSI_appOpenShow};
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_requestInfoUpdate(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->requestInfoUpdate(
    rt,
    count <= 0 || args[0].isUndefined() ? std::nullopt : std::make_optional(args[0].asObject(rt))
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_showForm(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->showForm(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_showPrivacyOptionsForm(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->showPrivacyOptionsForm(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_loadAndShowConsentFormIfRequired(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->loadAndShowConsentFormIfRequired(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_getConsentInfo(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->getConsentInfo(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_getTCString(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->getTCString(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_getGdprApplies(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->getGdprApplies(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_getPurposeConsents(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->getPurposeConsents(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_getPurposeLegitimateInterests(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->getPurposeLegitimateInterests(
    rt
  );
}
static jsi::Value __hostFunction_NativeConsentModuleCxxSpecJSI_reset(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeConsentModuleCxxSpecJSI *>(&turboModule)->reset(
    rt
  );
  return jsi::Value::undefined();
}

NativeConsentModuleCxxSpecJSI::NativeConsentModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsConsentModule", jsInvoker) {
  methodMap_["requestInfoUpdate"] = MethodMetadata {1, __hostFunction_NativeConsentModuleCxxSpecJSI_requestInfoUpdate};
  methodMap_["showForm"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_showForm};
  methodMap_["showPrivacyOptionsForm"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_showPrivacyOptionsForm};
  methodMap_["loadAndShowConsentFormIfRequired"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_loadAndShowConsentFormIfRequired};
  methodMap_["getConsentInfo"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_getConsentInfo};
  methodMap_["getTCString"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_getTCString};
  methodMap_["getGdprApplies"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_getGdprApplies};
  methodMap_["getPurposeConsents"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_getPurposeConsents};
  methodMap_["getPurposeLegitimateInterests"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_getPurposeLegitimateInterests};
  methodMap_["reset"] = MethodMetadata {0, __hostFunction_NativeConsentModuleCxxSpecJSI_reset};
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_getConstants(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->getConstants(
    rt
  );
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_initialize(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->initialize(
    rt
  );
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setRequestConfiguration(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->setRequestConfiguration(
    rt,
    count <= 0 || args[0].isUndefined() ? std::nullopt : std::make_optional(args[0].asObject(rt))
  );
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_openAdInspector(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->openAdInspector(
    rt
  );
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_openDebugMenu(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->openDebugMenu(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setAppVolume(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->setAppVolume(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber()
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setAppMuted(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeGoogleMobileAdsModuleCxxSpecJSI *>(&turboModule)->setAppMuted(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asBool()
  );
  return jsi::Value::undefined();
}

NativeGoogleMobileAdsModuleCxxSpecJSI::NativeGoogleMobileAdsModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsModule", jsInvoker) {
  methodMap_["getConstants"] = MethodMetadata {0, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_getConstants};
  methodMap_["initialize"] = MethodMetadata {0, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_initialize};
  methodMap_["setRequestConfiguration"] = MethodMetadata {1, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setRequestConfiguration};
  methodMap_["openAdInspector"] = MethodMetadata {0, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_openAdInspector};
  methodMap_["openDebugMenu"] = MethodMetadata {1, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_openDebugMenu};
  methodMap_["setAppVolume"] = MethodMetadata {1, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setAppVolume};
  methodMap_["setAppMuted"] = MethodMetadata {1, __hostFunction_NativeGoogleMobileAdsModuleCxxSpecJSI_setAppMuted};
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsNativeModuleCxxSpecJSI_load(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeGoogleMobileAdsNativeModuleCxxSpecJSI *>(&turboModule)->load(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asObject(rt)
  );
}
static jsi::Value __hostFunction_NativeGoogleMobileAdsNativeModuleCxxSpecJSI_destroy(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeGoogleMobileAdsNativeModuleCxxSpecJSI *>(&turboModule)->destroy(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asString(rt)
  );
  return jsi::Value::undefined();
}

NativeGoogleMobileAdsNativeModuleCxxSpecJSI::NativeGoogleMobileAdsNativeModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsNativeModule", jsInvoker) {
  methodMap_["load"] = MethodMetadata {2, __hostFunction_NativeGoogleMobileAdsNativeModuleCxxSpecJSI_load};
  methodMap_["destroy"] = MethodMetadata {1, __hostFunction_NativeGoogleMobileAdsNativeModuleCxxSpecJSI_destroy};
}
static jsi::Value __hostFunction_NativeInterstitialModuleCxxSpecJSI_interstitialLoad(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeInterstitialModuleCxxSpecJSI *>(&turboModule)->interstitialLoad(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeInterstitialModuleCxxSpecJSI_interstitialShow(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeInterstitialModuleCxxSpecJSI *>(&turboModule)->interstitialShow(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asObject(rt))
  );
}

NativeInterstitialModuleCxxSpecJSI::NativeInterstitialModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsInterstitialModule", jsInvoker) {
  methodMap_["interstitialLoad"] = MethodMetadata {3, __hostFunction_NativeInterstitialModuleCxxSpecJSI_interstitialLoad};
  methodMap_["interstitialShow"] = MethodMetadata {3, __hostFunction_NativeInterstitialModuleCxxSpecJSI_interstitialShow};
}
static jsi::Value __hostFunction_NativeRewardedInterstitialModuleCxxSpecJSI_rewardedInterstitialLoad(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRewardedInterstitialModuleCxxSpecJSI *>(&turboModule)->rewardedInterstitialLoad(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRewardedInterstitialModuleCxxSpecJSI_rewardedInterstitialShow(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRewardedInterstitialModuleCxxSpecJSI *>(&turboModule)->rewardedInterstitialShow(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asObject(rt))
  );
}

NativeRewardedInterstitialModuleCxxSpecJSI::NativeRewardedInterstitialModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsRewardedInterstitialModule", jsInvoker) {
  methodMap_["rewardedInterstitialLoad"] = MethodMetadata {3, __hostFunction_NativeRewardedInterstitialModuleCxxSpecJSI_rewardedInterstitialLoad};
  methodMap_["rewardedInterstitialShow"] = MethodMetadata {3, __hostFunction_NativeRewardedInterstitialModuleCxxSpecJSI_rewardedInterstitialShow};
}
static jsi::Value __hostFunction_NativeRewardedModuleCxxSpecJSI_rewardedLoad(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeRewardedModuleCxxSpecJSI *>(&turboModule)->rewardedLoad(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 ? throw jsi::JSError(rt, "Expected argument in position 2 to be passed") : args[2].asObject(rt)
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeRewardedModuleCxxSpecJSI_rewardedShow(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRewardedModuleCxxSpecJSI *>(&turboModule)->rewardedShow(
    rt,
    count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed") : args[0].asNumber(),
    count <= 1 ? throw jsi::JSError(rt, "Expected argument in position 1 to be passed") : args[1].asString(rt),
    count <= 2 || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asObject(rt))
  );
}

NativeRewardedModuleCxxSpecJSI::NativeRewardedModuleCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNGoogleMobileAdsRewardedModule", jsInvoker) {
  methodMap_["rewardedLoad"] = MethodMetadata {3, __hostFunction_NativeRewardedModuleCxxSpecJSI_rewardedLoad};
  methodMap_["rewardedShow"] = MethodMetadata {3, __hostFunction_NativeRewardedModuleCxxSpecJSI_rewardedShow};
}


} // namespace facebook::react
