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

interface VeterinaryMapSummaryCardProps {
  veterinary: VeterinaryWithDistance;
  onOpenProfile: () => void;
}

export default function VeterinaryMapSummaryCard({
  veterinary,
  onOpenProfile,
}: VeterinaryMapSummaryCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
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
            size={30}
            color={theme.info}
          />
        </View>
      )}

      <View style={styles.content}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          {veterinary.name}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            styles.address,
            { color: theme.textSecondary },
          ]}
        >
          {veterinary.address}
        </Text>

        <View style={styles.metaRow}>
          {veterinary.distanceKm !== null ? (
            <Text
              style={[
                styles.metaText,
                { color: theme.warning },
              ]}
            >
              {veterinary.distanceKm.toFixed(1)} km
            </Text>
          ) : null}
          {veterinary.is_emergency ? (
            <Text
              style={[
                styles.metaText,
                { color: theme.emergency },
              ]}
            >
              Urgencias
            </Text>
          ) : null}
          {veterinary.offers_home_visit ? (
            <Text
              style={[
                styles.metaText,
                {
                  color:
                    theme.primaryPressed,
                },
              ]}
            >
              Domicilio
            </Text>
          ) : null}
          <Text
            style={[
              styles.metaText,
              { color: theme.info },
            ]}
          >
            {veterinary.is_24_7
              ? '24/7'
              : 'Horario normal'}
          </Text>
        </View>

        <Pressable
          onPress={onOpenProfile}
          style={[
            styles.cta,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        >
          <Text style={styles.ctaLabel}>
            Ver perfil
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: 22,
  },
  placeholder: {
    width: 104,
    height: 104,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cta: {
    marginTop: 2,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
