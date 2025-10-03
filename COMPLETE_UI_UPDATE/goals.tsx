import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGoalsStore } from '../../src/stores/goalsStore';

interface SubGoal {
  id: string;
  text: string;
  type: 'small' | 'roadblock' | 'solution';
}

export default function GoalsScreen() {
  const { goals, fetchGoals } = useGoalsStore();
  const [masterGoal, setMasterGoal] = useState('Build a successful online business that generates $10,000 monthly revenue within 12 months');
  const [subGoals, setSubGoals] = useState<SubGoal[]>([
    { id: '1', text: 'Launch my first product within 3 months', type: 'small' },
    { id: '2', text: 'Build an email list of 1000 subscribers', type: 'small' },
    { id: '3', text: 'Create 50 pieces of valuable content', type: 'small' },
    { id: '4', text: 'Establish partnerships with 5 industry leaders', type: 'small' },
    { id: '5', text: 'Limited technical skills for website development', type: 'roadblock' },
    { id: '6', text: 'Lack of initial capital for marketing', type: 'roadblock' },
    { id: '7', text: 'Time management with current job', type: 'roadblock' },
    { id: '8', text: 'Competition in the market', type: 'roadblock' },
    { id: '9', text: 'Take online courses and practice coding daily', type: 'solution' },
    { id: '10', text: 'Start with free marketing strategies and social media', type: 'solution' },
    { id: '11', text: 'Wake up 2 hours earlier to work on business', type: 'solution' },
    { id: '12', text: 'Focus on unique value proposition and niche market', type: 'solution' },
  ]);
  const [showAddInput, setShowAddInput] = useState<{ type: string; visible: boolean }>({ type: '', visible: false });
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddItem = (type: 'small' | 'roadblock' | 'solution') => {
    if (newItemText.trim()) {
      const newGoal: SubGoal = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        type: type,
      };
      setSubGoals([...subGoals, newGoal]);
      setNewItemText('');
      setShowAddInput({ type: '', visible: false });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDeleteItem = (id: string) => {
    setSubGoals(subGoals.filter(g => g.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderGoalItem = (goal: SubGoal) => (
    <View key={goal.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center justify-between">
      <Text className="flex-1 text-base text-gray-900 mr-2">{goal.text}</Text>
      <View className="flex-row">
        <TouchableOpacity className="p-2" onPress={() => {}}>
          <Text className="text-xl text-gray-400">✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-2" onPress={() => handleDeleteItem(goal.id)}>
          <Text className="text-xl text-gray-400">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">Goal Planning</Text>
        <Text className="text-base text-gray-500 mb-6">Plan your success step by step</Text>

        {/* Master Goal */}
        <View className="bg-white border-2 border-primary rounded-3xl p-6 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🎯</Text>
              <Text className="text-xl font-bold text-gray-900">Master Goal</Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full ml-2">
                <Text className="text-xs font-bold text-primary">PRIMARY</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text className="text-2xl text-gray-400">✏️</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-base text-gray-700">{masterGoal}</Text>
        </View>

        {/* Small Goals */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">🎯</Text>
              <Text className="text-xl font-bold text-gray-900">Small Goals</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddInput({ type: 'small', visible: true })}
            >
              <Text className="text-2xl text-gray-900">+</Text>
            </TouchableOpacity>
          </View>
          {subGoals.filter(g => g.type === 'small').map(renderGoalItem)}
          {showAddInput.visible && showAddInput.type === 'small' && (
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-3">
              <TextInput
                className="text-base text-gray-900 mb-2"
                placeholder="Enter new small goal..."
                placeholderTextColor="#9CA3AF"
                value={newItemText}
                onChangeText={setNewItemText}
                onSubmitEditing={() => handleAddItem('small')}
                autoFocus
              />
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="px-4 py-2"
                  onPress={() => {
                    setShowAddInput({ type: '', visible: false });
                    setNewItemText('');
                  }}
                >
                  <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary px-4 py-2 rounded-lg ml-2"
                  onPress={() => handleAddItem('small')}
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Possible Roadblocks */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">⚠️</Text>
              <Text className="text-xl font-bold text-gray-900">Possible Roadblocks</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddInput({ type: 'roadblock', visible: true })}
            >
              <Text className="text-2xl text-gray-900">+</Text>
            </TouchableOpacity>
          </View>
          {subGoals.filter(g => g.type === 'roadblock').map(renderGoalItem)}
          {showAddInput.visible && showAddInput.type === 'roadblock' && (
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-3">
              <TextInput
                className="text-base text-gray-900 mb-2"
                placeholder="Enter potential roadblock..."
                placeholderTextColor="#9CA3AF"
                value={newItemText}
                onChangeText={setNewItemText}
                onSubmitEditing={() => handleAddItem('roadblock')}
                autoFocus
              />
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="px-4 py-2"
                  onPress={() => {
                    setShowAddInput({ type: '', visible: false });
                    setNewItemText('');
                  }}
                >
                  <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary px-4 py-2 rounded-lg ml-2"
                  onPress={() => handleAddItem('roadblock')}
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Possible Solutions */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">💡</Text>
              <Text className="text-xl font-bold text-gray-900">Possible Solutions</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddInput({ type: 'solution', visible: true })}
            >
              <Text className="text-2xl text-success">+</Text>
            </TouchableOpacity>
          </View>
          {subGoals.filter(g => g.type === 'solution').map(renderGoalItem)}
          {showAddInput.visible && showAddInput.type === 'solution' && (
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-3">
              <TextInput
                className="text-base text-gray-900 mb-2"
                placeholder="Enter possible solution..."
                placeholderTextColor="#9CA3AF"
                value={newItemText}
                onChangeText={setNewItemText}
                onSubmitEditing={() => handleAddItem('solution')}
                autoFocus
              />
              <View className="flex-row justify-end">
                <TouchableOpacity
                  className="px-4 py-2"
                  onPress={() => {
                    setShowAddInput({ type: '', visible: false });
                    setNewItemText('');
                  }}
                >
                  <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary px-4 py-2 rounded-lg ml-2"
                  onPress={() => handleAddItem('solution')}
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
