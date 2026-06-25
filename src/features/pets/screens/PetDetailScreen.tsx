import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
    setBirthDate,
    weightKg,
    setWeightKg,
    allergies,
    setAllergies,
    medicalConditions,
    setMedicalConditions,
    breedOptions,
    generalError,
    isSubmitting,
    handleSave,
    handleDelete,
  } = usePetDetailScreen();

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
          {isCreateMode
            ? 'Agregar mascota'
            : `Editar a ${pet?.name ?? 'tu mascota'}`}
        </Text>

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

        <TextInput
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="Fecha de nacimiento (YYYY-MM-DD)"
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
