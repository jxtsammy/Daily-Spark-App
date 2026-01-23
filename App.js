import React, { useState, useEffect,useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1 from './components/OnboardingScreens/OnboardingScreens1'
import Onboarding2 from './components/OnboardingScreens/OnboardingScreens2'
import Onboarding3 from './components/OnboardingScreens/OnboardingScreens3'
import Onboarding4 from './components/OnboardingScreens/OnboardingScreens4'
import Onboarding5 from './components/OnboardingScreens/OnboardingScreens5'
import Onboarding6 from './components/OnboardingScreens/OnboardingScreens6'
import Onboarding7 from './components/OnboardingScreens/OnboardingScreens7'
import Onboarding8 from './components/OnboardingScreens/OnboardingScreens8'
import Onboarding9 from './components/OnboardingScreens/OnboardingScreens9'
import Onboarding10 from './components/OnboardingScreens/OnboardingScreens10'
import Onboarding11 from './components/OnboardingScreens/OnboardingScreens11'
import Onboarding12 from './components/OnboardingScreens/OnboardingScreens12'
import Onboarding13 from './components/OnboardingScreens/OnboardingScreens13'
import Onboarding14 from './components/OnboardingScreens/OnboardingScreens14'
import Onboarding15 from './components/OnboardingScreens/OnboardingScreens15'
import Onboarding16 from './components/OnboardingScreens/OnboardingScreens16'
import OnboardingThemeSelection from './components/OnboardingScreens/OnboardingThemeSelection'
import Home from './components/HomeApp/Home'
import Settings from './components/HomeApp/SettingScreen'
import Topics from './components/HomeApp/TopicFollowed'
import Reminders from './components/HomeApp/Reminders'
import Widgets from './components/HomeApp/WidgetSettings'
import GeneralSettings from './components/HomeApp/GeneralSettings'
import ContentPrefrencesSettings from './components/HomeApp/GeneralSettingsOptions/ContentPrefrences'
import GenderIdentitySettings from './components/HomeApp/GeneralSettingsOptions/GenderIdentity'
import EditName from './components/HomeApp/GeneralSettingsOptions/EditName'
import LanguageSettings from './components/HomeApp/GeneralSettingsOptions/Language'
import StreakSettings from './components/HomeApp/GeneralSettingsOptions/StreakSettings'
import SignIn from './components/HomeApp/GeneralSettingsOptions/SignIn'
import Themes from './components/HomeApp/Themes'
import About from './components/HomeApp/GeneralSettingsOptions/About'
import DeleteAccount from './components/HomeApp/GeneralSettingsOptions/DeleteAccount'
import ManageData from './components/HomeApp/GeneralSettingsOptions/ManageData'
import PrivacyPolicy from './components/HomeApp/GeneralSettingsOptions/PrivacyPolicy'
import AddQuotes from './components/HomeApp/ExporeOptions/AddQuotes'
import Favorites from './components/HomeApp/ExporeOptions/Favorites'
import RecentQuotes from './components/HomeApp/ExporeOptions/RecentQuotes'
import MyCollections from './components/HomeApp/ExporeOptions/MyCollections'
import QuotesNotificationA from './components/HomeApp/Notifications/QuotesNotificationA';
import PaymentVerification from './components/HomeApp/PaymentVerification';
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import {useStore} from './store/useStore';

// Conditionally import Google Mobile Ads only when not in Expo Go
let mobileAds = null;
try {
  mobileAds = require('react-native-google-mobile-ads').default;
} catch (e) {
  console.log('Google Mobile Ads not available (Expo Go mode)');
}

// import {NotificationInitializer} from './services/notoficationInitializer'
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['dailyspark://'],
  config: {
    screens: {
      PaymentVerification: 'PaymentVerification',
      // add other routes if you want custom paths
    },
  },
};

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
 const navigationRef = useRef(null);
  useEffect(() => {
    async function prepare() {
      try {
        console.log('Starting app initialization...');
        
        // Wait for store to hydrate with timeout fallback
        await new Promise((resolve) => {
          let resolved = false;
          
          // Set a timeout in case hydration takes too long
          const timeout = setTimeout(() => {
            if (!resolved) {
              console.log('Store hydration timeout - continuing anyway');
              resolved = true;
              resolve();
            }
          }, 2000);
          
          // Check if already hydrated
          if (useStore.persist.hasHydrated?.()) {
            console.log('Store already hydrated');
            clearTimeout(timeout);
            resolved = true;
            resolve();
            return;
          }
          
          // Wait for hydration to complete
          const unsub = useStore.persist.onFinishHydration(() => {
            console.log('Store hydration completed');
            if (!resolved) {
              clearTimeout(timeout);
              resolved = true;
              unsub(); // Cleanup subscription
              resolve();
            }
          });
        });

        console.log('Store hydration complete, initializing ads...');

        // Initialize Google Mobile Ads only if available (not in Expo Go)
        if (mobileAds) {
          mobileAds()
            .initialize()
            .then(adapterStatuses => {
              console.log('Adapter Statuses: ', adapterStatuses);
            });
        }

        // Initialize notifications
        // await NotificationInitializer.initializeNotifications(navigationRef.current);

      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        // Tell the application to render
        console.log('App ready, hiding splash screen');
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);





  if (!appIsReady) {
    return null; // Splash screen will remain visible during this time
  }







  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Onboarding1">
        <Stack.Screen
          name="Onboarding1"
          component={Onboarding1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding2"
          component={Onboarding2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding3"
          component={Onboarding3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding4"
          component={Onboarding4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding5"
          component={Onboarding5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding6"
          component={Onboarding6}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding7"
          component={Onboarding7}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding8"
          component={Onboarding8}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding9"
          component={Onboarding9}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding10"
          component={Onboarding10}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding11"
          component={Onboarding11}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding12"
          component={Onboarding12}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding13"
          component={Onboarding13}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding14"
          component={Onboarding14}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding15"
          component={Onboarding15}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding16"
          component={Onboarding16}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnboardingThemeSelection"
          component={OnboardingThemeSelection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Topics"
          component={Topics}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reminders"
          component={Reminders}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Widgets"
          component={Widgets}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GeneralSettings"
          component={GeneralSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContentPrefrencesSettings"
          component={ContentPrefrencesSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GenderIdentitySettings"
          component={GenderIdentitySettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditName"
          component={EditName}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LanguageSettings"
          component={LanguageSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StreakSettings"
          component={StreakSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentVerification"
          component={PaymentVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Themes"
          component={Themes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManageData"
          component={ManageData}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddQuotes"
          component={AddQuotes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecentQuotes"
          component={RecentQuotes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuotesNotificationA"
          component={QuotesNotificationA}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyCollections"
          component={MyCollections}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
