import { NotificationHandler } from './notificationHandler';
import { createAnonymous } from '../functions/create-anonymous';
import { useStore } from '../store/useStore';

export class NotificationInitializer {
    static async initializeNotifications(navigation) {
        try {
            const {
                userId,
            } = useStore.getState();
            // Set up notification handlers
            await NotificationHandler.setupNotifications();

            // Set navigation reference for handling notification taps
            NotificationHandler.setNavigation(navigation);

            // Get Expo push token
            const token = await NotificationHandler.registerForPushNotificationsAsync();
            if (token) {
                // Get userId from createAnonymous
                const res = await createAnonymous("App");
                if (!res) {
                    console.log('Notification initialization successful');

                }
                await NotificationHandler.sendTokenToBackend(token, userId);
                console.log('Notification initialization successful');
                return { success: true, token, userId };
            } else {
                console.warn('No push token received');
                return { success: false, error: 'No push token received' };
            }
        } catch (error) {
            console.error('Notification initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    static async retryNotifications(navigation) {
        console.log('Retrying notification initialization');
        return this.initializeNotifications(navigation);
    }
}