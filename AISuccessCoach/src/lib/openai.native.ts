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
    const fallbackResponses = [
      "I'm here to support you in achieving your goals. What specific challenge would you like to work on today?",
      "That's a great question! Let me help you think through some strategies. Could you share more details?",
      "I understand what you're going through. What would you like to focus on to move forward?",
      "You're taking positive steps by reaching out. What aspect of your goals needs the most attention right now?",
      "I'm here to help you succeed. What's the most important thing you'd like guidance on today?"
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
    const voiceFallbacks = [
      "I hear you and I'm here to support you. What specific challenge would you like to work through?",
      "That's important to acknowledge. What would help you feel more confident moving forward?",
      "I'm listening carefully. What's the first step you think might help in this situation?",
      "Thank you for sharing that with me. What outcome are you hoping for?",
      "I understand what you're going through. What support do you need most right now?"
    ];
    return voiceFallbacks[Math.floor(Math.random() * voiceFallbacks.length)];
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // For React Native transcription, use direct fetch to handle FormData properly
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    // Create FormData with proper React Native file handling
    const formData = new FormData();
    formData.append('audio', {
      uri: audioBlob as any, // In RN, this would be the recording URI
      type: 'audio/m4a',
      name: 'audio.m4a',
    } as any);
    
    // Use direct fetch for multipart uploads in React Native
    const response = await fetch(`${supabaseUrl}/functions/v1/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "I couldn't quite catch that. Could you try speaking again?";
  } catch (error) {
    console.error('Transcription error:', error);
    return "I couldn't quite catch that. Could you try speaking again?";
  }
};