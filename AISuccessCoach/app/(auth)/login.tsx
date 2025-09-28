import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

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
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-gray-600">Sign in to continue your success journey</Text>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}