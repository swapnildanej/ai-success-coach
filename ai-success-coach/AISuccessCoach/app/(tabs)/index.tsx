import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { useGoalsStore } from '../../src/stores/goalsStore';
import { useMoodStore } from '../../src/stores/moodStore';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { moodEntries, getMoodTrends } = useMoodStore();

  useEffect(() => {
    fetchGoals();
  }, []);

  const moodTrends = getMoodTrends(7);
  const completedGoals = goals.filter(goal => goal.completed).length;
  const activeGoals = goals.filter(goal => !goal.completed).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-8">
        <Text className="text-white text-2xl font-bold mb-2">
          {getGreeting()}, {user?.email?.split('@')[0] || 'Coach'}!
        </Text>
        <Text className="text-primary-100">Ready to achieve your goals today?</Text>
      </View>

      <View className="px-6 -mt-4">
        {/* Quick Stats */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Your Progress</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{activeGoals}</Text>
              <Text className="text-sm text-gray-600">Active Goals</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-success">{completedGoals}</Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-500">{moodTrends.averageMood.toFixed(1)}</Text>
              <Text className="text-sm text-gray-600">Avg Mood</Text>
            </View>
          </View>
        </View>

        {/* Recent Goals */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Goals</Text>
          {goals.slice(0, 3).length > 0 ? (
            goals.slice(0, 3).map((goal) => (
              <View key={goal.id} className="flex-row items-center mb-3 last:mb-0">
                <View className={`w-3 h-3 rounded-full mr-3 ${goal.completed ? 'bg-success' : 'bg-primary'}`} />
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{goal.title}</Text>
                  <Text className="text-sm text-gray-600">{goal.progress}% complete</Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 italic">No goals yet. Let's create your first goal!</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-primary-50 p-4 rounded-lg">
              <Text className="text-primary font-semibold">Start AI Chat Session</Text>
              <Text className="text-sm text-gray-600 mt-1">Get personalized coaching advice</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-success-50 p-4 rounded-lg">
              <Text className="text-success-700 font-semibold">Log Your Mood</Text>
              <Text className="text-sm text-gray-600 mt-1">Track how you're feeling today</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood Trend */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Weekly Mood Trend</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">{moodTrends.averageMood.toFixed(1)}/10</Text>
              <Text className="text-sm text-gray-600">Average Mood</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${
              moodTrends.trend === 'up' ? 'bg-success-100' :
              moodTrends.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-sm font-medium ${
                moodTrends.trend === 'up' ? 'text-success-700' :
                moodTrends.trend === 'down' ? 'text-red-700' : 'text-gray-700'
              }`}>
                {moodTrends.trend === 'up' ? '↗️ Improving' :
                 moodTrends.trend === 'down' ? '↘️ Needs attention' : '➡️ Stable'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}