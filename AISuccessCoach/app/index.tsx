import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, loading } = useAuthStore();

  // Show loading state while checking authentication
  if (loading) {
    return null; // Or a loading screen
  }

  // Redirect based on authentication status
  return isAuthenticated ? 
    <Redirect href="/(tabs)" /> : 
    <Redirect href="/(auth)/login" />;
}