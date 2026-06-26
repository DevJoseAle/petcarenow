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
      style={[
        styles.row,
        { borderColor: theme.border },
      ]}
    >
      <View style={styles.main}>
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
        </View>
      </View>
      <View style={styles.chevronWrap}>
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
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 2,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 9,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  chevronWrap: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  tagText: {
    color: '#4C6FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
