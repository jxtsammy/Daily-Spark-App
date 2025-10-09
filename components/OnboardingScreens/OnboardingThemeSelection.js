import React, { useState } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import ThemesModal, { getShareImageFromTheme } from '../HomeApp/Themes';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';

export default function OnboardingThemeSelection() {
  const navigation = useNavigation();
  const setCurrentTheme = useStore((s) => s.setCurrentTheme);
  const setThemeSelected = useStore((s) => s.setThemeSelected);
  const [visible, setVisible] = useState(true);

  const onThemeChange = (theme) => {
    // Persist theme in the store
    setCurrentTheme(theme);
    // mark theme as selected so we don't show selection again
    setThemeSelected(true);
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
          // mark that user saw/closed the theme selector (don't show again)
          setThemeSelected(true);
          setVisible(false);
          navigation.replace('PremiumOnbording');
        }}
        currentTheme={null}
        onThemeChange={onThemeChange}
      />
    </SafeAreaView>
  );
}
