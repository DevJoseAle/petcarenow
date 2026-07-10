import type { ComponentProps } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { useTheme } from '@/core/theme/useTheme';

interface PetChoiceChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  iconName?: ComponentProps<
    typeof Ionicons
  >['name'];
}

export default function PetChoiceChip({
  label,
  isSelected,
  onPress,
  iconName,
}: PetChoiceChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: isSelected
            ? theme.primary
            : theme.border,
          backgroundColor: isSelected
            ? theme.primarySoft
            : 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        {iconName ? (
          <Ionicons
            name={iconName}
            size={16}
            color={
              isSelected
                ? '#FFFFFF'
                : theme.textPrimary
            }
          />
        ) : null}
        <Text
          style={[
            styles.label,
            {
              color: isSelected
                ? '#FFFFFF'
                : theme.textPrimary,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.4,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
