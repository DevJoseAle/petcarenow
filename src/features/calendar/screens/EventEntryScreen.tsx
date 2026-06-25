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
import { useEventEntryScreen } from '../hooks/useEventEntryScreen';

const eventTypeOptions = [
  { value: 'medication', label: 'Medicación' },
  { value: 'consultation', label: 'Consulta' },
  { value: 'deworming', label: 'Desparasitario' },
  { value: 'vaccine', label: 'Vacuna' },
  { value: 'custom', label: 'Otro' },
] as const;

export default function EventEntryScreen() {
  const theme = useTheme();
  const {
    eventType,
    setEventType,
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    generalError,
    isSubmitting,
    handleSubmit,
  } = useEventEntryScreen();

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
          Programar cuidado
        </Text>

        <View style={styles.rowWrap}>
          {eventTypeOptions.map((option) => (
            <PetChoiceChip
              key={option.value}
              label={option.label}
              isSelected={eventType === option.value}
              onPress={() =>
                setEventType(option.value)
              }
            />
          ))}
        </View>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
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

        {generalError ? (
          <Text style={styles.errorText}>
            {generalError}
          </Text>
        ) : null}

        <PrimaryButton
          title={
            isSubmitting
              ? 'Guardando...'
              : 'Guardar evento'
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
