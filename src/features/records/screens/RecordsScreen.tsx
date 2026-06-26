import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import PetChoiceChip from '@/features/pets/components/PetChoiceChip';
import HomeCareItem from '@/features/home/components/HomeCareItem';
import SectionState from '@/features/home/components/SectionState';
import { useRecordsScreen } from '../hooks/useRecordsScreen';
import type { PetRecordType } from '../types/record.types';

const recordTypeOptions: Array<{
  value: PetRecordType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'Todos' },
  { value: 'weight', label: 'Peso' },
  { value: 'symptom', label: 'Síntoma' },
  { value: 'medication', label: 'Medicación' },
  { value: 'note', label: 'Nota' },
];

const recordTypeLabel = (type: PetRecordType) => {
  switch (type) {
    case 'weight':
      return 'Peso';
    case 'symptom':
      return 'Síntoma';
    case 'medication':
      return 'Medicación';
    default:
      return 'Nota';
  }
};

const recordTypeIcon = (type: PetRecordType) => {
  switch (type) {
    case 'weight':
      return 'barbell-outline' as const;
    case 'symptom':
      return 'pulse-outline' as const;
    case 'medication':
      return 'medkit-outline' as const;
    default:
      return 'document-text-outline' as const;
  }
};

const recordTypeColor = (type: PetRecordType) => {
  switch (type) {
    case 'weight':
      return '#E9F9EF';
    case 'symptom':
      return '#FFF4E7';
    case 'medication':
      return '#EEF4FF';
    default:
      return '#F4EEFF';
  }
};

export default function RecordsScreen() {
  const theme = useTheme();
  const {
    activePet,
    records,
    selectedType,
    setSelectedType,
    isHydrating,
    isRefreshing,
    generalError,
    retry,
    refresh,
    goToRecordEntry,
    goToRecordDetail,
  } = useRecordsScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
          />
        }
      >
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          Registros
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          Historial de peso, sintomas, medicación y notas
          de {activePet?.name ?? 'tu mascota'}.
        </Text>

        <PrimaryButton
          title="Agregar registro"
          action={() => goToRecordEntry()}
          disabled={!activePet}
        />

        <View style={styles.filters}>
          {recordTypeOptions.map((option) => (
            <PetChoiceChip
              key={option.value}
              label={option.label}
              isSelected={selectedType === option.value}
              onPress={() =>
                setSelectedType(option.value)
              }
            />
          ))}
        </View>

        {isHydrating ? (
          <SectionState
            type="loading"
            message="Cargando registros..."
          />
        ) : generalError ? (
          <SectionState
            type="error"
            message={generalError}
            onRetry={retry}
          />
        ) : records.length === 0 ? (
          <SectionState
            type="empty"
            message="Todavía no tienes registros para esta mascota."
          />
        ) : (
          <View style={styles.list}>
            {records.map((record) => (
              <HomeCareItem
                key={record.id}
                iconName={recordTypeIcon(record.record_type)}
                iconBackground={recordTypeColor(
                  record.record_type
                )}
                title={record.description}
                subtitle={new Intl.DateTimeFormat('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(record.recorded_at))}
                tagLabel={recordTypeLabel(
                  record.record_type
                )}
                onPress={() =>
                  goToRecordDetail(record.id)
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
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  list: {
    gap: 12,
  },
});
