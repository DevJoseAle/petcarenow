// shared/components/Screen.tsx

import { PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  
import { useTheme } from '@/core/theme/useTheme';import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
  scroll: boolean
}

export function Screen({ children, scroll }: Props) {

  const theme = useTheme();
  const insets = useSafeAreaInsets();
    const content = scroll
      ? scrollviewWithProps(children, insets)
      : viewWithProps(children, insets);

  return (
    <LinearGradient
      colors={theme.gradient as [string, string, ...string[]]}
      style={{ flex: 1 }}>
      {content}
    </LinearGradient>
  );
}

const viewWithProps = (children: React.ReactNode, insets: EdgeInsets) => (
  <View
    style={[
      styles.content,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, 16),
        paddingRight: Math.max(insets.right, 16),
      },
    ]}>
    {children}
  </View>
);
const scrollviewWithProps = (children: React.ReactNode, insets: EdgeInsets) => (
  <View
    style={[
      styles.content,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, 16),
        paddingRight: Math.max(insets.right, 16),
      },
    ]}>
    {children}
  </View>
);
const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});