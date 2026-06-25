import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from 'expo-router/build/react-navigation';

import { useTheme } from '@/core/theme/useTheme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  horizontalPadding?: number;
}

const BASE_TOP_SPACING = 16;

export function Screen({
  children,
  scroll = false,
  horizontalPadding = 16,
}: Props) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const hasHeader = headerHeight > 0;
  const topPadding = hasHeader
    ? BASE_TOP_SPACING
    : insets.top + BASE_TOP_SPACING;
  const contentPadding = {
    paddingTop: topPadding,
    paddingBottom: insets.bottom,
    paddingLeft: Math.max(
      insets.left,
      horizontalPadding
    ),
    paddingRight: Math.max(
      insets.right,
      horizontalPadding
    ),
  };

  return (
    <LinearGradient
      colors={theme.gradient as [string, string, ...string[]]}
      style={styles.root}
    >
      {scroll ? (
        <ScrollView
          style={styles.root}
          contentContainerStyle={[
            styles.scrollContent,
            contentPadding,
          ]}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.root,
            contentPadding,
          ]}
        >
          {children}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
