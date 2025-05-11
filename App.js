// App.js
import React from 'react';
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
import PremiumOnbording from './components/OnboardingScreens/PremiumOnbording'
import WidgetOnboarding from './components/OnboardingScreens/WidgetOnboarding'
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
import ManageSubscription from './components/HomeApp/GeneralSettingsOptions/ManageSubscription'
import Themes from './components/HomeApp/Themes'
import About from './components/HomeApp/GeneralSettingsOptions/About'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          name="PremiumOnbording"
          component={PremiumOnbording}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WidgetOnboarding"
          component={WidgetOnboarding}
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
          name="ManageSubscription"
          component={ManageSubscription}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
