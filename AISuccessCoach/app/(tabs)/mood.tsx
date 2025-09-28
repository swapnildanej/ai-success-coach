import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useMoodStore } from '../../src/stores/moodStore';
import { MoodEntry } from '../../src/types';

export default function MoodScreen() {
  const { moodEntries, loading, error, fetchMoodEntries, createMoodEntry, getMoodTrends } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState(5);
  const [selectedEnergy, setSelectedEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const moodTrends = getMoodTrends(7);
  const weeklyTrends = getMoodTrends(30);

  const moodLabels = [
    { value: 1, label: '😢 Terrible', color: 'text-red-600' },
    { value: 2, label: '😟 Bad', color: 'text-red-500' },
    { value: 3, label: '😐 Poor', color: 'text-orange-500' },
    { value: 4, label: '🙂 Okay', color: 'text-yellow-500' },
    { value: 5, label: '😊 Good', color: 'text-green-400' },
    { value: 6, label: '😄 Great', color: 'text-green-500' },
    { value: 7, label: '🤩 Amazing', color: 'text-green-600' },
  ];

  const energyLabels = [
    { value: 1, label: '😴 Exhausted', color: 'text-red-600' },
    { value: 2, label: '😪 Very Low', color: 'text-red-500' },
    { value: 3, label: '😑 Low', color: 'text-orange-500' },
    { value: 4, label: '😐 Moderate', color: 'text-yellow-500' },
    { value: 5, label: '🙂 Good', color: 'text-green-400' },
    { value: 6, label: '⚡ High', color: 'text-green-500' },
    { value: 7, label: '🚀 Energized', color: 'text-green-600' },
  ];

  const tagOptions = [
    'work', 'family', 'health', 'exercise', 'social', 'stress', 'relaxed', 
    'productive', 'creative', 'grateful', 'anxious', 'excited', 'tired', 'motivated'
  ];

  const handleLogMood = async () => {
    try {
      await createMoodEntry({
        mood_score: selectedMood,
        energy_level: selectedEnergy,
        notes: notes.trim() || undefined,
        tags: selectedTags,
      });
      
      // Reset form
      setSelectedMood(5);
      setSelectedEnergy(5);
      setNotes('');
      setSelectedTags([]);
      
      Alert.alert('Success', 'Mood logged successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getMoodColor = (score: number) => {
    if (score <= 2) return 'text-red-600';
    if (score <= 4) return 'text-orange-500';
    if (score <= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">Mood Tracker</Text>
        <Text className="text-primary-100">Log and track your emotional wellbeing</Text>
      </View>

      <View className="px-6 pt-4">
        {/* Mood Trends */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Your Trends</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className={`text-2xl font-bold ${getMoodColor(moodTrends.averageMood)}`}>
                {moodTrends.averageMood.toFixed(1)}
              </Text>
              <Text className="text-sm text-gray-600">7-day Avg Mood</Text>
            </View>
            <View className="items-center">
              <Text className={`text-2xl font-bold ${getMoodColor(moodTrends.averageEnergy)}`}>
                {moodTrends.averageEnergy.toFixed(1)}
              </Text>
              <Text className="text-sm text-gray-600">7-day Avg Energy</Text>
            </View>
            <View className="items-center">
              <Text className={`text-lg font-bold ${
                moodTrends.trend === 'up' ? 'text-green-600' :
                moodTrends.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {moodTrends.trend === 'up' ? '↗️' : moodTrends.trend === 'down' ? '↘️' : '➡️'}
              </Text>
              <Text className="text-sm text-gray-600">Trend</Text>
            </View>
          </View>
        </View>

        {/* Log New Mood */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">How are you feeling right now?</Text>
          
          {/* Mood Selection */}
          <Text className="text-sm font-medium text-gray-700 mb-3">Mood</Text>
          <View className="flex-row flex-wrap mb-4">
            {moodLabels.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                  selectedMood === mood.value ? 'bg-primary' : 'bg-gray-100'
                }`}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text className={`text-sm ${
                  selectedMood === mood.value ? 'text-white' : 'text-gray-700'
                }`}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Energy Selection */}
          <Text className="text-sm font-medium text-gray-700 mb-3">Energy Level</Text>
          <View className="flex-row flex-wrap mb-4">
            {energyLabels.map((energy) => (
              <TouchableOpacity
                key={energy.value}
                className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
                  selectedEnergy === energy.value ? 'bg-primary' : 'bg-gray-100'
                }`}
                onPress={() => setSelectedEnergy(energy.value)}
              >
                <Text className={`text-sm ${
                  selectedEnergy === energy.value ? 'text-white' : 'text-gray-700'
                }`}>
                  {energy.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <Text className="text-sm font-medium text-gray-700 mb-3">What's influencing your mood?</Text>
          <View className="flex-row flex-wrap mb-4">
            {tagOptions.map((tag) => (
              <TouchableOpacity
                key={tag}
                className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                  selectedTags.includes(tag) ? 'bg-success' : 'bg-gray-200'
                }`}
                onPress={() => toggleTag(tag)}
              >
                <Text className={`text-sm capitalize ${
                  selectedTags.includes(tag) ? 'text-white' : 'text-gray-700'
                }`}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes */}
          <Text className="text-sm font-medium text-gray-700 mb-2">Notes (optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any thoughts or reflections..."
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            className="bg-primary rounded-lg py-4"
            onPress={handleLogMood}
          >
            <Text className="text-white text-center font-semibold text-lg">Log Mood</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Entries */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</Text>
          {moodEntries.slice(0, 5).length > 0 ? (
            moodEntries.slice(0, 5).map((entry) => (
              <View key={entry.id} className="border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:mb-0">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm text-gray-600">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </Text>
                  <View className="flex-row">
                    <Text className={`text-sm font-medium mr-3 ${getMoodColor(entry.mood_score)}`}>
                      Mood: {entry.mood_score}/10
                    </Text>
                    <Text className={`text-sm font-medium ${getMoodColor(entry.energy_level)}`}>
                      Energy: {entry.energy_level}/10
                    </Text>
                  </View>
                </View>
                {entry.tags.length > 0 && (
                  <View className="flex-row flex-wrap mb-2">
                    {entry.tags.map((tag, index) => (
                      <Text key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-1 mb-1">
                        {tag}
                      </Text>
                    ))}
                  </View>
                )}
                {entry.notes && (
                  <Text className="text-sm text-gray-700">{entry.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <Text className="text-gray-500 italic text-center">No mood entries yet</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}