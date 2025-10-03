// Core types for the AI Success Coach app

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number; // 0-100
  category: 'health' | 'career' | 'personal' | 'financial' | 'learning';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number; // 1-10
  energy_level: number; // 1-10
  notes?: string;
  tags: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  metadata?: {
    context?: string;
    sentiment?: number;
  };
}

export interface VoiceSession {
  id: string;
  user_id: string;
  transcript: string;
  duration: number;
  summary: string;
  insights: string[];
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  duration_days: number;
  completed_by: string[];
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}