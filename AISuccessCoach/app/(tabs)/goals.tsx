import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useGoalsStore } from '../../src/stores/goalsStore';
import { Goal } from '../../src/types';

export default function GoalsScreen() {
  const { goals, loading, error, fetchGoals, createGoal, updateProgress, completeGoal, deleteGoal } = useGoalsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    target_date: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createGoal({
        ...newGoal,
        progress: 0,
        completed: false,
      });
      setShowCreateModal(false);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        target_date: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal');
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      health: '💪',
      career: '💼',
      personal: '✨',
      financial: '💰',
      learning: '📚',
    };
    return emojis[category as keyof typeof emojis] || '🎯';
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      health: ['#22C55E', '#16A34A'],
      career: ['#3B82F6', '#2563EB'],
      personal: ['#A855F7', '#9333EA'],
      financial: ['#F59E0B', '#D97706'],
      learning: ['#6366F1', '#4F46E5'],
    };
    return gradients[category as keyof typeof gradients] || ['#3B82F6', '#2563EB'];
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
      >
        <Text className="text-white text-3xl font-bold mb-2">Goals 🎯</Text>
        <Text className="text-white/80">Track your progress</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Stats Overview with Gradients */}
        <View className="flex-row mb-6 -mt-8">
          <View className="flex-1 rounded-2xl mr-2 shadow-card overflow-hidden">
            <LinearGradient
              colors={['#3B82F6', '#6366F1']}
              style={{ padding: 16 }}
            >
              <Text className="text-white text-3xl font-bold">{goals.filter(g => !g.completed).length}</Text>
              <Text className="text-white/80 text-sm mt-1">Active</Text>
            </LinearGradient>
          </View>

          <View className="flex-1 rounded-2xl mx-1 shadow-card overflow-hidden">
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={{ padding: 16 }}
            >
              <Text className="text-white text-3xl font-bold">{goals.filter(g => g.completed).length}</Text>
              <Text className="text-white/80 text-sm mt-1">Completed</Text>
            </LinearGradient>
          </View>

          <View className="flex-1 rounded-2xl ml-2 shadow-card overflow-hidden">
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={{ padding: 16 }}
            >
              <Text className="text-white text-3xl font-bold">
                {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
              </Text>
              <Text className="text-white/80 text-sm mt-1">Average</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Goals List */}
        {goals.map((goal) => (
          <View key={goal.id} className="bg-white rounded-3xl p-6 mb-4 shadow-card">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 flex-row items-start">
                <Text className="text-3xl mr-3">{getCategoryEmoji(goal.category)}</Text>
                <View className="flex-1">
                  <Text className={`text-lg font-bold ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {goal.title}
                  </Text>
                  {goal.description && (
                    <Text className="text-gray-600 text-sm mt-1">{goal.description}</Text>
                  )}
                  <View className="flex-row items-center mt-2">
                    <View className={`px-3 py-1 rounded-full mr-2 ${
                      goal.category === 'health' ? 'bg-success-100' :
                      goal.category === 'career' ? 'bg-primary-100' :
                      goal.category === 'personal' ? 'bg-purple-100' :
                      goal.category === 'financial' ? 'bg-yellow-100' :
                      'bg-indigo-100'
                    }`}>
                      <Text className={`text-xs font-semibold capitalize ${
                        goal.category === 'health' ? 'text-success-700' :
                        goal.category === 'career' ? 'text-primary-700' :
                        goal.category === 'personal' ? 'text-purple-700' :
                        goal.category === 'financial' ? 'text-yellow-700' :
                        'text-indigo-700'
                      }`}>
                        {goal.category}
                      </Text>
                    </View>
                    {goal.priority === 'high' && (
                      <View className="px-2 py-1 rounded-full bg-red-100">
                        <Text className="text-xs font-semibold text-red-700">HIGH</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Circular Progress */}
            <View className="items-center mb-4">
              <View className="relative">
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <Text className="text-2xl font-bold text-gray-900">{goal.progress}%</Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <LinearGradient
                  colors={goal.completed ? ['#22C55E', '#16A34A'] : getCategoryGradient(goal.category)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: `${goal.progress}%`, height: '100%' }}
                  className="rounded-full"
                />
              </View>
            </View>

            {/* Action Buttons */}
            {!goal.completed && (
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-1"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateProgress(goal.id, Math.min(100, goal.progress + 10));
                  }}
                >
                  <View className="rounded-xl overflow-hidden">
                    <LinearGradient
                      colors={['#3B82F6', '#2563EB']}
                      style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                    >
                      <Text className="text-white text-center font-semibold">+10%</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-1 mx-2"
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    completeGoal(goal.id);
                  }}
                >
                  <View className="rounded-xl overflow-hidden">
                    <LinearGradient
                      colors={['#22C55E', '#16A34A']}
                      style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                    >
                      <Text className="text-white text-center font-semibold">Complete ✓</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-red-100 py-3 px-4 rounded-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    deleteGoal(goal.id);
                  }}
                >
                  <Text className="text-red-600 text-center font-semibold">🗑️</Text>
                </TouchableOpacity>
              </View>
            )}

            {goal.completed && (
              <View className="bg-success-50 py-3 px-4 rounded-xl">
                <Text className="text-success-700 text-center font-semibold">✓ Completed!</Text>
              </View>
            )}
          </View>
        ))}

        {goals.length === 0 && (
          <View className="bg-white rounded-3xl p-12 shadow-card items-center mt-8">
            <Text className="text-6xl mb-4">🎯</Text>
            <Text className="text-gray-900 text-xl font-bold mb-2">No goals yet</Text>
            <Text className="text-gray-500 text-center mb-6">
              Start your success journey by creating your first goal!
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCreateModal(true);
              }}
            >
              <View className="rounded-2xl overflow-hidden">
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={{ paddingVertical: 16, paddingHorizontal: 32 }}
                >
                  <Text className="text-white font-bold text-lg">Create Your First Goal</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      {goals.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowCreateModal(true);
          }}
          className="absolute bottom-6 right-6"
        >
          <View className="w-16 h-16 rounded-full shadow-glow overflow-hidden">
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white text-3xl">+</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      )}

      {/* Create Goal Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-white">
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 16 }}
          >
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text className="text-white text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold text-white">New Goal</Text>
              <TouchableOpacity onPress={handleCreateGoal}>
                <Text className="text-white text-lg font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView className="flex-1 px-6 pt-6">
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Title *</Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-base"
                value={newGoal.title}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
                placeholder="What do you want to achieve?"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-base"
                value={newGoal.description}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, description: text }))}
                placeholder="Add more details about your goal"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Category</Text>
              <View className="flex-row flex-wrap">
                {[
                  { key: 'personal', emoji: '✨' },
                  { key: 'career', emoji: '💼' },
                  { key: 'health', emoji: '💪' },
                  { key: 'financial', emoji: '💰' },
                  { key: 'learning', emoji: '📚' }
                ].map(({ key, emoji }) => (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.8}
                    className={`px-5 py-3 rounded-2xl mr-2 mb-2 ${
                      newGoal.category === key ? 'bg-primary' : 'bg-gray-100'
                    }`}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setNewGoal(prev => ({ ...prev, category: key as Goal['category'] }));
                    }}
                  >
                    <Text className={`capitalize font-semibold ${
                      newGoal.category === key ? 'text-white' : 'text-gray-700'
                    }`}>
                      {emoji} {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Priority</Text>
              <View className="flex-row">
                {['low', 'medium', 'high'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    activeOpacity={0.8}
                    className={`px-5 py-3 rounded-2xl mr-2 ${
                      newGoal.priority === priority ? 'bg-primary' : 'bg-gray-100'
                    }`}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setNewGoal(prev => ({ ...prev, priority: priority as Goal['priority'] }));
                    }}
                  >
                    <Text className={`capitalize font-semibold ${
                      newGoal.priority === priority ? 'text-white' : 'text-gray-700'
                    }`}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="h-8" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
