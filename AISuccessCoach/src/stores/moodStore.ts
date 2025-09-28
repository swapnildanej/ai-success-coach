import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { MoodEntry } from '../types';

interface MoodState {
  moodEntries: MoodEntry[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchMoodEntries: () => Promise<void>;
  createMoodEntry: (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  getMoodTrends: (days?: number) => { averageMood: number; averageEnergy: number; trend: 'up' | 'down' | 'stable' };
  clearError: () => void;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      moodEntries: [],
      loading: false,
      error: null,

      fetchMoodEntries: async () => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100);

          if (error) throw error;

          set({ moodEntries: data || [], loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch mood entries',
          });
        }
      },

      createMoodEntry: async (entryData) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('mood_entries')
            .insert([{
              ...entryData,
              user_id: user.id,
            }])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            moodEntries: [data, ...state.moodEntries],
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to create mood entry',
          });
          throw error;
        }
      },

      updateMoodEntry: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('mood_entries')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            moodEntries: state.moodEntries.map(entry => 
              entry.id === id ? { ...entry, ...data } : entry
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to update mood entry',
          });
          throw error;
        }
      },

      deleteMoodEntry: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('mood_entries')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            moodEntries: state.moodEntries.filter(entry => entry.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to delete mood entry',
          });
          throw error;
        }
      },

      getMoodTrends: (days = 30) => {
        const entries = get().moodEntries.slice(0, days);
        if (entries.length === 0) {
          return { averageMood: 5, averageEnergy: 5, trend: 'stable' as const };
        }

        const averageMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / entries.length;
        const averageEnergy = entries.reduce((sum, entry) => sum + entry.energy_level, 0) / entries.length;

        // Calculate trend (comparing first half vs second half)
        const halfPoint = Math.floor(entries.length / 2);
        const recentAverage = entries.slice(0, halfPoint).reduce((sum, entry) => sum + entry.mood_score, 0) / halfPoint;
        const olderAverage = entries.slice(halfPoint).reduce((sum, entry) => sum + entry.mood_score, 0) / (entries.length - halfPoint);
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        const difference = recentAverage - olderAverage;
        if (difference > 0.5) trend = 'up';
        else if (difference < -0.5) trend = 'down';

        return {
          averageMood: Math.round(averageMood * 10) / 10,
          averageEnergy: Math.round(averageEnergy * 10) / 10,
          trend,
        };
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mood-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        moodEntries: state.moodEntries,
      }),
    }
  )
);