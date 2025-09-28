import OpenAI from "openai";

// Native-only OpenAI implementation
// Note: For production, this should be called from a secure backend proxy to protect the API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - use backend proxy in production
});

export const sendMessage = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> => {
  try {
    const messages = [
      {
        role: 'system' as const,
        content: `You are an AI Success Coach. You help users achieve their goals, improve their mindset, and navigate life challenges. Be supportive, encouraging, and provide actionable advice. Keep responses conversational and under 200 words.`
      },
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return response.choices[0].message.content || "I'm here to help! Could you tell me more?";
  } catch (error) {
    console.error('OpenAI API error:', error);
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: 'system',
          content: `You are a Voice Success Coach. Respond to voice messages with empathy and actionable guidance. Keep responses under 150 words and speak naturally as if in a conversation. ${context ? `Context: ${context}` : ''}`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
    });

    return response.choices[0].message.content || "I'm listening. Tell me more about what's on your mind.";
  } catch (error) {
    console.error('OpenAI Voice API error:', error);
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
    const audioFile = new File([audioBlob], "audio.webm", { type: audioBlob.type });
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    return "I couldn't quite catch that. Could you try speaking again?";
  }
};