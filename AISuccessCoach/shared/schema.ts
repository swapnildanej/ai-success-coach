import { pgTable, uuid, text, integer, boolean, timestamp, numeric, date, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Profiles table (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Goals table
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull().default('personal'),
  priority: text('priority').default('medium'),
  target_value: numeric('target_value'),
  current_value: numeric('current_value').default('0'),
  progress: numeric('progress').default('0'),
  completed: boolean('completed').default(false),
  unit: text('unit'),
  target_date: date('target_date'),
  status: text('status').default('active'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  priorityCheck: check('priority_check', sql`${table.priority} IN ('low', 'medium', 'high')`),
  progressCheck: check('progress_check', sql`${table.progress} >= 0 AND ${table.progress} <= 100`),
  statusCheck: check('status_check', sql`${table.status} IN ('active', 'completed', 'paused')`),
}));

// Mood entries table
export const mood_entries = pgTable('mood_entries', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull(),
  mood_score: integer('mood_score').notNull(),
  energy_level: integer('energy_level'),
  stress_level: integer('stress_level'),
  notes: text('notes'),
  tags: text('tags').array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  moodScoreCheck: check('mood_score_check', sql`${table.mood_score} >= 1 AND ${table.mood_score} <= 10`),
  energyLevelCheck: check('energy_level_check', sql`${table.energy_level} >= 1 AND ${table.energy_level} <= 10`),
  stressLevelCheck: check('stress_level_check', sql`${table.stress_level} >= 1 AND ${table.stress_level} <= 10`),
}));

// Chat messages table
export const chat_messages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull(),
  message: text('message').notNull(),
  is_ai: boolean('is_ai').default(false),
  session_id: uuid('session_id').default(sql`uuid_generate_v4()`),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});