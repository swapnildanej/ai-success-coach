import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Dimensions } from 'react-native';
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

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-700',
      career: 'bg-blue-100 text-blue-700',
      personal: 'bg-purple-100 text-purple-700',
      financial: 'bg-yellow-100 text-yellow-700',
      learning: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">Goals</Text>
        <Text className="text-primary-100">Track and achieve your objectives</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {/* Stats Overview */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Overview</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{goals.filter(g => !g.completed).length}</Text>
              <Text className="text-sm text-gray-600">Active</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-success">{goals.filter(g => g.completed).length}</Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-500">
                {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
              </Text>
              <Text className="text-sm text-gray-600">Avg Progress</Text>
            </View>
          </View>
        </View>

        {/* Progress by Category */}
        {goals.length > 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Progress by Category</Text>
            {Object.entries(
              goals.reduce((acc, goal) => {
                acc[goal.category] = (acc[goal.category] || 0) + goal.progress;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, progress]) => (
              <View key={category} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-medium text-gray-700 capitalize">{category}</Text>
                  <Text className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</Text>
                </View>
                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View 
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Category Distribution */}
        {goals.length > 0 && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Goals by Category</Text>
            {Object.entries(
              goals.reduce((acc, goal) => {
                acc[goal.category] = (acc[goal.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([category, count], index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
              const percentage = Math.round((count / goals.length) * 100);
              return (
                <View key={category} className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <View className={`w-4 h-4 rounded-full mr-3 ${colors[index % colors.length]}`} />
                    <Text className="text-sm font-medium text-gray-700 capitalize">{category}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-600 mr-2">{count} goals</Text>
                    <Text className="text-sm font-semibold text-gray-900 w-8">{percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Goals List */}
        {goals.map((goal) => (
          <View key={goal.id} className="bg-white rounded-xl p-6 mb-4 shadow-sm">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className={`text-lg font-semibold ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {goal.title}
                </Text>
                {goal.description && (
                  <Text className="text-gray-600 text-sm mt-1">{goal.description}</Text>
                )}
              </View>
              <View className="ml-3">
                <Text className={`text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(goal.category)} self-start`}>
              <Text className={`text-xs font-medium ${getCategoryColor(goal.category).split(' ')[1]}`}>
                {goal.category}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Progress</Text>
                <Text className="text-sm font-semibold text-gray-900">{goal.progress}%</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View 
                  className={`h-2 rounded-full ${goal.completed ? 'bg-success' : 'bg-primary'}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            {!goal.completed && (
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="flex-1 bg-primary-50 py-2 px-3 rounded-lg"
                  onPress={() => updateProgress(goal.id, Math.min(100, goal.progress + 10))}
                >
                  <Text className="text-primary text-center font-semibold text-sm">+10%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-success-50 py-2 px-3 rounded-lg"
                  onPress={() => completeGoal(goal.id)}
                >
                  <Text className="text-success-700 text-center font-semibold text-sm">Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-50 py-2 px-3 rounded-lg"
                  onPress={() => deleteGoal(goal.id)}
                >
                  <Text className="text-red-600 text-center font-semibold text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {goals.length === 0 && (
          <View className="bg-white rounded-xl p-8 shadow-sm items-center">
            <Text className="text-gray-500 text-center mb-4">
              No goals yet. Start by creating your first goal!
            </Text>
            <TouchableOpacity
              className="bg-primary py-3 px-6 rounded-lg"
              onPress={() => setShowCreateModal(true)}
            >
              <Text className="text-white font-semibold">Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {goals.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowCreateModal(true)}
        >
          <Text className="text-white text-2xl">+</Text>
        </TouchableOpacity>
      )}

      {/* Create Goal Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-white">
          <View className="px-6 pt-12 pb-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text className="text-primary text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">New Goal</Text>
              <TouchableOpacity onPress={handleCreateGoal}>
                <Text className="text-primary text-lg font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 pt-6">
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Title *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={newGoal.title}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
                placeholder="What do you want to achieve?"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                value={newGoal.description}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, description: text }))}
                placeholder="Add more details about your goal"
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
              <View className="flex-row flex-wrap">
                {['personal', 'career', 'health', 'financial', 'learning'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      newGoal.category === category ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onPress={() => setNewGoal(prev => ({ ...prev, category: category as Goal['category'] }))}
                  >
                    <Text className={`capitalize ${
                      newGoal.category === category ? 'text-white' : 'text-gray-700'
                    }`}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Priority</Text>
              <View className="flex-row">
                {['low', 'medium', 'high'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    className={`px-4 py-2 rounded-full mr-2 ${
                      newGoal.priority === priority ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onPress={() => setNewGoal(prev => ({ ...prev, priority: priority as Goal['priority'] }))}
                  >
                    <Text className={`capitalize ${
                      newGoal.priority === priority ? 'text-white' : 'text-gray-700'
                    }`}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}