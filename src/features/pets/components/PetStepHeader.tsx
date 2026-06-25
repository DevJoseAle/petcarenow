import type { ComponentProps } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/core/theme/useTheme';

interface PetStepHeaderProps {
  step: number;
  totalSteps: number;
  iconName: ComponentProps<
    typeof Ionicons
  >['name'];
  title: string;
  subtitle: string;
}

export default function PetStepHeader({
  step,
  totalSteps,
  iconName,
  title,
  subtitle,
}: PetStepHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }).map(
          (_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index < step
                      ? '#58BC8A'
                      : '#DDE4E1',
                  width:
                    index === step - 1
                      ? 18
                      : 8,
                },
              ]}
            />
          )
        )}
      </View>
      <Text
        style={[
          styles.stepLabel,
          { color: theme.textSecondary },
        ]}
      >
        PASO {step} DE {totalSteps}
      </Text>
      <View style={styles.iconWrapper}>
        <Ionicons
          name={iconName}
          size={28}
          color="#58BC8A"
        />
      </View>
      <Text
        style={[
          styles.title,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.textSecondary },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 28,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  progressDot: {
    height: 4,
    borderRadius: 999,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 26,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },
});
