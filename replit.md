# AI Success Coach

## Overview

AI Success Coach is a React Native mobile application built with Expo that provides personalized coaching through AI-powered chat, voice interactions, goal tracking, mood monitoring, and progress analytics. The app helps users achieve their goals by offering motivational support, tracking their emotional well-being, and providing actionable insights through an intelligent coaching interface.

## Recent Changes (October 2025)

**October 4, 2025 - Full App Implementation COMPLETE:**

**UI/UX Implementation - Minimalist Design System:**
- ✅ Complete redesign to clean, minimalist aesthetic with white backgrounds and simple bordered cards
- ✅ Removed all LinearGradient components in favor of flat design
- ✅ Updated Home screen with time-based greeting "Good [morning/afternoon/evening], there", Today's Motivation card with inspirational quotes, Master Goal card with navigation, and Quick Ask AI Coach section
- ✅ Redesigned AI Chat screen with full conversation functionality, typing indicator animation, user/AI message bubbles, and smooth keyboard handling
- ✅ Rebuilt Goals screen titled "Goal Planning" with Master Goal (PRIMARY badge), Small Goals, Roadblocks, and Solutions sections - all with add/edit/delete functionality
- ✅ Created Journal screen with 3 functional tabs: Affirmations (✨), Gratitude (❤️), and Visualize (👁️) - all with save/delete functionality
- ✅ Updated Settings/Profile screen with user info, app settings, support links, and sign-out functionality
- ✅ Updated bottom navigation to 5 tabs: Home (🏠), AI Chat (💬), Goals (🎯), Journal (📔), Profile (👤)
- ✅ Primary color #3B82F6 with emphasis on simplicity and user-friendly interface
- ✅ All UI elements precisely match reference design specifications

**Technical Achievements:**
- ✅ Resolved NativeWind v4 compatibility issues with expo-router by moving nativewind/babel to presets array
- ✅ Implemented hybrid approach: StyleSheet for Home screen, NativeWind for other screens
- ✅ All screens fully functional on both Replit and local Windows machine
- ✅ Haptic feedback implemented across all interactive elements
- ✅ OpenAI chat integration working with conversation context
- ✅ Proper keyboard handling and scroll behavior
- ✅ Smooth tab switching and navigation

**Testing Results:**
- ✅ All 5 screens working perfectly
- ✅ All buttons and interactions functional
- ✅ Add/Edit/Delete operations working in Goals and Journal
- ✅ Chat sending messages and receiving AI responses
- ✅ Navigation between tabs smooth
- ✅ No critical errors on mobile (minor import.meta issue only affects web)

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