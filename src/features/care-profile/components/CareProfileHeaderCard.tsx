import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/core/theme/useTheme';
import type { Pet } from '@/features/pets/types/pet.types';

export default function CareProfileHeaderCard({
  pet,
  subtitle,
  weightLabel,
}: {
  pet: Pet;
  subtitle: string;
  weightLabel: string;
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
      {pet.photo_url ? (
        <Image
          source={{ uri: pet.photo_url }}
          style={styles.photo}
          contentFit="cover"
        />
      ) : (
        <View style={styles.photoFallback}>
          <Ionicons
            name="paw-outline"
            size={36}
            color="#6D4DFF"
          />
        </View>
      )}
      <View style={styles.copy}>
        <Text
          style={[
            styles.name,
            { color: theme.textPrimary },
          ]}
        >
          {pet.name}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
        <Text
          style={[
            styles.meta,
            { color: theme.textSecondary },
          ]}
        >
          {weightLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: 24,
  },
  photoFallback: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2ECFF',
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  meta: {
    fontSize: 15,
    fontWeight: '600',
  },
});
