import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
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

  const handleQuickStart = () => {
    setInputText('How can I set and achieve my goals effectively?');
  };

  const hasMessages = messages.length === 0;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="px-6 pt-12 pb-4 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Chat</Text>
        <Text className="text-base text-gray-500">Chat with your AI Success Coach</Text>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        {hasMessages ? (
          <View className="flex-1 items-center justify-center py-12">
            <View className="bg-gray-100 rounded-full w-24 h-24 items-center justify-center mb-6">
              <Text className="text-4xl">🤖</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-4">Start a conversation</Text>
            <Text className="text-base text-gray-600 text-center mb-8 px-8">
              Ask me about achieving your goals, building habits, improving your mindset, or how to use the app features. I'm here to help!
            </Text>
            <TouchableOpacity
              onPress={handleQuickStart}
              className="bg-primary rounded-full px-6 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Ask about goal setting</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-400 mt-4">Or type your own question below</Text>
          </View>
        ) : (
          <>
            {messages.map((message) => (
              <View
                key={message.id}
                className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {message.role === 'assistant' && (
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mb-2">
                    <Text className="text-sm">🤖</Text>
                  </View>
                )}
                {message.role === 'user' ? (
                  <View className="flex-row items-center">
                    <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md p-4">
                      <Text className="text-white text-base leading-6">
                        {message.content}
                      </Text>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-gray-900 items-center justify-center ml-2">
                      <Text className="text-sm">👤</Text>
                    </View>
                  </View>
                ) : (
                  <View className="max-w-[80%] bg-gray-100 p-4 rounded-3xl rounded-tl-md">
                    <Text className="text-gray-900 text-base leading-6">
                      {message.content}
                    </Text>
                  </View>
                )}
              </View>
            ))}

            {isLoading && (
              <View className="items-start mb-4">
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mb-2">
                  <Text className="text-sm">🤖</Text>
                </View>
                <View className="bg-gray-100 p-4 rounded-3xl rounded-tl-md">
                  <TypingIndicator />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Input */}
      <View className="bg-white px-6 py-4 border-t border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-5 py-2">
          <TextInput
            className="flex-1 text-base py-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
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
            <Text className="text-2xl">{inputText.trim() && !isLoading ? '✈️' : '📤'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
