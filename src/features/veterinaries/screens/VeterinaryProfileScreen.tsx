import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    retry,
    isSaved,
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
            <Text
              style={[
                styles.title,
                { color: theme.textPrimary },
              ]}
            >
              {veterinary.name}
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.value}>
                {veterinary.address}, {veterinary.city}
              </Text>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>
                {veterinary.phone ?? 'No disponible'}
              </Text>
              <Text style={styles.label}>
                Emergencia
              </Text>
              <Text style={styles.value}>
                {veterinary.is_emergency
                  ? 'Sí'
                  : 'No'}
              </Text>
              <Text style={styles.label}>Horario</Text>
              <Text style={styles.value}>
                {veterinary.is_24_7
                  ? '24/7'
                  : 'Horario habitual'}
              </Text>
              <Text style={styles.label}>
                Descripción
              </Text>
              <Text style={styles.value}>
                {veterinary.description ??
                  'Sin descripción'}
              </Text>
            </View>
            <PrimaryButton
              title={
                isSaved
                  ? 'Quitar de guardadas'
                  : 'Guardar veterinaria'
              }
              action={() => toggleSaved()}
            />
            <PrimaryButton
              title="Abrir mapa"
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
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  label: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: '#111827',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
});
