import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/core/theme/useTheme';

interface HomeSectionCardProps {
  title?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: ReactNode;
}

export default function HomeSectionCard({
  title,
  actionLabel,
  onActionPress,
  children,
}: HomeSectionCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      {title ? (
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            {title}
          </Text>
          {actionLabel && onActionPress ? (
            <Pressable onPress={onActionPress}>
              <Text style={styles.actionLabel}>
                {actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  actionLabel: {
    color: '#6D4DFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
