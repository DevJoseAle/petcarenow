import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/core/theme/useTheme';
import SectionState from '@/features/home/components/SectionState';
import { useSymptomCheckerHistoryScreen } from '../hooks/useSymptomCheckerHistoryScreen';
import type {
  SymptomCheckerEvaluationRecord,
  SymptomPriority,
} from '../types/symptom-checker.types';

const formatCompletedAt = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
};

const getPriorityCopy = (
  priority: SymptomPriority
) => {
  switch (priority) {
    case 'emergency':
      return 'Emergencia';
    case 'urgent':
      return 'Urgente';
    case 'consult':
      return 'Consulta';
    case 'monitor':
      return 'Monitoreo';
    default:
      return 'Resultado';
  }
};

const getPetTypeLabel = (
  petType: string | null
) => {
  if (petType === 'dog') {
    return 'Perro';
  }

  if (petType === 'cat') {
    return 'Gato';
  }

  return 'Mascota';
};

export default function SymptomCheckerHistoryScreen() {
  const theme = useTheme();
  const {
    records,
    isHydrating,
    error,
    hasRecords,
    retry,
    handleBack,
  } = useSymptomCheckerHistoryScreen();

  return (
    <Screen scroll>
      <View style={styles.content}>
        <Pressable
          onPress={handleBack}
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
            Historial de chequeos
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Aquí quedan las evaluaciones cerradas en
            este dispositivo. También dejamos lista la
            estructura para sincronizarlas luego con
            backend.
          </Text>
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando historial..."
          />
        ) : error ? (
          <SectionState
            type="error"
            message={error}
            onRetry={retry}
          />
        ) : !hasRecords ? (
          <SectionState
            type="empty"
            message="Todavía no has cerrado evaluaciones en Symptom Checker."
          />
        ) : (
          <View style={styles.list}>
            {records.map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const HistoryCard = ({
  record,
  theme,
}: {
  record: SymptomCheckerEvaluationRecord;
  theme: ReturnType<typeof useTheme>;
}) => {
  const isEmergency =
    record.result.priority === 'emergency';
  const isUrgent =
    record.result.priority === 'urgent';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            isEmergency || isUrgent
              ? theme.warningBackground
              : theme.background,
          borderColor: isEmergency
            ? theme.emergency
            : isUrgent
              ? theme.warning
              : theme.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderCopy}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.textPrimary },
            ]}
          >
            {record.symptomLabel}
          </Text>
          <Text
            style={[
              styles.cardSubtitle,
              { color: theme.textSecondary },
            ]}
          >
            {record.petName ?? 'Mascota sin nombre'} ·{' '}
            {getPetTypeLabel(record.petType)}
          </Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor: isEmergency
                ? theme.emergencyBackground
                : isUrgent
                  ? theme.warningBackground
                  : theme.surface,
              borderColor: isEmergency
                ? theme.emergency
                : isUrgent
                  ? theme.warning
                  : theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.priorityBadgeLabel,
              {
                color: isEmergency
                  ? theme.emergency
                  : isUrgent
                    ? theme.warning
                    : theme.textSecondary,
              },
            ]}
          >
            {getPriorityCopy(record.result.priority)}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.summary,
          { color: theme.textPrimary },
        ]}
      >
        {record.result.summary}
      </Text>

      <View style={styles.metaGroup}>
        <MetaRow
          label="Cerrado"
          value={formatCompletedAt(
            record.completedAt
          )}
          theme={theme}
        />
        <MetaRow
          label="Respuestas"
          value={`${record.answers.length} registradas`}
          theme={theme}
        />
        <MetaRow
          label="Sync"
          value={
            record.syncStatus === 'pending'
              ? 'Pendiente para backend'
              : 'Sincronizado'
          }
          theme={theme}
        />
      </View>
    </View>
  );
};

const MetaRow = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.metaRow}>
    <Text
      style={[
        styles.metaLabel,
        { color: theme.textSecondary },
      ]}
    >
      {label}
    </Text>
    <Text
      style={[
        styles.metaValue,
        { color: theme.textPrimary },
      ]}
    >
      {value}
    </Text>
  </View>
);

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
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityBadgeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
  },
  metaGroup: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  metaLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'right',
  },
});
