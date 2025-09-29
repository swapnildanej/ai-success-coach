import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, clearError } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Sign In Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center' }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>Welcome Back</Text>
        <Text style={{ color: '#6B7280' }}>Sign in to continue your success journey</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Email</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 }}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Password</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 }}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
          paddingVertical: 12,
          borderRadius: 8,
          marginBottom: 24,
          alignItems: 'center'
        }}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Don't have an account? </Text>
        <Link href="/signup" style={{ color: '#3B82F6', fontWeight: '600' }}>
          Sign up
        </Link>
      </View>
    </View>
  );
}