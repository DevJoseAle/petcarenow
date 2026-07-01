import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

interface VeterinaryFilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function VeterinaryFilterChip({
  label,
  isActive,
  onPress,
}: VeterinaryFilterChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: isActive
            ? theme.primary
            : theme.border,
          backgroundColor: isActive
            ? '#EEF9F2'
            : theme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: isActive
              ? theme.primaryPressed
              : theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});
