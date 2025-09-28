// Note: This is a client-side proxy configuration for OpenAI
// In production, OpenAI calls should be made through a secure backend proxy
// to protect the API key from client exposure

import OpenAI from 'openai';

// For development, we'll create a simple proxy setup
// In production, replace this with actual backend endpoints
const OPENAI_PROXY_BASE_URL = process.env.EXPO_PUBLIC_OPENAI_PROXY_URL || 'http://localhost:3001/api';

// Client-safe OpenAI proxy functions
export const openaiProxy = {
  async chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
    try {
      const response = await fetch(`${OPENAI_PROXY_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI Chat Proxy Error:', error);
      throw new Error('Failed to get AI response');
    }
  },

  async transcribe(audioBlob: Blob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(`${OPENAI_PROXY_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI Transcription Proxy Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  },

  async analyzeSentiment(text: string) {
    try {
      const response = await fetch(`${OPENAI_PROXY_BASE_URL}/sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI Sentiment Proxy Error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }
};

// Coaching prompt templates
export const COACHING_PROMPTS = {
  dailyCheckIn: `You are an AI success coach. The user is doing their daily check-in. 
    Provide encouraging, personalized advice based on their goals and mood. 
    Keep responses warm, motivational, and actionable. 
    Ask follow-up questions to better understand their needs.`,
  
  goalSetting: `You are an AI success coach helping with goal setting. 
    Help the user create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). 
    Provide guidance on breaking down large goals into smaller, manageable steps.`,
  
  motivationalSupport: `You are an AI success coach providing motivational support. 
    The user may be facing challenges or setbacks. Provide empathetic, encouraging guidance 
    that acknowledges their struggles while helping them find practical solutions and maintain momentum.`,
  
  progressReview: `You are an AI success coach reviewing progress with the user. 
    Celebrate their achievements, help them learn from setbacks, and guide them in adjusting 
    their approach as needed. Focus on growth mindset and continuous improvement.`
};