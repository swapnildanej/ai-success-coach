import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';

type Tab = 'affirmations' | 'gratitude' | 'visualize';

interface SavedItem {
  id: string;
  text: string;
  date: string;
}

export default function JournalScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('affirmations');
  const [gratitudeText, setGratitudeText] = useState('');
  const [savedAffirmations, setSavedAffirmations] = useState<SavedItem[]>([
    { id: '1', text: 'I easily overcome challenges while working on build a portfolio of 3 complete projects.', date: '1/10/2025' }
  ]);
  const [savedGratitude, setSavedGratitude] = useState<SavedItem[]>([
    { id: '1', text: '🙏 1. I am grateful for having this beautiful life\n2. I am grateful for having this beautiful house\n3. I am grateful for having this beautiful business\n4. I am grateful for having this healthy body', date: '1/10/2025' }
  ]);
  const [savedVisualizations, setSavedVisualizations] = useState<SavedItem[]>([
    { id: '1', text: 'Imagine yourself sitting in your home office, looking at your computer screen showing your business dashboard. The numbers are clear: $10,000 in monthly recurring revenue...', date: '1/10/2025' }
  ]);

  const affirmations = [
    "I am building a successful online business that serves thousands of people",
    "Every day I take decisive action toward my $10,000 monthly revenue goal",
    "I attract the right customers who value my products and services",
    "My business grows stronger and more profitable each month",
    "I have all the skills and resources needed to achieve my business goals"
  ];

  const visualizationScript = "Imagine yourself sitting in your home office, looking at your computer screen showing your business dashboard. The numbers are clear: $10,000 in monthly recurring revenue...";

  const handleSaveAffirmation = (text: string) => {
    const newItem: SavedItem = {
      id: Date.now().toString(),
      text,
      date: new Date().toLocaleDateString(),
    };
    setSavedAffirmations([...savedAffirmations, newItem]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSaveGratitude = () => {
    if (gratitudeText.trim()) {
      const newItem: SavedItem = {
        id: Date.now().toString(),
        text: gratitudeText,
        date: new Date().toLocaleDateString(),
      };
      setSavedGratitude([...savedGratitude, newItem]);
      setGratitudeText('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSaveVisualization = () => {
    const newItem: SavedItem = {
      id: Date.now().toString(),
      text: visualizationScript,
      date: new Date().toLocaleDateString(),
    };
    setSavedVisualizations([...savedVisualizations, newItem]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = (id: string, type: 'affirmation' | 'gratitude' | 'visualization') => {
    if (type === 'affirmation') {
      setSavedAffirmations(savedAffirmations.filter(item => item.id !== id));
    } else if (type === 'gratitude') {
      setSavedGratitude(savedGratitude.filter(item => item.id !== id));
    } else {
      setSavedVisualizations(savedVisualizations.filter(item => item.id !== id));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Journal</Text>
        <Text className="text-base text-gray-500">Write, record, and manifest your dreams</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => {
            setActiveTab('affirmations');
            Haptics.selectionAsync();
          }}
          className={`px-4 py-2 rounded-full mr-2 ${activeTab === 'affirmations' ? 'bg-primary' : 'bg-white'}`}
        >
          <View className="flex-row items-center">
            <Text className="mr-1">✨</Text>
            <Text className={`font-semibold ${activeTab === 'affirmations' ? 'text-white' : 'text-gray-700'}`}>
              Affirmations
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('gratitude');
            Haptics.selectionAsync();
          }}
          className={`px-4 py-2 rounded-full mr-2 ${activeTab === 'gratitude' ? 'bg-primary' : 'bg-white'}`}
        >
          <View className="flex-row items-center">
            <Text className="mr-1">❤️</Text>
            <Text className={`font-semibold ${activeTab === 'gratitude' ? 'text-white' : 'text-gray-700'}`}>
              Gratitude
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('visualize');
            Haptics.selectionAsync();
          }}
          className={`px-4 py-2 rounded-full ${activeTab === 'visualize' ? 'bg-primary' : 'bg-white'}`}
        >
          <View className="flex-row items-center">
            <Text className="mr-1">👁️</Text>
            <Text className={`font-semibold ${activeTab === 'visualize' ? 'text-white' : 'text-gray-700'}`}>
              Visualize
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Affirmations Tab */}
        {activeTab === 'affirmations' && (
          <View>
            <View className="border-l-4 border-primary pl-4 mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-2">✨</Text>
                <Text className="text-xl font-bold text-gray-900">Goal-Based Affirmations</Text>
              </View>
              <Text className="text-sm text-gray-600 mb-4">
                Personalized affirmations created from your master goal to help reinforce positive thinking and success mindset.
              </Text>
              {affirmations.map((affirmation, index) => (
                <View key={index} className="bg-gray-50 rounded-2xl p-4 mb-3">
                  <Text className="text-base italic text-gray-900 mb-3">"{affirmation}"</Text>
                  <TouchableOpacity
                    onPress={() => handleSaveAffirmation(affirmation)}
                    className="bg-primary rounded-lg py-2 px-4 self-end"
                  >
                    <Text className="text-white font-semibold">+ Save</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">My Affirmations</Text>
              <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-primary font-bold">{savedAffirmations.length}</Text>
              </View>
            </View>
            {savedAffirmations.map((item) => (
              <View key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
                <Text className="text-base text-gray-900 mb-2">"{item.text}"</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">{item.date}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id, 'affirmation')}>
                    <Text className="text-xl">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Gratitude Tab */}
        {activeTab === 'gratitude' && (
          <View>
            <View className="border-l-4 border-primary pl-4 mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-2">❤️ 🙏</Text>
                <Text className="text-xl font-bold text-gray-900">Daily Gratitude Practice</Text>
              </View>
              <Text className="text-sm text-gray-600 mb-4">
                Take a moment to reflect on what you're grateful for today. Gratitude helps shift focus to positive aspects of life.
              </Text>
              <TextInput
                className="bg-gray-50 rounded-2xl p-4 text-base text-gray-900 mb-3"
                placeholder="I'm grateful for..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={gratitudeText}
                onChangeText={setGratitudeText}
              />
              <TouchableOpacity
                onPress={handleSaveGratitude}
                className="bg-gray-200 rounded-lg py-3 items-center"
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">💾</Text>
                  <Text className="text-gray-900 font-semibold">Save</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">☀️ My Gratitude Journal</Text>
              <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-primary font-bold">{savedGratitude.length}</Text>
              </View>
            </View>
            {savedGratitude.map((item) => (
              <View key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
                <Text className="text-base text-gray-900 mb-2">{item.text}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">{item.date}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id, 'gratitude')}>
                    <Text className="text-xl">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Visualize Tab */}
        {activeTab === 'visualize' && (
          <View>
            <View className="border-l-4 border-primary pl-4 mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-xl mr-2">🎯</Text>
                <Text className="text-xl font-bold text-gray-900">Your Goal Visualization</Text>
              </View>
              <Text className="text-sm text-gray-600 mb-4">
                A personalized visualization script created from your master goal. Find a quiet space and listen or read slowly for best results.
              </Text>
              <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                <Text className="text-base italic text-gray-900 mb-4">{visualizationScript}</Text>
                <View className="flex-row">
                  <TouchableOpacity className="bg-primary rounded-lg py-3 px-6 flex-1 mr-2">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-lg mr-2">▶️</Text>
                      <Text className="text-white font-semibold">Play</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveVisualization}
                    className="bg-white border-2 border-primary rounded-lg py-3 px-6"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-lg mr-2">+</Text>
                      <Text className="text-primary font-semibold">Save</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Saved Scripts</Text>
              <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-primary font-bold">{savedVisualizations.length}</Text>
              </View>
            </View>
            {savedVisualizations.map((item) => (
              <View key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
                <Text className="text-lg font-bold text-gray-900 mb-2">My Goal Visualization</Text>
                <Text className="text-base text-gray-900 mb-3 italic" numberOfLines={2}>{item.text}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">{item.date}</Text>
                  <View className="flex-row">
                    <TouchableOpacity className="bg-primary rounded-lg py-2 px-4 mr-2">
                      <View className="flex-row items-center">
                        <Text className="text-base mr-1">▶️</Text>
                        <Text className="text-white font-semibold">Play</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id, 'visualization')}>
                      <Text className="text-xl">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
