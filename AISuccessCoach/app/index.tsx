import React from 'react';
import { View, Text } from 'react-native';

export default function Index() {
  // Simplified test component without Supabase/auth dependencies
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f0f0f0',
      padding: 20
    }}>
      <Text style={{ 
        fontSize: 32, 
        color: '#3B82F6', 
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
      }}>
        🎉 AI Success Coach
      </Text>
      <Text style={{ 
        fontSize: 18, 
        color: '#333', 
        textAlign: 'center',
        marginBottom: 10
      }}>
        Development build working!
      </Text>
      <Text style={{ 
        fontSize: 14, 
        color: '#666', 
        textAlign: 'center'
      }}>
        React Native Web is running successfully
      </Text>
    </View>
  );
}