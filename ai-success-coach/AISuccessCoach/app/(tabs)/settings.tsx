import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">Settings</Text>
        <Text className="text-primary-100">Manage your account and preferences</Text>
      </View>

      <View className="px-6 pt-4">
        {/* Profile Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Profile</Text>
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-3">
              <Text className="text-2xl text-primary font-bold">
                {user?.email?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900">{user?.email || 'User'}</Text>
            <Text className="text-sm text-gray-600">Member since {new Date().getFullYear()}</Text>
          </View>
          
          <TouchableOpacity className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-700 font-medium">Edit Profile</Text>
            <Text className="text-sm text-gray-500 mt-1">Update your personal information</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">App Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View>
              <Text className="text-gray-900 font-medium">Notifications</Text>
              <Text className="text-sm text-gray-500">Push notifications and reminders</Text>
            </View>
            <Text className="text-primary">Configure</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View>
              <Text className="text-gray-900 font-medium">Voice & Speech</Text>
              <Text className="text-sm text-gray-500">Voice coach settings and preferences</Text>
            </View>
            <Text className="text-primary">Configure</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View>
              <Text className="text-gray-900 font-medium">Data Export</Text>
              <Text className="text-sm text-gray-500">Download your goals and mood data</Text>
            </View>
            <Text className="text-primary">Export</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View>
              <Text className="text-gray-900 font-medium">Privacy Settings</Text>
              <Text className="text-sm text-gray-500">Manage your data and privacy</Text>
            </View>
            <Text className="text-primary">Configure</Text>
          </TouchableOpacity>
        </View>

        {/* Support & Info */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Support & Info</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-medium">Help & FAQ</Text>
            <Text className="text-primary">View</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-medium">Contact Support</Text>
            <Text className="text-primary">Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-medium">Privacy Policy</Text>
            <Text className="text-primary">View</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <Text className="text-gray-900 font-medium">Terms of Service</Text>
            <Text className="text-primary">View</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">App Information</Text>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Version</Text>
            <Text className="text-gray-900">1.0.0</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Build</Text>
            <Text className="text-gray-900">2025.01</Text>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity 
          className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          onPress={handleSignOut}
        >
          <Text className="text-red-600 font-semibold text-center text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}