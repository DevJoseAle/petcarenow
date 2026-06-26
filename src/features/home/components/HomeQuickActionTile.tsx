import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import type { ComponentProps } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/core/theme/useTheme';

interface HomeQuickActionTileProps {
  label: string;
  description: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function HomeQuickActionTile({
  label,
  description,
  iconName,
  tint,
  onPress,
  style,
}: HomeQuickActionTileProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.background,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[`${tint}1F`, `${tint}08`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: tint },
          ]}
        >
          <Ionicons
            name={iconName}
            size={26}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.copy}>
          <Text
            style={[
              styles.label,
              { color: theme.textPrimary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.description,
              { color: theme.textSecondary },
            ]}
          >
            {description}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 172,
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 2,
  },
  gradient: {
    flex: 1,
    minHeight: 136,
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
});
