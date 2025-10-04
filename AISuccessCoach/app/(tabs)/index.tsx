import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../src/stores/authStore';
import { useGoalsStore } from '../../src/stores/goalsStore';
import { colors, radius, shadow } from '../../src/theme';
import Card from '../../src/components/Card';

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Greeting */}
        <Text style={styles.greeting}>
          {getGreeting()}, there
        </Text>
        <Text style={styles.subtitle}>
          Your manifestation journey starts here
        </Text>

        {/* Today's Motivation Card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationLabel}>❝❝ Today's Motivation</Text>
          <Text style={styles.quote}>
            "Don't be afraid to give up the good to go for the great."
          </Text>
          <Text style={styles.author}>— John D. Rockefeller</Text>
          <Text style={styles.authorTitle}>Business Magnate</Text>
        </View>

        {/* Master Goal Card */}
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/goals')}
          style={styles.goalCard}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.emoji}>🎯</Text>
              <Text style={styles.cardTitle}>Master Goal</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </View>
          <Text style={styles.goalText}>
            {masterGoal?.title || 'I want to build a business and become financially free at age 35'}
          </Text>
        </TouchableOpacity>

        {/* Quick Ask AI Coach */}
        <View style={styles.askCard}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.emoji}>💬</Text>
            <Text style={styles.cardTitle}>Quick Ask AI Coach</Text>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask about goals, habits, mo..."
              placeholderTextColor="#9CA3AF"
              value={quickQuestion}
              onChangeText={setQuickQuestion}
              onSubmitEditing={handleSendQuestion}
            />
            <TouchableOpacity onPress={handleSendQuestion}>
              <Text style={styles.sendIcon}>✈️</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.helpText}>
            Ask about achieving your goals, building habits, or staying motivated
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtext,
    marginBottom: 24,
  },
  motivationCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 16,
  },
  motivationLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quote: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 16,
  },
  author: {
    color: 'white',
    textAlign: 'right',
    fontWeight: '500',
  },
  authorTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    fontSize: 14,
  },
  goalCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 16,
  },
  askCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.xl,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  goalText: {
    fontSize: 16,
    color: '#374151',
  },
  inputRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
  },
  sendIcon: {
    fontSize: 24,
  },
  helpText: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
});

