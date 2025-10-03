import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores/authStore';
import { useGoalsStore } from '../../src/stores/goalsStore';
import { useMoodStore } from '../../src/stores/moodStore';

export default function DashboardScreen() {
  const router = useRouter();
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

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action === 'chat') {
      router.push('/(tabs)/chat');
    } else if (action === 'mood') {
      router.push('/(tabs)/mood');
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Hero Section with Gradient */}
      <View className="rounded-b-3xl overflow-hidden">
        <LinearGradient
          colors={['#3B82F6', '#2563EB', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 80 }}
        >
          <View className="mb-6">
            <Text className="text-white text-3xl font-bold mb-2">
              {getGreeting()}! 👋
            </Text>
            <Text className="text-white opacity-90 text-base">
              {user?.email?.split('@')[0] || 'Welcome'}
            </Text>
          </View>

          {/* Quick Stats Cards */}
          <View className="flex-row justify-between -mb-12">
            <View className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex-1 mr-2">
              <Text className="text-white text-3xl font-bold">{activeGoals}</Text>
              <Text className="text-white/80 text-sm mt-1">Active Goals</Text>
            </View>
            <View className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex-1 mx-1">
              <Text className="text-white text-3xl font-bold">{completedGoals}</Text>
              <Text className="text-white/80 text-sm mt-1">Completed</Text>
            </View>
            <View className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex-1 ml-2">
              <Text className="text-white text-3xl font-bold">{moodTrends.averageMood.toFixed(1)}</Text>
              <Text className="text-white/80 text-sm mt-1">Avg Mood</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="px-6 mt-8">
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">Quick Actions</Text>
          <View className="space-y-3">
            <TouchableOpacity 
              onPress={() => handleQuickAction('chat')}
              activeOpacity={0.8}
              className="active:scale-95"
            >
              <View className="rounded-2xl shadow-card overflow-hidden">
                <LinearGradient
                  colors={['#3B82F6', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20 }}
                >
                  <Text className="text-white text-lg font-semibold">💬 Start AI Chat Session</Text>
                  <Text className="text-white/80 text-sm mt-1">Get personalized coaching advice</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleQuickAction('mood')}
              activeOpacity={0.8}
              className="active:scale-95 mt-3"
            >
              <View className="rounded-2xl shadow-card overflow-hidden">
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20 }}
                >
                  <Text className="text-white text-lg font-semibold">😊 Log Your Mood</Text>
                  <Text className="text-white/80 text-sm mt-1">Track how you're feeling today</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Goals */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-card">
          <Text className="text-gray-900 text-xl font-bold mb-4">Recent Goals</Text>
          {goals.slice(0, 3).length > 0 ? (
            <View className="space-y-4">
              {goals.slice(0, 3).map((goal, index) => (
                <View key={goal.id} className="flex-row items-center">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      {goal.completed ? (
                        <View className="w-6 h-6 rounded-full bg-success items-center justify-center mr-3">
                          <Text className="text-white text-xs">✓</Text>
                        </View>
                      ) : (
                        <View className="w-6 h-6 rounded-full bg-primary-100 border-2 border-primary mr-3" />
                      )}
                      <Text className="text-gray-900 font-semibold flex-1">{goal.title}</Text>
                    </View>
                    {/* Progress Bar */}
                    <View className="ml-9 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <View 
                        className={`h-full ${goal.completed ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </View>
                    <Text className="ml-9 text-sm text-gray-500 mt-1">{goal.progress}% complete</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Text className="text-6xl mb-2">🎯</Text>
              <Text className="text-gray-500 text-center">No goals yet. Let's create your first goal!</Text>
            </View>
          )}
        </View>

        {/* Mood Trend */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-card">
          <Text className="text-gray-900 text-xl font-bold mb-4">Weekly Mood Trend</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-4xl font-bold text-gray-900">{moodTrends.averageMood.toFixed(1)}</Text>
              <Text className="text-sm text-gray-500 mt-1">Average Mood</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${
              moodTrends.trend === 'up' ? 'bg-success-100' :
              moodTrends.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-base font-semibold ${
                moodTrends.trend === 'up' ? 'text-success-700' :
                moodTrends.trend === 'down' ? 'text-red-700' : 'text-gray-700'
              }`}>
                {moodTrends.trend === 'up' ? '📈 Improving' :
                 moodTrends.trend === 'down' ? '📉 Needs attention' : '➡️ Stable'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
