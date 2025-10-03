import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, loading, error, clearError } = useAuthStore();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await signUp(email, password);
      Alert.alert('Success', 'Please check your email to verify your account');
    } catch (error) {
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'Unknown error');
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
        <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
        <Text className="text-gray-600">Start your journey to success today</Text>
      </View>

      <View className="mb-4">
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

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-semibold">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}