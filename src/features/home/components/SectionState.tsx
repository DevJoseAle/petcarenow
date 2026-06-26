import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

interface SectionStateProps {
  type: 'loading' | 'empty' | 'error';
  message: string;
  onRetry?: () => void;
}

export default function SectionState({
  type,
  message,
  onRetry,
}: SectionStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {type === 'loading' ? (
        <ActivityIndicator color={theme.primary} />
      ) : null}
      <Text
        style={[
          styles.message,
          { color: theme.textSecondary },
        ]}
      >
        {message}
      </Text>
      {type === 'error' && onRetry ? (
        <Pressable
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>
            Reintentar
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EEF4FF',
  },
  retryText: {
    color: '#4C6FFF',
    fontWeight: '600',
  },
});
