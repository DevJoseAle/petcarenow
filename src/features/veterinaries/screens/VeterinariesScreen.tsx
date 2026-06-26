import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useVeterinariesScreen } from '../hooks/useVeterinariesScreen';

export default function VeterinariesScreen() {
  const theme = useTheme();
  const {
    mode,
    veterinaries,
    isHydrating,
    generalError,
    retry,
    goToProfile,
  } = useVeterinariesScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          {mode === 'map'
            ? 'Veterinarias cercanas'
            : 'Listado de veterinarias'}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          {mode === 'map'
            ? 'Vista placeholder de mapa. Mientras tanto te mostramos las clínicas disponibles.'
            : 'Explora veterinarias y centros de urgencia.'}
        </Text>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando veterinarias..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : (
          <View style={styles.list}>
            {veterinaries.map((veterinary) => (
              <Pressable
                key={veterinary.id}
                onPress={() =>
                  goToProfile(veterinary.id)
                }
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  {veterinary.name}
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {veterinary.address}, {veterinary.city}
                </Text>
                <Text
                  style={[
                    styles.cardMeta,
                    { color: theme.textSecondary },
                  ]}
                >
                  {veterinary.is_emergency
                    ? 'Emergencias disponibles'
                    : 'Atención general'}{' '}
                  •{' '}
                  {veterinary.is_24_7
                    ? '24/7'
                    : 'Horario normal'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
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
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 15,
  },
  cardMeta: {
    fontSize: 14,
  },
});
