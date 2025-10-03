import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useMoodStore } from '../../src/stores/moodStore';

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

  const moodLabels = [
    { value: 1, emoji: '😢', label: 'Terrible' },
    { value: 2, emoji: '😟', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Poor' },
    { value: 4, emoji: '🙂', label: 'Okay' },
    { value: 5, emoji: '😊', label: 'Good' },
    { value: 6, emoji: '😄', label: 'Great' },
    { value: 7, emoji: '🤩', label: 'Amazing' },
  ];

  const energyLabels = [
    { value: 1, emoji: '😴', label: 'Exhausted' },
    { value: 2, emoji: '😪', label: 'Very Low' },
    { value: 3, emoji: '😑', label: 'Low' },
    { value: 4, emoji: '😐', label: 'Moderate' },
    { value: 5, emoji: '🙂', label: 'Good' },
    { value: 6, emoji: '⚡', label: 'High' },
    { value: 7, emoji: '🚀', label: 'Energized' },
  ];

  const tagOptions = [
    { name: 'work', emoji: '💼' },
    { name: 'family', emoji: '👨‍👩‍👧' },
    { name: 'health', emoji: '💪' },
    { name: 'exercise', emoji: '🏃' },
    { name: 'social', emoji: '👥' },
    { name: 'stress', emoji: '😰' },
    { name: 'relaxed', emoji: '😌' },
    { name: 'productive', emoji: '✅' },
    { name: 'creative', emoji: '🎨' },
    { name: 'grateful', emoji: '🙏' },
  ];

  const handleLogMood = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createMoodEntry({
        mood_score: selectedMood,
        energy_level: selectedEnergy,
        notes: notes.trim() || undefined,
        tags: selectedTags,
      });
      
      setSelectedMood(5);
      setSelectedEnergy(5);
      setNotes('');
      setSelectedTags([]);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Mood logged successfully! 🎉');
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood');
    }
  };

  const toggleTag = (tag: string) => {
    Haptics.selectionAsync();
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getMoodGradient = (score: number) => {
    if (score <= 2) return ['#EF4444', '#DC2626'];
    if (score <= 4) return ['#F59E0B', '#D97706'];
    if (score <= 5) return ['#EAB308', '#CA8A04'];
    return ['#22C55E', '#16A34A'];
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={['#A855F7', '#9333EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-12 pb-6"
      >
        <Text className="text-white text-3xl font-bold mb-2">Mood Tracker 😊</Text>
        <Text className="text-white/80">Track your emotional wellbeing</Text>
      </LinearGradient>

      <View className="px-6 pt-6">
        {/* Mood Trends Card */}
        <View className="flex-row mb-6 -mt-8">
          <LinearGradient
            colors={getMoodGradient(moodTrends.averageMood)}
            className="flex-1 p-5 rounded-3xl mr-2 shadow-card"
          >
            <Text className="text-white text-4xl font-bold">{moodTrends.averageMood.toFixed(1)}</Text>
            <Text className="text-white/80 text-sm mt-1">Avg Mood (7d)</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            className="flex-1 p-5 rounded-3xl ml-2 shadow-card"
          >
            <Text className="text-white text-4xl font-bold">{moodTrends.averageEnergy.toFixed(1)}</Text>
            <Text className="text-white/80 text-sm mt-1">Avg Energy (7d)</Text>
          </LinearGradient>
        </View>

        {/* Trend Indicator */}
        <View className="bg-white rounded-3xl p-5 mb-6 shadow-card">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-lg font-bold">Weekly Trend</Text>
            <View className={`px-4 py-2 rounded-full ${
              moodTrends.trend === 'up' ? 'bg-success-100' :
              moodTrends.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Text className={`font-semibold ${
                moodTrends.trend === 'up' ? 'text-success-700' :
                moodTrends.trend === 'down' ? 'text-red-700' : 'text-gray-700'
              }`}>
                {moodTrends.trend === 'up' ? '📈 Improving' :
                 moodTrends.trend === 'down' ? '📉 Declining' : '➡️ Stable'}
              </Text>
            </View>
          </View>
        </View>

        {/* Log New Mood */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-card">
          <Text className="text-gray-900 text-2xl font-bold mb-6">How are you feeling?</Text>
          
          {/* Mood Selection */}
          <Text className="text-gray-700 text-base font-semibold mb-3">Mood</Text>
          <View className="flex-row flex-wrap mb-6">
            {moodLabels.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedMood(mood.value);
                }}
              >
                {selectedMood === mood.value ? (
                  <LinearGradient
                    colors={getMoodGradient(mood.value)}
                    className="px-4 py-3 rounded-2xl mr-2 mb-2"
                  >
                    <Text className="text-white font-semibold">
                      {mood.emoji} {mood.label}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="px-4 py-3 rounded-2xl mr-2 mb-2 bg-gray-100">
                    <Text className="text-gray-700 font-medium">
                      {mood.emoji} {mood.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Energy Selection */}
          <Text className="text-gray-700 text-base font-semibold mb-3">Energy Level</Text>
          <View className="flex-row flex-wrap mb-6">
            {energyLabels.map((energy) => (
              <TouchableOpacity
                key={energy.value}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedEnergy(energy.value);
                }}
              >
                {selectedEnergy === energy.value ? (
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    className="px-4 py-3 rounded-2xl mr-2 mb-2"
                  >
                    <Text className="text-white font-semibold">
                      {energy.emoji} {energy.label}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="px-4 py-3 rounded-2xl mr-2 mb-2 bg-gray-100">
                    <Text className="text-gray-700 font-medium">
                      {energy.emoji} {energy.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <Text className="text-gray-700 text-base font-semibold mb-3">What's influencing you?</Text>
          <View className="flex-row flex-wrap mb-6">
            {tagOptions.map((tag) => (
              <TouchableOpacity
                key={tag.name}
                activeOpacity={0.7}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedTags.includes(tag.name) ? 'bg-purple-500' : 'bg-gray-100'
                }`}
                onPress={() => toggleTag(tag.name)}
              >
                <Text className={`font-medium capitalize ${
                  selectedTags.includes(tag.name) ? 'text-white' : 'text-gray-700'
                }`}>
                  {tag.emoji} {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes */}
          <Text className="text-gray-700 text-base font-semibold mb-2">Notes (optional)</Text>
          <TextInput
            className="border-2 border-gray-200 rounded-2xl px-4 py-3 mb-6 text-base"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any thoughts or reflections..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogMood}
          >
            <LinearGradient
              colors={['#A855F7', '#9333EA']}
              className="rounded-2xl py-4"
            >
              <Text className="text-white text-center font-bold text-lg">Log Mood</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Entries */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-card">
          <Text className="text-gray-900 text-xl font-bold mb-4">Recent Entries</Text>
          {moodEntries.slice(0, 5).length > 0 ? (
            moodEntries.slice(0, 5).map((entry) => (
              <View key={entry.id} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 font-medium">
                    {new Date(entry.created_at).toLocaleDateString('en', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="flex-row items-center mr-4 bg-purple-100 px-3 py-1 rounded-full">
                      <Text className="text-purple-700 font-bold">{entry.mood_score}</Text>
                    </View>
                    <View className="flex-row items-center bg-blue-100 px-3 py-1 rounded-full">
                      <Text className="text-blue-700 font-bold">⚡ {entry.energy_level}</Text>
                    </View>
                  </View>
                </View>
                {entry.tags.length > 0 && (
                  <View className="flex-row flex-wrap mb-2">
                    {entry.tags.map((tag, index) => (
                      <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-1">
                        <Text className="text-xs text-gray-700">{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {entry.notes && (
                  <Text className="text-gray-700 text-sm italic">{entry.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-6xl mb-2">😊</Text>
              <Text className="text-gray-500 text-center">No mood entries yet</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">Start tracking your emotional wellbeing</Text>
            </View>
          )}
        </View>

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
