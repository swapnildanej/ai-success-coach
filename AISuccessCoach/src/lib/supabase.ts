import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use environment variables directly for Expo web/dev
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Dynamic import to avoid import.meta issues on web
let supabaseClient: any = null;

const createSupabaseClient = async () => {
  if (!supabaseClient) {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: Platform.OS === 'web' && typeof window !== 'undefined' ? window.localStorage : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseClient;
};

export const supabase = {
  auth: {
    signInWithPassword: async (...args: any[]) => {
      const client = await createSupabaseClient();
      return client.auth.signInWithPassword(...args);
    },
    signUp: async (...args: any[]) => {
      const client = await createSupabaseClient();
      return client.auth.signUp(...args);
    },
    signOut: async () => {
      const client = await createSupabaseClient();
      return client.auth.signOut();
    },
    getUser: async () => {
      const client = await createSupabaseClient();
      return client.auth.getUser();
    },
  },
  functions: {
    invoke: async (...args: any[]) => {
      const client = await createSupabaseClient();
      return client.functions.invoke(...args);
    },
  },
};

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