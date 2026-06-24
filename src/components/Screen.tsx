// shared/components/Screen.tsx

import { PropsWithChildren } from 'react';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/core/theme/useTheme'; import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from 'expo-router/build/react-navigation';

interface Props {
  children: React.ReactNode;
  scroll?: boolean
  horizontalPadding?: number
}

export function Screen({ children, scroll = false, horizontalPadding }: Props) {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight)
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const Container = scroll == true
    ? ScrollviewWithProps
    : ViewWithProps

  return (
    <LinearGradient
      colors={theme.gradient as [string, string, ...string[]]}
      style={{ flex: 1 }}>
      <Container insets={insets} headerHeight={headerHeight} horizontalPadding={horizontalPadding} >
        {children}
      </Container>
    </LinearGradient>
  );
}


interface ViewProps {
  children: React.ReactNode;
  insets: EdgeInsets;
  headerHeight: number;
  horizontalPadding?: number

}
const ViewWithProps = ({ children, insets, headerHeight, horizontalPadding = 16 }: ViewProps) => {
  return (
    <View
      style={[
        styles.content,
        {
          paddingTop: insets.top + (headerHeight ?? 0),
          paddingBottom: insets.bottom,
          paddingLeft: Math.max(insets.left, horizontalPadding),
          paddingRight: Math.max(insets.right, horizontalPadding)
        },
      ]}>
      {children}
    </View>
  )
};
const ScrollviewWithProps = ({ children, insets, headerHeight, horizontalPadding = 16 }: ViewProps) => {
  const isIos = Platform.OS == 'ios'
  const topInset = isIos && headerHeight > 90 ? 90 : 10
  return (
    <ScrollView
      style={[
        styles.content,
        {
          paddingTop: insets.top + topInset,
          paddingBottom: insets.bottom,
          paddingLeft: Math.max(insets.left, horizontalPadding),
          paddingRight: Math.max(insets.right, horizontalPadding),
        },
      ]}>
      {children}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});