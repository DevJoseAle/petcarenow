import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@/components/icons/Ionicons';
import { useTheme } from '@/core/theme/useTheme';
import type { VeterinaryWithDistance } from '../types/veterinary.types';

interface VeterinaryListCardProps {
  veterinary: VeterinaryWithDistance;
  onPress: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function VeterinaryListCard({
  veterinary,
  onPress,
  onSelect,
  isSelected = false,
}: VeterinaryListCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onSelect ?? onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: isSelected
            ? theme.primary
            : theme.border,
          shadowColor: '#0F172A',
        },
      ]}
    >
      {veterinary.logo_url || veterinary.photo_url ? (
        <Image
          source={{
            uri:
              veterinary.logo_url ??
              veterinary.photo_url ??
              undefined,
          }}
          style={styles.image}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              backgroundColor:
                theme.infoBackground,
            },
          ]}
        >
          <Ionicons
            name="medkit-outline"
            size={26}
            color={theme.info}
          />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            {veterinary.name}
          </Text>
          <Pressable
            onPress={onPress}
            hitSlop={10}
            style={styles.chevronButton}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        <Text
          numberOfLines={2}
          style={[
            styles.address,
            { color: theme.textSecondary },
          ]}
        >
          {veterinary.address}, {veterinary.city}
        </Text>

        <View style={styles.tagsRow}>
          {veterinary.distanceKm !== null ? (
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    theme.warningBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagLabel,
                  { color: theme.warning },
                ]}
              >
                {veterinary.distanceKm.toFixed(1)} km
              </Text>
            </View>
          ) : null}
          {veterinary.is_emergency ? (
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    theme.emergencyBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagLabel,
                  { color: theme.emergency },
                ]}
              >
                Emergencia
              </Text>
            </View>
          ) : null}
          {veterinary.offers_home_visit ? (
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: '#EEF9F2',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagLabel,
                  { color: theme.primaryPressed },
                ]}
              >
                Domicilio
              </Text>
            </View>
          ) : null}

          <View
            style={[
              styles.tag,
              {
                backgroundColor:
                  theme.infoBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.tagLabel,
                { color: theme.info },
              ]}
            >
              {veterinary.is_24_7
                ? '24/7'
                : 'Horario normal'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 22,
  },
  placeholder: {
    width: 92,
    height: 92,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 10,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  chevronButton: {
    paddingTop: 2,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
