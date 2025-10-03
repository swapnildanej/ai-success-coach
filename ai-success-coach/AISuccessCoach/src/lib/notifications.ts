import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }
  return true;
};

// Daily reminder notifications
export const scheduleGoalReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to check your goals! 🎯',
      body: 'Review your progress and update your goals for the day.',
      data: { type: 'goal_reminder' },
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    } as any,
  });
};

export const scheduleMoodReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'How are you feeling? 😊',
      body: 'Take a moment to log your mood and energy level.',
      data: { type: 'mood_reminder' },
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    } as any,
  });
};

export const scheduleWeeklyReflection = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Weekly Reflection Time 📝',
      body: 'Review your progress and set intentions for the coming week.',
      data: { type: 'weekly_reflection' },
    },
    trigger: {
      weekday: 1, // Sunday
      hour: 18,
      minute: 0,
      repeats: true,
    } as any,
  });
};

// Haptic feedback functions
export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const hapticError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

export const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  const impactType = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  }[style];
  
  Haptics.impactAsync(impactType);
};

export const hapticSelection = () => {
  Haptics.selectionAsync();
};

// Goal achievement celebration
export const celebrateGoalCompletion = async (goalTitle: string) => {
  if (Platform.OS === 'web') return;
  
  hapticSuccess();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Congratulations!',
      body: `You completed "${goalTitle}"! Keep up the great work!`,
      data: { type: 'goal_completed' },
    },
    trigger: null, // Show immediately
  });
};

// Mood streak notification
export const celebrateMoodStreak = async (days: number) => {
  if (Platform.OS === 'web') return;
  
  hapticSuccess();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${days} Day Streak! 🔥`,
      body: `You've been consistent with mood tracking for ${days} days!`,
      data: { type: 'mood_streak' },
    },
    trigger: null, // Show immediately
  });
};