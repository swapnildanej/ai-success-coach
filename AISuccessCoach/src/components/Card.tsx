import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../theme';

export default function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: colors.card, 
    borderRadius: radius.xl, 
    padding: 16, 
    ...shadow.s, 
    marginBottom: 14 
  },
});
