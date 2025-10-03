import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores/authStore';
import { useGoalsStore } from '../../src/stores/goalsStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { goals, fetchGoals } = useGoalsStore();
  const [quickQuestion, setQuickQuestion] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSendQuestion = () => {
    if (quickQuestion.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push('/(tabs)/chat');
    }
  };

  const masterGoal = goals.find(g => g.category === 'career' || g.priority === 'high') || goals[0];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Greeting */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, there
        </Text>
        <Text className="text-base text-gray-500 mb-6">
          Your manifestation journey starts here
        </Text>

        {/* Today's Motivation Card */}
        <View className="bg-primary rounded-3xl p-6 mb-4">
          <Text className="text-white text-lg font-semibold mb-3">❝❝ Today's Motivation</Text>
          <Text className="text-white italic text-base mb-4">
            "Don't be afraid to give up the good to go for the great."
          </Text>
          <Text className="text-white text-right font-medium">— John D. Rockefeller</Text>
          <Text className="text-white/70 text-right text-sm">Business Magnate</Text>
        </View>

        {/* Master Goal Card */}
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/goals')}
          className="bg-white border border-gray-200 rounded-3xl p-6 mb-4"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🎯</Text>
              <Text className="text-xl font-bold text-gray-900">Master Goal</Text>
            </View>
            <Text className="text-2xl text-gray-400">→</Text>
          </View>
          <Text className="text-base text-gray-700">
            {masterGoal?.title || 'I want to build a business and become financially free at age 35'}
          </Text>
        </TouchableOpacity>

        {/* Quick Ask AI Coach */}
        <View className="bg-white border border-gray-200 rounded-3xl p-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">💬</Text>
            <Text className="text-xl font-bold text-gray-900">Quick Ask AI Coach</Text>
          </View>
          
          <View className="bg-gray-50 rounded-2xl p-4 mb-3 flex-row items-center">
            <TextInput
              className="flex-1 text-base text-gray-600"
              placeholder="Ask about goals, habits, mo..."
              placeholderTextColor="#9CA3AF"
              value={quickQuestion}
              onChangeText={setQuickQuestion}
              onSubmitEditing={handleSendQuestion}
            />
            <TouchableOpacity onPress={handleSendQuestion}>
              <Text className="text-2xl">✈️</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-sm text-gray-500 text-center">
            Ask about achieving your goals, building habits, or staying motivated
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
