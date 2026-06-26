import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import Ionicons from '@react-native-vector-icons/ionicons';
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
    isEditMode,
    eventType,
    setEventType,
    title,
    setTitle,
    description,
    setDescription,
    date,
    formattedDateLabel,
    time,
    isDatePickerVisible,
    openDatePicker,
    closeDatePicker,
    handleDateChange,
    handleTimeChange,
    generalError,
    isSubmitting,
    handleBack,
    handleSubmit,
  } = useEventEntryScreen();

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
          {isEditMode
            ? 'Editar evento'
            : 'Programar cuidado'}
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
        <Pressable
          onPress={openDatePicker}
          style={[
            styles.input,
            {
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={{
              color: theme.textPrimary,
              fontSize: 16,
            }}
          >
            {formattedDateLabel}
          </Text>
        </Pressable>
        {isDatePickerVisible ? (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display={
                Platform.OS === 'ios'
                  ? 'inline'
                  : 'default'
              }
              presentation={
                Platform.OS === 'android'
                  ? 'dialog'
                  : 'inline'
              }
              onValueChange={(_event, nextDate) =>
                handleDateChange(nextDate)
              }
              onDismiss={closeDatePicker}
            />
          </View>
        ) : null}
        <TextInput
          value={time}
          onChangeText={handleTimeChange}
          placeholder="Hora (HH:mm)"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          maxLength={5}
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
              : isEditMode
              ? 'Guardar cambios'
              : 'Guardar evento'
          }
          action={handleSubmit}
          disabled={isSubmitting}
        />
        <Pressable
          onPress={handleBack}
          style={styles.secondaryBack}
        >
          <Text
            style={[
              styles.secondaryBackLabel,
              { color: theme.textSecondary },
            ]}
          >
            Volver
          </Text>
        </Pressable>
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
  datePickerWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  secondaryBack: {
    alignSelf: 'center',
    marginTop: 4,
  },
  secondaryBackLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
