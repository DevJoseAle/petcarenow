import { StyleSheet, Text } from 'react-native';
import { useTheme } from '@/core/theme/useTheme';

export default function CareProfileEmptyBlock({
  message,
}: {
  message: string;
}) {
  const theme = useTheme();

  return (
    <Text
      style={[
        styles.message,
        { color: theme.textSecondary },
      ]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 15,
    lineHeight: 22,
  },
});
