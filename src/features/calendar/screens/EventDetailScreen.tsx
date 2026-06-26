import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useEventDetailScreen } from '../hooks/useEventDetailScreen';

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default function EventDetailScreen() {
  const theme = useTheme();
  const {
    event,
    isHydrating,
    isDeleting,
    generalError,
    eventDateTimeLabel,
    retry,
    handleBack,
    goToEdit,
    handleDelete,
  } = useEventDetailScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={theme.textPrimary}
          />
          <Text
            style={[
              styles.backLabel,
              { color: theme.textPrimary },
            ]}
          >
            Atrás
          </Text>
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          Detalle del evento
        </Text>

        {isHydrating ? (
          <Text
            style={[
              styles.stateText,
              { color: theme.textSecondary },
            ]}
          >
            Cargando evento...
          </Text>
        ) : generalError && !event ? (
          <>
            <Text style={styles.errorText}>
              {generalError}
            </Text>
            <PrimaryButton
              title="Reintentar"
              action={retry}
            />
          </>
        ) : event ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <DetailRow
              label="Tipo"
              value={event.event_type}
            />
            <DetailRow
              label="Título"
              value={event.title}
            />
            <DetailRow
              label="Fecha y hora"
              value={eventDateTimeLabel}
            />
            <DetailRow
              label="Estado"
              value={event.status}
            />
            <DetailRow
              label="Descripción"
              value={
                event.description || 'Sin descripción'
              }
            />
          </View>
        ) : null}

        {generalError && event ? (
          <Text style={styles.errorText}>
            {generalError}
          </Text>
        ) : null}

        <PrimaryButton
          title="Editar evento"
          action={() => goToEdit()}
          disabled={!event || isDeleting}
        />
        <PrimaryButton
          title={
            isDeleting
              ? 'Eliminando...'
              : 'Eliminar evento'
          }
          action={handleDelete}
          disabled={!event || isDeleting}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  detailRow: {
    gap: 6,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  detailValue: {
    color: '#111827',
    fontSize: 16,
    lineHeight: 22,
  },
  stateText: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
