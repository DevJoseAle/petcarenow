import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface HomeEmergencyCardProps {
  onPress: () => void;
}

export default function HomeEmergencyCard({
  onPress,
}: HomeEmergencyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color="#FF4D4F"
          />
        </View>
        <View style={styles.copyWrap}>
          <Text style={styles.title}>
            ¿Es una emergencia?
          </Text>
          <Text style={styles.subtitle}>
            Guías rápidas y veterinarios cercanos
            disponibles 24/7
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onPress}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>
          Ir a emergencia
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#FF4D4F"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    backgroundColor: '#FF4D4F',
    padding: 18,
    gap: 18,
  },
  leftContent: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  cta: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    color: '#FF4D4F',
    fontWeight: '700',
    fontSize: 16,
  },
});
