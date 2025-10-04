import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onAdd && (
        <TouchableOpacity onPress={onAdd} style={styles.add}>
          <Text style={{ color: 'white' }}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.text 
  },
  add: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
});
