import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { openaiProxy, COACHING_PROMPTS } from '../../src/lib/openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Success Coach. I'm here to help you achieve your goals, overcome challenges, and stay motivated. How are you feeling today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call the OpenAI proxy
      // For now, we'll simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I understand what you're sharing with me. As your AI coach, I want to help you work through this. Could you tell me more about what specific goals you're working toward right now?",
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">AI Success Coach</Text>
        <Text className="text-primary-100">Your personal coaching assistant</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-primary ml-4' 
                  : 'bg-white mr-4 shadow-sm'
              }`}
            >
              <Text
                className={`text-base ${
                  message.role === 'user' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {message.content}
              </Text>
              <Text
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
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

        {isLoading && (
          <View className="items-start mb-4">
            <View className="bg-white p-4 rounded-2xl mr-4 shadow-sm">
              <Text className="text-gray-500">AI Coach is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 mr-3"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            className={`bg-primary p-3 rounded-full ${(!inputText.trim() || isLoading) ? 'opacity-50' : ''}`}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}