import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Use environment variables directly for Expo web/dev
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client directly (no dynamic import)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' && typeof window !== 'undefined' ? window.localStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabase = supabaseClient;

// Database helper functions
export const getUser = async () => {
  try {
    // If using placeholder credentials, skip auth check
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.log('Auth check failed:', error);
    return null;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};