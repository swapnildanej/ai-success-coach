import { View, Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}