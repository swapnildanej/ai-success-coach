import { View, Text } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => null, // TODO: Add icons
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Voice Coach',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}