import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, loading } = useAuthStore();

  // Wait for auth check to complete before redirecting
  if (loading) {
    return null;
  }

  // Redirect based on authentication status
  return isAuthenticated ? 
    <Redirect href="/(tabs)" /> : 
    <Redirect href="/(auth)/login" />;
}