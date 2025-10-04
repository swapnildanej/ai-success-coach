import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, shadow } from '../theme';

export default function ListItem({ 
  text, 
  onEdit, 
  onDelete 
}: { 
  text: string; 
  onEdit?: () => void; 
  onDelete?: () => void; 
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Text>✏️</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Text>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    backgroundColor: colors.card, 
    borderRadius: radius.lg, 
    padding: 14, 
    ...shadow.s, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  text: { 
    fontSize: 16, 
    color: colors.text, 
    flex: 1, 
    paddingRight: 10 
  },
});
