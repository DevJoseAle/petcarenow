// shared/components/Screen.tsx

import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  
import { useTheme } from '@/features/core/theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = PropsWithChildren;

export function Screen({ children }: Props) {

  const theme = useTheme();
  
  const insets = useSafeAreaInsets();
    
  return (
    <LinearGradient 
      colors={theme.gradient as [string, string, ...string[]]}
      style={{ flex: 1 }}>

      <View style={[styles.content, 
        {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: Math.max(insets.left, 16),
            paddingRight: Math.max(insets.right, 16),
          }
        ]}>
        {children}
      </View>
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});