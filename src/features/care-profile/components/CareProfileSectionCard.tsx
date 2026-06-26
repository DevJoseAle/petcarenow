import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

export default function CareProfileSectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
      <Text
        style={[
          styles.title,
          { color: theme.textPrimary },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
});
