import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      
      let updatedMessages: VoiceMessage[] = [];
      setMessages(prev => {
        updatedMessages = [...prev, userMessage];
        return updatedMessages;
      });

      const conversationContext = updatedMessages.slice(-4).map(m => `${m.type}: ${m.text}`).join('\n');
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
    <View className="flex-1 bg-background">
      {/* Header */}
      <LinearGradient
        colors={['#14B8A6', '#0D9488']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
      >
        <Text className="text-white text-3xl font-bold mb-2">Voice Coach 🎤</Text>
        <Text className="text-white/80">Talk to your success coach</Text>
      </LinearGradient>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            {message.type === 'assistant' && (
              <View className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center mb-2">
                <Text className="text-xl">🤖</Text>
              </View>
            )}
            {message.type === 'user' ? (
              <View className="max-w-[80%] rounded-3xl rounded-tr-md overflow-hidden">
                <LinearGradient
                  colors={['#14B8A6', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 16 }}
                >
                  <View className="flex-row items-center mb-1">
                    <Text className="text-white/70 text-xs font-semibold">🎤 You</Text>
                  </View>
                  <Text className="text-white text-base leading-6">
                    {message.text}
                  </Text>
                  <Text className="text-white/70 text-xs mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </LinearGradient>
              </View>
            ) : (
              <View className="max-w-[80%] bg-white p-4 rounded-3xl rounded-tl-md shadow-card">
                <View className="flex-row items-center mb-1">
                  <Text className="text-gray-500 text-xs font-semibold">🤖 AI Coach</Text>
                </View>
                <Text className="text-gray-900 text-base leading-6">
                  {message.text}
                </Text>
                <Text className="text-gray-500 text-xs mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            )}
          </View>
        ))}

        {isProcessing && (
          <View className="items-start mb-4">
            <View className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center mb-2">
              <Text className="text-xl">🤖</Text>
            </View>
            <View className="bg-white p-4 rounded-3xl rounded-tl-md shadow-card">
              <Text className="text-gray-500">Processing your message...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Voice Control */}
      <View className="bg-white px-6 py-6 border-t border-gray-100">
        <View className="items-center">
          {isSpeaking && (
            <TouchableOpacity
              activeOpacity={0.8}
              className="mb-4 bg-red-500 px-6 py-3 rounded-2xl"
              onPress={stopSpeaking}
            >
              <Text className="text-white font-bold">🔇 Stop Speaking</Text>
            </TouchableOpacity>
          )}
          
          <View className="relative items-center justify-center">
            {isRecording && (
              <>
                <Animated.View 
                  style={{ 
                    transform: [{ scale: pulseAnim }],
                    position: 'absolute',
                  }}
                  className="w-32 h-32 rounded-full bg-red-500/20"
                />
                <Animated.View 
                  style={{ 
                    transform: [{ scale: pulseAnim }],
                    position: 'absolute',
                  }}
                  className="w-28 h-28 rounded-full bg-red-500/30"
                />
              </>
            )}
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMicPress}
              disabled={isProcessing}
            >
              {isRecording ? (
                <View className="w-24 h-24 rounded-full overflow-hidden shadow-glow">
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={{ width: 96, height: 96, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text className="text-5xl">⏹️</Text>
                  </LinearGradient>
                </View>
              ) : (
                <View className="w-24 h-24 rounded-full overflow-hidden shadow-glow">
                  <LinearGradient
                    colors={isProcessing || isSpeaking ? ['#9CA3AF', '#6B7280'] : ['#14B8A6', '#0D9488']}
                    style={{ width: 96, height: 96, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text className="text-5xl">🎤</Text>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-600 mt-4 text-base font-medium">
            {isRecording 
              ? '🔴 Recording... Tap to stop' 
              : isProcessing 
              ? '⏳ Processing...' 
              : isSpeaking
              ? '🔊 AI Coach is speaking...'
              : '👆 Tap to start talking'}
          </Text>
        </View>
      </View>
    </View>
  );
}
