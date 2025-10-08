import React, { useState } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import ThemesModal, { getShareImageFromTheme } from '../HomeApp/Themes';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';

export default function OnboardingThemeSelection() {
  const navigation = useNavigation();
  const setCurrentTheme = useStore((s) => s.setCurrentTheme);
  const [visible, setVisible] = useState(true);

  const onThemeChange = (theme) => {
    // Persist theme in the store
    setCurrentTheme(theme);
    setVisible(false);
    // Next onboarding screen
    navigation.replace('PremiumOnbording');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <ThemesModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          navigation.replace('PremiumOnbording');
        }}
        currentTheme={null}
        onThemeChange={onThemeChange}
        isPremiumUser={false}
      />
    </SafeAreaView>
  );
}
