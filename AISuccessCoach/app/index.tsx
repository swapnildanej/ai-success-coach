import React from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, loading } = useAuthStore();

  console.log('Index - Loading:', loading, 'Authenticated:', isAuthenticated);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ fontSize: 24, color: '#3B82F6', fontWeight: 'bold' }}>AI Success Coach</Text>
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status
  return isAuthenticated ? 
    <Redirect href="/dashboard" /> : 
    <Redirect href="/login" />;
}