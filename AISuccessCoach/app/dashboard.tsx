import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { useGoalsStore } from '../src/stores/goalsStore';
import { useMoodStore } from '../src/stores/moodStore';

export default function DashboardScreen() {
  const { user, signOut } = useAuthStore();
  const { goals, loadGoals } = useGoalsStore();
  const { entries, loadEntries } = useMoodStore();

  useEffect(() => {
    loadGoals();
    loadEntries();
  }, []);

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const recentMoodEntries = entries.slice(0, 3);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#EF4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
            onPress={handleSignOut}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Your Progress</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1, backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3B82F6' }}>{completedGoals}/{totalGoals}</Text>
              <Text style={{ color: '#6B7280', marginTop: 4 }}>Goals Completed</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#F3F4F6', padding: 16, borderRadius: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#22C55E' }}>{entries.length}</Text>
              <Text style={{ color: '#6B7280', marginTop: 4 }}>Mood Entries</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Quick Actions</Text>
          <View style={{ gap: 12 }}>
            <Link href="/chat" style={{ backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>💬 Chat with AI Coach</Text>
            </Link>
            <Link href="/voice" style={{ backgroundColor: '#8B5CF6', padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>🎙️ Voice Coaching Session</Text>
            </Link>
            <Link href="/goals" style={{ backgroundColor: '#22C55E', padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>🎯 Manage Goals</Text>
            </Link>
            <Link href="/mood" style={{ backgroundColor: '#F59E0B', padding: 16, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>😊 Track Mood</Text>
            </Link>
          </View>
        </View>

        {/* Recent Activity */}
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Recent Activity</Text>
          {recentMoodEntries.length > 0 ? (
            <View style={{ gap: 12 }}>
              {recentMoodEntries.map((entry, index) => (
                <View key={index} style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#3B82F6' }}>
                  <Text style={{ fontWeight: '600', color: '#111827' }}>Mood: {entry.mood}/5</Text>
                  {entry.notes && <Text style={{ color: '#6B7280', marginTop: 4 }}>{entry.notes}</Text>}
                  <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ backgroundColor: '#F9FAFB', padding: 24, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                No recent activity. Start by tracking your mood or setting a goal!
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}