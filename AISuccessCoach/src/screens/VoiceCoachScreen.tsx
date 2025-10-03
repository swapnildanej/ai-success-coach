import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { getVoiceResponse, transcribeAudio } from '../lib/openai';

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function VoiceCoachScreen() {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      type: 'assistant',
      text: "Hi! I'm your AI Voice Coach. Tap the microphone to start talking, and I'll listen and respond with voice guidance.",
      timestamp: new Date(),
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) {
        throw new Error('No recording URI available');
      }

      const transcript = await transcribeAudio(uri as any);
      
      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: transcript,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      const conversationContext = messages.slice(-3).map(m => `${m.type}: ${m.text}`).join('\n');
      const aiResponse = await getVoiceResponse(transcript, conversationContext);
      
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      setIsProcessing(false);
      
      speakResponse(aiResponse);
      
    } catch (error) {
      console.error('Error processing recording:', error);
      setIsProcessing(false);
      
      const errorMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        text: "I had trouble hearing that. Could you try speaking again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      speakResponse(errorMessage.text);
    }
  };

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !isSpeaking) {
      startRecording();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">AI Voice Coach</Text>
        <Text className="text-primary-100">Talk to your personal success coach</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-primary ml-4' 
                  : 'bg-white mr-4 shadow-sm'
              }`}
            >
              <View className="flex-row items-center mb-2">
                <Text className={`text-xs font-semibold ${message.type === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                  {message.type === 'user' ? '🎤 You' : '🤖 AI Coach'}
                </Text>
              </View>
              <Text
                className={`text-base ${
                  message.type === 'user' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {message.text}
              </Text>
              <Text
                className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        ))}

        {isProcessing && (
          <View className="items-start mb-4">
            <View className="bg-white p-4 rounded-2xl mr-4 shadow-sm">
              <Text className="text-gray-500">Processing your message...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="bg-white p-6 border-t border-gray-200">
        <View className="items-center">
          {isSpeaking && (
            <TouchableOpacity
              className="mb-4 bg-red-500 px-6 py-2 rounded-full"
              onPress={stopSpeaking}
            >
              <Text className="text-white font-semibold">🔇 Stop Speaking</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
              isRecording 
                ? 'bg-red-500' 
                : isProcessing || isSpeaking
                ? 'bg-gray-400' 
                : 'bg-primary'
            }`}
            onPress={handleMicPress}
            disabled={isProcessing}
          >
            <Text className="text-4xl">
              {isRecording ? '⏹️' : '🎤'}
            </Text>
          </TouchableOpacity>
          
          <Text className="text-gray-600 mt-3 text-sm">
            {isRecording 
              ? 'Tap to stop recording' 
              : isProcessing 
              ? 'Processing...' 
              : isSpeaking
              ? 'AI Coach is speaking...'
              : 'Tap to start talking'}
          </Text>
        </View>
      </View>
    </View>
  );
}
