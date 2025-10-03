import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { sendMessage as sendOpenAIMessage } from '../../src/lib/openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
      // Build conversation history for context
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await sendOpenAIMessage(userMessage.content, conversationHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now, but I'm here to support you. Could you share more about what's on your mind?",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animate(dot1, 0);
      animate(dot2, 200);
      animate(dot3, 400);
    }, []);

    return (
      <View className="flex-row space-x-1">
        <Animated.View 
          className="w-2 h-2 rounded-full bg-gray-400"
          style={{ opacity: dot1 }}
        />
        <Animated.View 
          className="w-2 h-2 rounded-full bg-gray-400 ml-1"
          style={{ opacity: dot2 }}
        />
        <Animated.View 
          className="w-2 h-2 rounded-full bg-gray-400 ml-1"
          style={{ opacity: dot3 }}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-12 pb-6"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
            <Text className="text-2xl">🤖</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">AI Success Coach</Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
              <Text className="text-white/80 text-sm">Online</Text>
            </View>
          </View>
        </View>
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
            className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {message.role === 'assistant' && (
              <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mb-2">
                <Text className="text-sm">🤖</Text>
              </View>
            )}
            {message.role === 'user' ? (
              <LinearGradient
                colors={['#3B82F6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="max-w-[80%] p-4 rounded-3xl rounded-tr-md"
              >
                <Text className="text-white text-base leading-6">
                  {message.content}
                </Text>
                <Text className="text-white/70 text-xs mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </LinearGradient>
            ) : (
              <View className="max-w-[80%] bg-white p-4 rounded-3xl rounded-tl-md shadow-card">
                <Text className="text-gray-900 text-base leading-6">
                  {message.content}
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

        {isLoading && (
          <View className="items-start mb-4">
            <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mb-2">
              <Text className="text-sm">🤖</Text>
            </View>
            <View className="bg-white p-4 rounded-3xl rounded-tl-md shadow-card">
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="bg-white px-4 py-3 border-t border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-base py-2 max-h-24"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message your coach..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
            className="ml-2"
          >
            {inputText.trim() && !isLoading ? (
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <Text className="text-white text-lg">↑</Text>
              </LinearGradient>
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-white text-lg">↑</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
