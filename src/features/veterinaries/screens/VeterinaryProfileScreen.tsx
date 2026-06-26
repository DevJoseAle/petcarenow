import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useVeterinaryProfileScreen } from '../hooks/useVeterinaryProfileScreen';

export default function VeterinaryProfileScreen() {
  const theme = useTheme();
  const {
    veterinary,
    isHydrating,
    generalError,
    saveError,
    isSaving,
    isSaved,
    goBack,
    retry,
    toggleSaved,
    openMaps,
    callVeterinary,
  } = useVeterinaryProfileScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={theme.textPrimary}
          />
          <Text
            style={[
              styles.backLabel,
              { color: theme.textPrimary },
            ]}
          >
            Volver
          </Text>
        </Pressable>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando veterinaria..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : veterinary ? (
          <>
            {veterinary.photo_url ? (
              <Image
                source={{
                  uri: veterinary.photo_url,
                }}
                style={styles.heroImage}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.heroFallback,
                  {
                    backgroundColor:
                      theme.infoBackground,
                  },
                ]}
              >
                <Ionicons
                  name="medkit-outline"
                  size={36}
                  color={theme.info}
                />
              </View>
            )}

            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: theme.textPrimary },
                ]}
              >
                {veterinary.name}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.textSecondary },
                ]}
              >
                {veterinary.address}, {veterinary.city}
              </Text>
            </View>

            <View
              style={[
                styles.badgesRow,
              ]}
            >
              {veterinary.is_emergency ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        theme.emergencyBackground,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeLabel,
                      {
                        color: theme.emergency,
                      },
                    ]}
                  >
                    Atención de emergencia
                  </Text>
                </View>
              ) : null}

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      theme.infoBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeLabel,
                    { color: theme.info },
                  ]}
                >
                  {veterinary.is_24_7
                    ? 'Disponible 24/7'
                    : 'Horario habitual'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.infoBlock}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Teléfono
                </Text>
                <Text
                  style={[
                    styles.value,
                    { color: theme.textPrimary },
                  ]}
                >
                  {veterinary.phone ??
                    'No disponible'}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Descripción
                </Text>
                <Text
                  style={[
                    styles.value,
                    { color: theme.textPrimary },
                  ]}
                >
                  {veterinary.description ??
                    'Sin descripción disponible.'}
                </Text>
              </View>
            </View>

            {saveError ? (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.emergency },
                ]}
              >
                {saveError}
              </Text>
            ) : null}

            <PrimaryButton
              title={
                isSaving
                  ? 'Guardando...'
                  : isSaved
                  ? 'Quitar de guardadas'
                  : 'Guardar veterinaria'
              }
              action={() => toggleSaved()}
            />
            <PrimaryButton
              title="Abrir en mapas"
              action={() => openMaps()}
            />
            <PrimaryButton
              title="Llamar"
              action={() => callVeterinary()}
            />
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  heroImage: {
    width: '100%',
    height: 240,
    borderRadius: 28,
  },
  heroFallback: {
    width: '100%',
    height: 240,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 18,
  },
  infoBlock: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    lineHeight: 23,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
