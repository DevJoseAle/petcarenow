import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import type { ComponentProps } from 'react';
import { useTheme } from '@/core/theme/useTheme';

interface HomeCareItemProps {
  iconName: ComponentProps<typeof Ionicons>['name'];
  iconBackground: string;
  title: string;
  subtitle: string;
  tagLabel?: string;
  tagColor?: string;
  onPress?: () => void;
}

export default function HomeCareItem({
  iconName,
  iconBackground,
  title,
  subtitle,
  tagLabel,
  tagColor = '#DCE8FF',
  onPress,
}: HomeCareItemProps) {
  const theme = useTheme();
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      style={styles.row}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: iconBackground },
          ]}
        >
          <Ionicons
            name={iconName}
            size={24}
            color="#4C6FFF"
          />
        </View>
        <View style={styles.copy}>
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
      </View>
      <View style={styles.right}>
        {tagLabel ? (
          <View
            style={[
              styles.tag,
              { backgroundColor: tagColor },
            ]}
          >
            <Text style={styles.tagText}>
              {tagLabel}
            </Text>
          </View>
        ) : null}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textSecondary}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagText: {
    color: '#4C6FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
