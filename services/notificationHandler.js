import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export class NotificationHandler {
  static navigation = null;

  static setNavigation(nav) {
    this.navigation = nav;
    console.log('Navigation reference set');
  }

  static async registerForPushNotificationsAsync() {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
      }
      if (Platform.OS === 'android') {
        console.log('Setting Android notification channel');
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      console.log('Checking notification permissions');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        console.log('Requesting notification permissions');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token: Permission not granted');
        return null;
      }

      console.log('Generating Expo push token');
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: '11d03376-e061-44a6-b8f1-7723864b8055',
      })).data;
      console.log('Expo Push Token (Copy this):', token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  static async setupNotifications() {
    try {
      console.log('Setting up notification handlers');
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      Notifications.addNotificationReceivedListener(notification => {
        console.log('Full notification:', JSON.stringify(notification, null, 2));
      });

      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
        console.log('Notification response data:', response.notification.request.content.data);
        const data = response.notification.request.content.data;

        if (data?.click_action === 'OPEN_QUOTE_DETAIL') {
          // // Use the retry mechanism instead of direct navigation
          this.navigation.navigate('QuotesNotificationA', {
            quote: {
              text: data.quote.text,
              author: data.quote.author,
              source: data.quote.source || 'Unknown',
            }
          });
        }
      });
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

  static async sendTokenToBackend(token, userId) {
    try {
      console.log('Sending token to backend:', { userId, token });
      const response = await fetch('https://daily-spark-be.vercel.app/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token }),
      });
      const result = await response.json();
      console.log('Token sent to backend:', result);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }
}