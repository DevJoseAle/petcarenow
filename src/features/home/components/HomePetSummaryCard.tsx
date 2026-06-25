import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Image } from 'expo-image';
import type { Pet } from '@/features/pets/types/pet.types';
import { useTheme } from '@/core/theme/useTheme';

interface HomePetSummaryCardProps {
  pet: Pet;
  ageLabel: string;
  weightLabel: string;
  canSwitchPets: boolean;
  onPressProfile: () => void;
  onPressChangePet: () => void;
}

export default function HomePetSummaryCard({
  pet,
  ageLabel,
  weightLabel,
  canSwitchPets,
  onPressProfile,
  onPressChangePet,
}: HomePetSummaryCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPressProfile}
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.leftColumn}>
        <View style={styles.photoWrap}>
          {pet.photo_url ? (
            <Image
              source={{ uri: pet.photo_url }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <View style={styles.photoFallback}>
              <Ionicons
                name="paw"
                size={34}
                color="#8C6CFF"
              />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                { color: theme.textPrimary },
              ]}
            >
              {pet.name}
            </Text>
            <View style={styles.badge}>
              <Ionicons
                name="paw"
                size={14}
                color="#8C6CFF"
              />
            </View>
          </View>
          <Text
            style={[
              styles.breed,
              { color: theme.textSecondary },
            ]}
          >
            {pet.breed || 'Raza no especificada'}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: theme.textSecondary },
                ]}
              >
                {ageLabel}
              </Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons
                name="barbell-outline"
                size={14}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: theme.textSecondary },
                ]}
              >
                {weightLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {canSwitchPets ? (
        <Pressable
          style={styles.switchButton}
          onPress={onPressChangePet}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={24}
            color="#7A5CFF"
          />
          <Text style={styles.switchText}>
            Cambiar{'\n'}mascota
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  photoWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#EFE8FF',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breed: {
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 15,
    fontWeight: '500',
  },
  switchButton: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 22,
    backgroundColor: '#F5EFFF',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  switchText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#7A5CFF',
  },
});
