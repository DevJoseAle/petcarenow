import type { ComponentProps } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Screen } from '@/components/Screen';
import LabeledTextField from '@/components/LabeledTextField';
import PrimaryButton from '@/components/PrimaryButton';
import TouchableText from '@/components/TouchableText';
import { useTheme } from '@/core/theme/useTheme';
import PetMetricStepper from '../components/PetMetricStepper';
import PetChoiceChip from '../components/PetChoiceChip';
import PetPhotoPickerCard from '../components/PetPhotoPickerCard';
import PetStepHeader from '../components/PetStepHeader';
import PetSummaryCard from '../components/PetSummaryCard';
import { usePetOnboardingScreen } from '../hooks/usePetOnboardingScreen';
import {
  petTypeOptions,
  dogBreedOptions,
  catBreedOptions,
  PetType,
  petGenderOptions,
} from '../types/pet.types';

export default function PetOnboardingScreen() {
  const theme = useTheme();
  const {
    currentStep,
    totalSteps,
    progressStep,
    isIntroStep,
    form,
    errors,
    generalError,
    isSubmitting,
    isLastStep,
    breedOptions,
    healthOptions,
    isBirthDatePickerVisible,
    formattedBirthDateLabel,
    approximateHumanAgeLabel,
    healthSummary,
    setFieldValue,
    goToPreviousStep,
    goToNextStep,
    openBirthDatePicker,
    closeBirthDatePicker,
    handleBirthDateChange,
    toggleHealthOption,
    incrementWeight,
    decrementWeight,
    openPhotoOptions,
  } = usePetOnboardingScreen();

  const petTypeLabel =
    petTypeOptions.find(
      (option) => option.value === form.petType
    )?.label ?? '—';
  const petGenderLabel =
    petGenderOptions.find(
      (option) => option.value === form.gender
    )?.label ?? '—';
  const breedLabel =
    [...dogBreedOptions, ...catBreedOptions].find(
      (option) => option.value === form.breed
    )?.label ??
    form.breed ??
    '—';

  const renderStepContent = () => {
    if (isIntroStep) {
      return (
        <View style={styles.introHero}>
          <View style={styles.introBadge}>
            <Ionicons
              name="paw-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.introTitle}>
            Conozcamos{'\n'}a tu mascota
          </Text>
          <Text style={styles.introSubtitle}>
            Te tomará solo 1 minuto.{'\n'}
            Después crearemos su plan de
            cuidado.
          </Text>
          <View style={styles.introBenefits}>
            <View style={styles.benefitItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.benefit}>
                1 minuto
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.benefit}>
                Privado
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.benefit}>
                Personalizado
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <PetStepHeader
            step={progressStep}
            totalSteps={totalSteps}
            iconName="hand-left-outline"
            title="¿Cómo se llama tu compañero?"
            subtitle="El nombre y tipo de mascota"
          />
          <LabeledTextField
            label="Nombre"
            placeholder="Ej: Max, Luna, Coco..."
            leftIconName="paw"
            value={form.name}
            onChangeText={(value) =>
              setFieldValue('name', value)
            }
            secureTextEntry={false}
            rightIconAction={() => {}}
            error={errors.name}
          />
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.textSecondary },
            ]}
          >
            TIPO
          </Text>
          <View style={styles.chipsRow}>
            {petTypeOptions.map((option) => (
              <PetChoiceChip
                key={option.value}
                label={option.label}
                isSelected={
                  form.petType === option.value
                }
                onPress={() =>
                  setFieldValue(
                    'petType',
                    option.value
                  )
                }
              />
            ))}
          </View>
          {errors.petType ? (
            <Text style={styles.errorText}>
              {errors.petType}
            </Text>
          ) : null}
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <PetStepHeader
            step={progressStep}
            totalSteps={totalSteps}
            iconName="paw-outline"
            title="¿Qué raza y sexo tiene?"
            subtitle="La raza nos ayuda a personalizar su cuidado"
          />

          {form.petType === PetType.Dog ||
          form.petType === PetType.Cat ? (
            <>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.textSecondary },
                ]}
              >
                RAZA
              </Text>
              <View style={styles.chipsRow}>
                {breedOptions.map((option) => (
                  <PetChoiceChip
                    key={option.value}
                    label={option.label}
                    isSelected={
                      form.breed === option.value
                    }
                    onPress={() =>
                      setFieldValue(
                        'breed',
                        option.value
                      )
                    }
                  />
                ))}
              </View>
              {errors.breed ? (
                <Text style={styles.errorText}>
                  {errors.breed}
                </Text>
              ) : null}
            </>
          ) : (
            <LabeledTextField
              label="Raza"
              placeholder="Escribe la raza"
              leftIconName="list"
              value={form.breed}
              onChangeText={(value) =>
                setFieldValue('breed', value)
              }
              secureTextEntry={false}
              rightIconAction={() => {}}
              error={errors.breed}
            />
          )}
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.textSecondary },
            ]}
          >
            SEXO
          </Text>
          <View style={styles.chipsRow}>
            {petGenderOptions.map((option) => (
              <PetChoiceChip
                key={option.value}
                label={option.label}
                isSelected={
                  form.gender === option.value
                }
                onPress={() =>
                  setFieldValue(
                    'gender',
                    option.value
                  )
                }
              />
            ))}
          </View>
          {errors.gender ? (
            <Text style={styles.errorText}>
              {errors.gender}
            </Text>
          ) : null}
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <PetStepHeader
            step={progressStep}
            totalSteps={totalSteps}
            iconName="calendar-outline"
            title="¿Cuándo nació tu mascota?"
            subtitle="Usaremos esta fecha para calcular su edad"
          />
          <Pressable
            onPress={openBirthDatePicker}
            style={[
              styles.dateButton,
              { borderColor: theme.border },
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
          {errors.birthDate ? (
            <Text style={styles.errorText}>
              {errors.birthDate}
            </Text>
          ) : null}
          {approximateHumanAgeLabel ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                {approximateHumanAgeLabel}
              </Text>
            </View>
          ) : null}
          {isBirthDatePickerVisible ? (
            <View style={styles.datePickerWrapper}>
              <DateTimePicker
                value={
                  form.birthDate
                    ? new Date(form.birthDate)
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
        </>
      );
    }

    if (currentStep === 4) {
      return (
        <>
          <PetStepHeader
            step={progressStep}
            totalSteps={totalSteps}
            iconName="barbell-outline"
            title="¿Cuánto pesa tu mascota?"
            subtitle="El peso nos ayuda a detectar cambios importantes"
          />
          <PetMetricStepper
            value={form.weightKg}
            suffix="kg"
            onIncrement={incrementWeight}
            onDecrement={decrementWeight}
          />
          {errors.weightKg ? (
            <Text style={styles.errorText}>
              {errors.weightKg}
            </Text>
          ) : null}
          {form.weightKg ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Peso registrado correctamente
              </Text>
            </View>
          ) : null}
        </>
      );
    }

    if (currentStep === 5) {
      return (
        <>
          <PetStepHeader
            step={progressStep}
            totalSteps={totalSteps}
            iconName="medkit-outline"
            title="¿Tiene alguna condición de salud?"
            subtitle="Puedes seleccionar más de una"
          />
          <View style={styles.chipsRow}>
            <PetChoiceChip
              label="Ninguna"
              isSelected={
                form.healthStatus === 'none'
              }
              iconName="checkmark-circle-outline"
              onPress={() => {
                setFieldValue(
                  'healthStatus',
                  'none'
                );
                setFieldValue(
                  'selectedAllergies',
                  []
                );
                setFieldValue(
                  'selectedMedicalConditions',
                  []
                );
              }}
            />
            {healthOptions.map((option) => {
              const isSelected =
                option.category === 'allergy'
                  ? form.selectedAllergies.includes(
                      option.label
                    )
                  : form.selectedMedicalConditions.includes(
                      option.label
                    );

              return (
                <PetChoiceChip
                  key={option.id}
                  label={option.label}
                  isSelected={isSelected}
                  iconName={
                    option.iconName as ComponentProps<
                      typeof Ionicons
                    >['name']
                  }
                  onPress={() =>
                    toggleHealthOption(option)
                  }
                />
              );
            })}
          </View>
          {errors.healthStatus ? (
            <Text style={styles.errorText}>
              {errors.healthStatus}
            </Text>
          ) : null}
        </>
      );
    }

    return (
      <>
        <PetStepHeader
          step={progressStep}
          totalSteps={totalSteps}
          iconName="images-outline"
          title="Foto y resumen de tu mascota"
          subtitle="Confirma la información y agrega su foto para completar el perfil"
        />
        <PetPhotoPickerCard
          photoURL={form.photoURL}
          onPress={openPhotoOptions}
        />
        {errors.photoURL ? (
          <Text style={styles.errorText}>
            {errors.photoURL}
          </Text>
        ) : null}
        <PetSummaryCard
          rows={[
            {
              label: 'Nombre',
              value: form.name || '—',
            },
            {
              label: 'Tipo',
              value: petTypeLabel,
            },
            {
              label: 'Raza',
              value: breedLabel,
            },
            {
              label: 'Sexo',
              value: petGenderLabel,
            },
            {
              label: 'Nacimiento',
              value: formattedBirthDateLabel,
            },
            {
              label: 'Peso',
              value: form.weightKg
                ? `${form.weightKg} kg`
                : '—',
            },
            {
              label: 'Salud',
              value: healthSummary.join(', '),
            },
          ]}
        />
      </>
    );
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        {renderStepContent()}

        {generalError ? (
          <Text style={styles.errorText}>
            {generalError}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton
            title={
              isIntroStep
                ? 'Comenzar →'
                : isLastStep
                ? isSubmitting
                  ? 'Guardando...'
                  : 'Guardar Mascota'
                : 'Continuar'
            }
            action={goToNextStep}
            disabled={isSubmitting}
          />
          {!isIntroStep ? (
            <TouchableText
              title="Volver"
              action={goToPreviousStep}
              alignment="center"
            />
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  introHero: {
    backgroundColor: '#1F6B49',
    borderRadius: 34,
    paddingHorizontal: 28,
    paddingVertical: 34,
    marginBottom: 28,
    minHeight: 520,
    justifyContent: 'center',
  },
  introBadge: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 26,
    alignSelf: 'center',
  },
  introTitle: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
  },
  introSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  introBenefits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefit: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1.1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 16,
  },
  dateButton: {
    borderWidth: 1.2,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  datePickerWrapper: {
    marginTop: 14,
  },
  infoCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8EFE5',
    backgroundColor: '#F6FBF9',
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#2F9D6E',
    fontWeight: '600',
  },
});
