import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getVoiceResponse, transcribeAudio } from '../../src/lib/openai';
import { hapticImpact, hapticSuccess } from '../../src/lib/notifications';

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState<Audio.Recording>();

  const startListening = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsListening(true);
      hapticImpact('light');
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 30000);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
      console.error('Failed to start recording', err);
    }
  };

  const stopListening = async () => {
    if (!recording) return;

    setIsListening(false);
    hapticImpact('medium');
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        // Convert to blob for transcription
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const transcribedText = await transcribeAudio(blob);
        setTranscript(transcribedText);
        handleVoiceInput(transcribedText);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process recording');
    }
    
    setRecording(undefined);
  };

  const handleVoiceInput = async (text: string) => {
    try {
      const coachResponse = await getVoiceResponse(text);
      setResponse(coachResponse);
      speakResponse(coachResponse);
      hapticSuccess();
    } catch (error) {
      Alert.alert('Error', 'Failed to process voice input');
    }
  };

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      setIsSpeaking(false);
      console.error('Speech error:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">Voice Coach</Text>
        <Text className="text-primary-100">Speak with your AI coach</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Voice Input Section */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Voice Input</Text>
          
          <TouchableOpacity
            className={`p-8 rounded-2xl items-center mb-4 ${
              isListening ? 'bg-red-100 border-2 border-red-300' : 'bg-primary-50 border-2 border-primary-200'
            }`}
            onPress={startListening}
            disabled={isListening || isSpeaking}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
              isListening ? 'bg-red-500' : 'bg-primary'
            }`}>
              <Text className="text-white text-2xl">🎤</Text>
            </View>
            <Text className={`font-semibold ${isListening ? 'text-red-700' : 'text-primary'}`}>
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Text>
            {isListening && (
              <Text className="text-sm text-gray-600 mt-2">
                Share what's on your mind
              </Text>
            )}
          </TouchableOpacity>

          {transcript && (
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-sm font-medium text-gray-700 mb-1">You said:</Text>
              <Text className="text-gray-900">{transcript}</Text>
            </View>
          )}
        </View>

        {/* AI Response Section */}
        {response && (
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">Coach Response</Text>
              {isSpeaking && (
                <View className="bg-success-100 px-3 py-1 rounded-full">
                  <Text className="text-success-700 text-sm font-medium">Speaking...</Text>
                </View>
              )}
            </View>
            
            <Text className="text-gray-900 leading-relaxed mb-4">{response}</Text>
            
            <TouchableOpacity
              className={`bg-success rounded-lg py-3 px-4 ${isSpeaking ? 'opacity-50' : ''}`}
              onPress={() => speakResponse(response)}
              disabled={isSpeaking}
            >
              <Text className="text-white text-center font-semibold">
                {isSpeaking ? 'Speaking...' : '🔊 Repeat Response'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!response && (
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-center text-gray-500 italic">
              Start a conversation with your voice coach by tapping the microphone above
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}