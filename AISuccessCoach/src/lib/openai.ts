import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Note: For production, this should be called from a secure backend proxy to protect the API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - use backend proxy in production
});

export const sendMessage = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> => {
  try {
    // Build conversation context
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
      model: "gpt-5",
      messages: messages,
    });

    return response.choices[0].message.content || "I'm here to help! Could you tell me more?";
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback responses for development/offline
    const fallbackResponses = [
      "I'm having trouble connecting right now, but I'm here to support you. Could you share more about what's on your mind?",
      "Let me help you work through that. What specific aspect would you like to focus on?",
      "That's an important question. While I sort out a technical issue, could you tell me more details?"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

export const getVoiceResponse = async (transcript: string, context?: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
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
    // Fallback for voice
    return "I hear you and I'm here to support you. While I work through a technical issue, know that taking time to reflect and speak your thoughts is already a positive step.";
  }
};

// Audio transcription using Whisper
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert blob to file for OpenAI
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