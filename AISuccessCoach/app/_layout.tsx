import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useAuthStore } from '../src/stores/authStore';
import { setupNotifications, scheduleGoalReminder, scheduleMoodReminder, scheduleWeeklyReflection } from '../src/lib/notifications';

export default function RootLayout() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication
    checkAuth();
    
    // Initialize notifications (only on mobile platforms)
    if (Platform.OS !== 'web') {
      const initNotifications = async () => {
        try {
          const permitted = await setupNotifications();
          if (permitted) {
            await scheduleGoalReminder();
            await scheduleMoodReminder();
            await scheduleWeeklyReflection();
          }
        } catch (error) {
          console.log('Notification setup failed:', error);
        }
      };
      
      initNotifications();
    }
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}