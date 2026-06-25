import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/core/theme/useTheme';

interface HomeProfileCompletionCardProps {
  progress: number;
  onPress: () => void;
}

export default function HomeProfileCompletionCard({
  progress,
  onPress,
}: HomeProfileCompletionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
    >
      <View style={styles.left}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>
            {progress}%
          </Text>
        </View>
        <View style={styles.copy}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            Perfil de cuidado
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Completa el perfil para obtener mejores
            recomendaciones.
          </Text>
        </View>
      </View>
      <View style={styles.icons}>
        <View style={styles.iconChip}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color="#4DB082"
          />
        </View>
        <View style={styles.iconChip}>
          <Ionicons
            name="medkit-outline"
            size={20}
            color="#8C6CFF"
          />
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textSecondary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 8,
    borderColor: '#58BC8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4FAF6',
  },
});
