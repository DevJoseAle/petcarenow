import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import VeterinaryListCard from '../components/VeterinaryListCard';
import { useSavedVeterinariesScreen } from '../hooks/useSavedVeterinariesScreen';

export default function SavedVeterinariesScreen() {
  const theme = useTheme();
  const {
    veterinaries,
    isHydrating,
    generalError,
    retry,
    goBack,
    goToProfile,
  } = useSavedVeterinariesScreen();

  return (
    <Screen scroll>
      <View style={styles.content}>
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

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            Veterinarias guardadas
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Revisa las clínicas que marcaste como favoritas para volver a ellas rápido.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando veterinarias guardadas..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : veterinaries.length === 0 ? (
          <SectionState
            type="empty"
            message="Todavía no tienes veterinarias guardadas."
          />
        ) : (
          <View style={styles.list}>
            {veterinaries.map((veterinary) => (
              <VeterinaryListCard
                key={veterinary.id}
                veterinary={{
                  ...veterinary,
                  distanceKm: null,
                }}
                onPress={() =>
                  goToProfile(veterinary.id)
                }
              />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 32,
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
  header: {
    gap: 8,
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
    gap: 14,
  },
});
