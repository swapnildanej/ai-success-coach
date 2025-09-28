import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, loading } = useAuthStore();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>AI Success Coach Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status
  return isAuthenticated ? 
    <Redirect href="/(tabs)" /> : 
    <Redirect href="/(auth)/login" />;
}