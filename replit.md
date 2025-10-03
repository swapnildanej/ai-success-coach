# AI Success Coach

## Overview

AI Success Coach is a React Native mobile application built with Expo that provides personalized coaching through AI-powered chat, voice interactions, goal tracking, mood monitoring, and progress analytics. The app helps users achieve their goals by offering motivational support, tracking their emotional well-being, and providing actionable insights through an intelligent coaching interface.

## Recent Changes (October 2025)

**UI/UX Redesign - Minimalist Design System:**
- Complete redesign to clean, minimalist aesthetic with white backgrounds and simple bordered cards
- Removed all LinearGradient components in favor of flat design
- Updated Home screen with greeting "Good [morning/afternoon/evening], there" (no username), manifestation subtitle, Today's Motivation card with quote icon (❝❝), Master Goal card, and Quick Ask AI Coach section
- Redesigned AI Chat screen with title "Chat", subtitle "Chat with your AI Success Coach", simple empty state with robot icon and clean message bubbles
- Rebuilt Goals screen titled "Goal Planning" with subtitle "Plan your success step by step", Master Goal with PRIMARY badge, Small Goals, Roadblocks, and Solutions sections
- Created Journal screen titled "Journal" with subtitle "Write, record, and manifest your dreams", featuring Affirmations (✨), Gratitude (❤️), and Visualize (👁️) tabs
- Updated bottom navigation to 5 tabs: Home (🏠), AI Chat (💬), Goals (🎯), Journal (📔), Profile (👤)
- Primary color remains #3B82F6 with emphasis on simplicity and user-friendly interface
- All UI elements precisely match reference design specifications

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses **React Native with Expo** as the cross-platform mobile framework, leveraging **Expo Router** for file-based navigation. The UI is built with **NativeWind** (Tailwind CSS for React Native) for consistent styling across platforms. The app supports both iOS and Android through Expo's unified development environment, with web support enabled for development and testing.

### State Management
Global state is managed using **Zustand** with persistence via AsyncStorage. Three main stores handle different domains: AuthStore for user authentication and session management, GoalsStore for goal creation and progress tracking, and MoodStore for mood entries and trend analysis. This pattern provides type-safe, reactive state management with automatic persistence across app restarts.

### Backend Integration
The app integrates with **Supabase** as the backend-as-a-service solution, providing authentication, real-time database operations, and serverless functions. User authentication is handled through Supabase Auth with JWT tokens, while data persistence uses Supabase's PostgreSQL database through the JavaScript client. **Drizzle ORM** is configured for type-safe database operations, though the current implementation primarily uses Supabase's client directly.

### Database Design
The data model consists of four main entities: Users (authentication and profile data), Goals (with progress tracking, categories, and priorities), MoodEntries (daily emotional tracking with scores and tags), and ChatMessages (AI conversation history). Relationships are established through foreign keys, with all user-generated content properly scoped to authenticated users.

### AI Integration
AI functionality is implemented through **OpenAI's API** via secure serverless functions hosted on Supabase Edge Functions. The chat system maintains conversation context for coherent interactions, while voice features include speech-to-text transcription and text-to-speech synthesis. Fallback responses are implemented for offline scenarios or API failures.

### Cross-Platform Considerations
The app uses conditional imports (.native.ts and .web.ts files) to handle platform-specific implementations, particularly for OpenAI integrations and native device features. Voice recording and playback are restricted to mobile platforms, with appropriate fallbacks for web users.

## External Dependencies

### Cloud Services
- **Supabase**: Backend-as-a-service providing authentication, PostgreSQL database, real-time subscriptions, and Edge Functions for serverless API endpoints
- **OpenAI API**: GPT-powered chat responses and Whisper API for voice transcription, accessed securely through Supabase Edge Functions

### Development Frameworks
- **Expo SDK**: Cross-platform development framework with managed workflow, providing access to native device APIs and simplified deployment
- **React Native**: Core mobile app framework enabling code sharing between iOS and Android platforms

### Key Libraries
- **Expo Router**: File-based navigation system for React Native apps with support for deep linking and nested routes
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL operations with schema validation
- **Zustand**: Lightweight state management with built-in persistence capabilities
- **NativeWind**: Tailwind CSS integration for React Native, enabling utility-first styling
- **AsyncStorage**: Local key-value storage for persisting user preferences and cached data

### Device APIs
- **Expo AV**: Audio recording and playback for voice coaching features
- **Expo Speech**: Text-to-speech synthesis for AI voice responses
- **Expo Notifications**: Push notifications and local scheduling for goal reminders and mood check-ins
- **Expo Haptics**: Tactile feedback for enhanced user interactions

### UI Components
- **React Native SVG**: Scalable vector graphics support for icons and illustrations
- **React Native Calendars**: Calendar components for goal scheduling and mood tracking visualization