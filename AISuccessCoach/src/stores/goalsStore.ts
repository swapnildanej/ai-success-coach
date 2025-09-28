import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Goal } from '../types';

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchGoals: () => Promise<void>;
  createGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      loading: false,
      error: null,

      fetchGoals: async () => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          set({ goals: data || [], loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch goals',
          });
        }
      },

      createGoal: async (goalData) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { data, error } = await supabase
            .from('goals')
            .insert([{
              ...goalData,
              user_id: user.id,
              progress: 0,
              completed: false,
            }])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            goals: [data, ...state.goals],
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to create goal',
          });
          throw error;
        }
      },

      updateGoal: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            goals: state.goals.map(goal => 
              goal.id === id ? { ...goal, ...data } : goal
            ),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to update goal',
          });
          throw error;
        }
      },

      deleteGoal: async (id) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            goals: state.goals.filter(goal => goal.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to delete goal',
          });
          throw error;
        }
      },

      updateProgress: async (id, progress) => {
        await get().updateGoal(id, { progress });
      },

      completeGoal: async (id) => {
        await get().updateGoal(id, { completed: true, progress: 100 });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        goals: state.goals,
      }),
    }
  )
);