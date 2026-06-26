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
      style={[
        styles.row,
        { borderColor: theme.border },
      ]}
    >
      <View style={styles.progressWrap}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>
            {progress}%
          </Text>
        </View>
      </View>
      <View style={styles.content}>
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
        <View style={styles.footerRow}>
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
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
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
  progressWrap: {
    alignItems: 'center',
    justifyContent: 'center',
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 18,
    minHeight: 94,
  },
  copy: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
