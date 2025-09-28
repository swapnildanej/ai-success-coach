import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Database connection using environment variables
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
const client = postgres(connectionString, {
  max: 1, // Single connection for serverless
  idle_timeout: 20,
  connect_timeout: 60,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export all schema tables for easy access
export const { profiles, goals, mood_entries, chat_messages } = schema;