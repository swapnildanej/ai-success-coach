// Web-only OpenAI implementation using secure backend
import { supabase } from './supabase';

export const sendMessage = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        message: message,
        conversationHistory: conversationHistory
      }
    });

    if (error) {
      throw error;
    }

    return data.response || "I'm here to help! Could you tell me more?";
  } catch (error) {
    console.error('Chat API error:', error);
    // Web fallback responses for when backend is unavailable
    const fallbackResponses = [
      "I'm here to support you in achieving your goals. What specific challenge would you like to work on today?",
      "That's a great question! Let me help you think through some strategies. Could you share more details?",
      "I understand what you're going through. What would you like to focus on to move forward?",
      "You're taking positive steps by reaching out. What aspect of your goals needs the most attention right now?",
      "I'm here to help you succeed. What's the most important thing you'd like guidance on today?",
      "That's an insightful observation. What do you think would be the most effective next step?",
      "I appreciate you sharing that with me. How would you like to approach this challenge?",
      "You're showing great self-awareness by recognizing this. What resources do you have available to help?",
      "That's a common challenge many people face. What strategies have you tried before?",
      "I can hear the determination in your message. What would success look like to you?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

export const getVoiceResponse = async (transcript: string, context?: string): Promise<string> => {
  try {
    const voiceContext = `You are a Voice Success Coach. Respond to voice messages with empathy and actionable guidance. Keep responses under 150 words and speak naturally as if in a conversation. ${context ? `Context: ${context}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        message: transcript,
        context: voiceContext
      }
    });

    if (error) {
      throw error;
    }

    return data.response || "I'm listening. Tell me more about what's on your mind.";
  } catch (error) {
    console.error('Voice Chat API error:', error);
    // Web fallback for voice when backend is unavailable
    const voiceFallbacks = [
      "I hear you and I'm here to support you. What specific challenge would you like to work through?",
      "That's important to acknowledge. What would help you feel more confident moving forward?",
      "I'm listening carefully. What's the first step you think might help in this situation?",
      "Thank you for sharing that with me. What outcome are you hoping for?",
      "I understand what you're going through. What support do you need most right now?",
      "Your voice conveys real commitment to growth. What's the most important thing to focus on?",
      "I appreciate your honesty about this situation. How can I best support you?",
      "You're taking such a positive step by reflecting on this. What feels most urgent to address?"
    ];
    
    return voiceFallbacks[Math.floor(Math.random() * voiceFallbacks.length)];
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  // Web doesn't support voice recording, but provide a clear message
  return "Voice transcription is currently available on mobile only. Please type your message or try using the mobile app.";
};