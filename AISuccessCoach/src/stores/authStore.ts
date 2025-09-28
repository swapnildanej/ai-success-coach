import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase, getUser } from '../lib/supabase';
import { User, AppState } from '../types';

interface AuthState extends AppState {
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            set({
              isAuthenticated: true,
              user: data.user as User,
              loading: false,
            });
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign in failed',
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) throw error;
          
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign up failed',
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign out failed',
          });
        }
      },

      checkAuth: async () => {
        set({ loading: true });
        try {
          const user = await getUser();
          set({
            isAuthenticated: !!user,
            user: user as User,
            loading: false,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Auth check failed',
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => 
        Platform.OS === 'web' && typeof window !== 'undefined' ? window.localStorage : AsyncStorage
      ),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);