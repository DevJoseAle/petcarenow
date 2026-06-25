import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import HomeCareItem from '@/features/home/components/HomeCareItem';
import SectionState from '@/features/home/components/SectionState';
import { useCalendarScreen } from '../hooks/useCalendarScreen';

export default function CalendarScreen() {
  const theme = useTheme();
  const {
    events,
    isHydrating,
    generalError,
    retry,
    goToEventEntry,
  } = useCalendarScreen();

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
          Calendario de cuidados
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          Revisa controles, medicaciones y próximos
          eventos.
        </Text>
        <PrimaryButton
          title="Agregar evento"
          action={goToEventEntry}
        />

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando eventos..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : events.length === 0 ? (
          <SectionState
            type="empty"
            message="Todavía no tienes eventos programados."
          />
        ) : (
          <View style={styles.list}>
            {events.map((event) => (
              <HomeCareItem
                key={event.id}
                iconName="calendar-outline"
                iconBackground="#EEF4FF"
                title={event.title}
                subtitle={
                  event.starts_at
                    ? new Intl.DateTimeFormat('es-CL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(event.starts_at))
                    : 'Sin fecha'
                }
              />
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
});
