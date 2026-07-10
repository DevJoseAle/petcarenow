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
import Ionicons from '@/components/icons/Ionicons';
import { Screen } from '@/components/Screen';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import {
  PetGender,
  PetType,
  petGenderOptions,
  petTypeOptions,
} from '../types/pet.types';
import { usePetDetailScreen } from '../hooks/usePetDetailScreen';
import PetChoiceChip from '../components/PetChoiceChip';
import PetPhotoPickerCard from '../components/PetPhotoPickerCard';

export default function PetDetailScreen() {
  const theme = useTheme();
  const {
    isCreateMode,
    pet,
    name,
    setName,
    petType,
    setPetType,
    gender,
    setGender,
    breed,
    setBreed,
    birthDate,
    weightKg,
    setWeightKg,
    photoURL,
    allergies,
    setAllergies,
    medicalConditions,
    setMedicalConditions,
    breedOptions,
    isBirthDatePickerVisible,
    formattedBirthDateLabel,
    generalError,
    isSubmitting,
    openBirthDatePicker,
    closeBirthDatePicker,
    handleBirthDateChange,
    openPhotoOptions,
    goBack,
    handleCancel,
    handleSave,
    handleDelete,
  } = usePetDetailScreen();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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

        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          {isCreateMode
            ? 'Agregar mascota'
            : `Editar a ${pet?.name ?? 'tu mascota'}`}
        </Text>

        <PetPhotoPickerCard
          photoURL={photoURL}
          onPress={openPhotoOptions}
        />

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
        />

        <Text
          style={[
            styles.label,
            { color: theme.textSecondary },
          ]}
        >
          Tipo
        </Text>
        <View style={styles.rowWrap}>
          {petTypeOptions.map((option) => (
            <PetChoiceChip
              key={option.value}
              label={option.label}
              isSelected={petType === option.value}
              onPress={() => setPetType(option.value)}
            />
          ))}
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.textSecondary },
          ]}
        >
          Sexo
        </Text>
        <View style={styles.rowWrap}>
          {petGenderOptions.map((option) => (
            <PetChoiceChip
              key={option.value}
              label={option.label}
              isSelected={gender === option.value}
              onPress={() =>
                setGender(option.value as PetGender)
              }
            />
          ))}
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.textSecondary },
          ]}
        >
          Raza
        </Text>
        {breedOptions.length > 0 ? (
          <View style={styles.rowWrap}>
            {breedOptions.map((option) => (
              <PetChoiceChip
                key={option.value}
                label={option.label}
                isSelected={breed === option.value}
                onPress={() => setBreed(option.value)}
              />
            ))}
          </View>
        ) : (
          <TextInput
            value={breed}
            onChangeText={setBreed}
            placeholder="Raza"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
          />
        )}

        <Pressable
          onPress={openBirthDatePicker}
          style={[
            styles.dateButton,
            {
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.dateButtonText,
              { color: theme.textPrimary },
            ]}
          >
            {formattedBirthDateLabel}
          </Text>
        </Pressable>
        {isBirthDatePickerVisible ? (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={
                birthDate
                  ? new Date(birthDate)
                  : new Date()
              }
              mode="date"
              maximumDate={new Date()}
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
              onValueChange={(_event, date) =>
                handleBirthDateChange(date)
              }
              onDismiss={closeBirthDatePicker}
            />
          </View>
        ) : null}
        <TextInput
          value={weightKg}
          onChangeText={setWeightKg}
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
        <TextInput
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Alergias separadas por coma"
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
          value={medicalConditions}
          onChangeText={setMedicalConditions}
          placeholder="Condiciones médicas separadas por coma"
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

        <Pressable
          onPress={handleCancel}
          style={styles.cancelButton}
        >
          <Text
            style={[
              styles.cancelText,
              { color: theme.textSecondary },
            ]}
          >
            {isCreateMode ? 'Cancelar' : 'Volver'}
          </Text>
        </Pressable>

        <PrimaryButton
          title={
            isSubmitting
              ? 'Guardando...'
              : isCreateMode
              ? 'Crear mascota'
              : 'Guardar cambios'
          }
          action={handleSave}
          disabled={isSubmitting}
        />

        {!isCreateMode ? (
          <Pressable
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
              Eliminar mascota
            </Text>
          </Pressable>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 16,
  },
});
