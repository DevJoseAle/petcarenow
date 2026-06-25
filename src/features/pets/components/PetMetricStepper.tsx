import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

interface PetMetricStepperProps {
  value: string;
  suffix: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function PetMetricStepper({
  value,
  suffix,
  onIncrement,
  onDecrement,
}: PetMetricStepperProps) {
  const theme = useTheme();
  const displayValue = value || '0';

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.border },
      ]}
    >
      <Pressable
        onPress={onDecrement}
        style={styles.action}
      >
        <Text style={styles.actionText}>-</Text>
      </Pressable>
      <View style={styles.centerValue}>
        <Text
          style={[
            styles.value,
            { color: theme.textPrimary },
          ]}
        >
          {displayValue}
        </Text>
        <Text
          style={[
            styles.suffix,
            { color: theme.textSecondary },
          ]}
        >
          {suffix}
        </Text>
      </View>
      <Pressable
        onPress={onIncrement}
        style={styles.action}
      >
        <Text style={styles.actionText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#58BC8A',
  },
  centerValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
  },
  suffix: {
    fontSize: 18,
    fontWeight: '500',
  },
});
