import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import PetChoiceChip from '@/features/pets/components/PetChoiceChip';
import { useRecordEntryScreen } from '../hooks/useRecordEntryScreen';

const recordTypeOptions = [
  { value: 'weight', label: 'Peso' },
  { value: 'symptom', label: 'Síntoma' },
  { value: 'medication', label: 'Medicación' },
  { value: 'note', label: 'Nota' },
] as const;

export default function RecordEntryScreen() {
  const theme = useTheme();
  const {
    title,
    recordType,
    setRecordType,
    date,
    setDate,
    time,
    setTime,
    description,
    setDescription,
    weightValue,
    setWeightValue,
    generalError,
    isSubmitting,
    handleSubmit,
  } = useRecordEntryScreen();

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
          {title}
        </Text>

        <View style={styles.rowWrap}>
          {recordTypeOptions.map((option) => (
            <PetChoiceChip
              key={option.value}
              label={option.label}
              isSelected={recordType === option.value}
              onPress={() =>
                setRecordType(option.value)
              }
            />
          ))}
        </View>

        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="Fecha (YYYY-MM-DD)"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
        />
        <TextInput
          value={time}
          onChangeText={setTime}
          placeholder="Hora (HH:mm)"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
        />
        {recordType === 'weight' ? (
          <TextInput
            value={weightValue}
            onChangeText={setWeightValue}
            placeholder="Peso en kg"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
          />
        ) : null}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            styles.textArea,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          multiline
        />

        {generalError ? (
          <Text style={styles.errorText}>
            {generalError}
          </Text>
        ) : null}

        <PrimaryButton
          title={
            isSubmitting
              ? 'Guardando...'
              : 'Guardar registro'
          }
          action={handleSubmit}
          disabled={isSubmitting}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
