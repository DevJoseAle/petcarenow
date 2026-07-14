import {
  useMemo,
  useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import { evaluatePetCreationAccess } from '@/features/subscriptions/services/subscription-access.service';
import { createPet } from '../services/pet.service';
import { getPetUsageSummary } from '../services/pet.service';
import {
  pickPetPhotoFromLibrary,
  takePetPhoto,
} from '../services/pet-media.service';
import { usePetOnboardingGateStore } from '../store/petOnboardingGate.store';
import {
  catBreedOptions,
  dogBreedOptions,
  petHealthOptions,
  type PetOption,
  type PetHealthOption,
  PetType,
} from '../types/pet.types';
import {
  calculateAgeYearsFromBirthDate,
  formatBirthDateLabel,
  getApproximateHumanAgeLabel,
  getHealthSummary,
  initialPetOnboardingFormState,
  sanitizePetPayload,
  validatePetOnboardingStep,
  type PetOnboardingErrors,
  type PetOnboardingFormState,
} from '../utils/pet.validators';

const totalSteps = 6;

export const usePetOnboardingScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrateSubscription =
    useSubscriptionStore(
      (state) => state.hydrate
    );
  const markHasPets =
    usePetOnboardingGateStore(
      (state) => state.markHasPets
    );
  const [currentStep, setCurrentStep] =
    useState(0);
  const [form, setForm] =
    useState<PetOnboardingFormState>(
      initialPetOnboardingFormState
    );
  const [errors, setErrors] =
    useState<PetOnboardingErrors>({});
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [
    isBirthDatePickerVisible,
    setIsBirthDatePickerVisible,
  ] = useState(false);

  const breedOptions = useMemo<
    PetOption<string>[]
  >(() => {
    if (form.petType === PetType.Dog) {
      return dogBreedOptions;
    }

    if (form.petType === PetType.Cat) {
      return catBreedOptions;
    }

    return [];
  }, [form.petType]);

  const healthOptions = useMemo<
    PetHealthOption[]
  >(() => petHealthOptions, []);

  const isLastStep =
    currentStep === totalSteps;
  const isIntroStep = currentStep === 0;
  const progressStep = Math.max(
    currentStep,
    1
  );
  const formattedBirthDateLabel =
    formatBirthDateLabel(form.birthDate);
  const approximateHumanAgeLabel =
    getApproximateHumanAgeLabel(
      form.ageYears
    );
  const healthSummary = getHealthSummary(form);

  const setFieldValue = <
    T extends keyof PetOnboardingFormState
  >(
    field: T,
    value: PetOnboardingFormState[T]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setGeneralError('');
  };

  const setBirthDate = (date: Date) => {
    const birthDate = date
      .toISOString()
      .split('T')[0];

    setForm((current) => ({
      ...current,
      birthDate,
      ageYears:
        calculateAgeYearsFromBirthDate(
          birthDate
        ),
    }));
    setErrors((current) => ({
      ...current,
      birthDate: undefined,
    }));
    setGeneralError('');
  };

  const validateCurrentStep = () => {
    const nextErrors =
      validatePetOnboardingStep(
        currentStep,
        form
      );
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToPreviousStep = () => {
    if (currentStep === 0 || isSubmitting) {
      return;
    }

    setCurrentStep((current) => current - 1);
  };

  const goToNextStep = async () => {
    if (isSubmitting) {
      return;
    }

    if (isIntroStep) {
      setCurrentStep(1);
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    if (!isLastStep) {
      setCurrentStep((current) => current + 1);
      return;
    }

    if (!user?.id) {
      setGeneralError(
        'No pudimos identificar al usuario actual.'
      );
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    try {
      await hydrateSubscription(user.id);

      const accessTier =
        useSubscriptionStore.getState().accessTier;
      const usage =
        await getPetUsageSummary(user.id);
      const decision =
        evaluatePetCreationAccess({
          accessTier,
          usage,
        });

      if (decision.status === 'blocked_by_plan') {
        setIsSubmitting(false);
        setGeneralError(decision.message);
        Alert.alert(
          'Límite del plan gratuito',
          decision.message,
          [
            {
              text: 'Más tarde',
              style: 'cancel',
            },
            {
              text: 'Ver Premium',
              onPress: () =>
                router.push('/subscription'),
            },
          ]
        );
        return;
      }
    } catch (error) {
      setIsSubmitting(false);
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos validar tu plan.'
      );
      return;
    }

    const result = await createPet(
      sanitizePetPayload(user.id, form),
      {
        localPhotoUri: form.photoURL,
        localPhotoBase64: form.photoBase64,
        localPhotoMimeType:
          form.photoMimeType,
      }
    );

    setIsSubmitting(false);

    if (!result.success) {
      if (result.partialData) {
        Alert.alert(
          'Mascota creada',
          result.error.message
        );
        markHasPets();
        router.replace('/(app)/(tabs)');
        return;
      }

      setGeneralError(result.error.message);
      return;
    }

    markHasPets();
    router.replace('/(app)/(tabs)');
  };

  const openBirthDatePicker = () => {
    setIsBirthDatePickerVisible(true);
  };

  const closeBirthDatePicker = () => {
    setIsBirthDatePickerVisible(false);
  };

  const handleBirthDateChange = (
    date?: Date
  ) => {
    if (!date) {
      closeBirthDatePicker();
      return;
    }

    setBirthDate(date);

    if (Platform.OS === 'android') {
      closeBirthDatePicker();
    }
  };

  const toggleHealthOption = (
    option: PetHealthOption
  ) => {
    if (option.category === 'allergy') {
      const current =
        form.selectedAllergies.includes(
          option.label
        );

      setFieldValue(
        'selectedAllergies',
        current ? [] : [option.label]
      );
      setFieldValue(
        'healthStatus',
        current ? 'unset' : 'selected'
      );
      return;
    }

    const alreadySelected =
      form.selectedMedicalConditions.includes(
        option.label
      );

    setFieldValue(
      'selectedMedicalConditions',
      alreadySelected
        ? form.selectedMedicalConditions.filter(
            (item) => item !== option.label
          )
        : [
            ...form.selectedMedicalConditions,
            option.label,
          ]
    );
    const nextMedicalConditions =
      alreadySelected
        ? form.selectedMedicalConditions.filter(
            (item) => item !== option.label
          )
        : [
            ...form.selectedMedicalConditions,
            option.label,
          ];
    const hasSelections =
      form.selectedAllergies.length > 0 ||
      nextMedicalConditions.length > 0;
    setFieldValue(
      'healthStatus',
      hasSelections ? 'selected' : 'unset'
    );
  };

  const incrementWeight = () => {
    const current =
      Number(form.weightKg || '0') || 0;
    setFieldValue(
      'weightKg',
      String(current + 1)
    );
  };

  const decrementWeight = () => {
    const current =
      Number(form.weightKg || '0') || 0;
    const nextValue = Math.max(0, current - 1);
    setFieldValue(
      'weightKg',
      nextValue === 0
        ? ''
        : String(nextValue)
    );
  };

  const openPhotoOptions = () => {
    Alert.alert(
      'Foto de tu mascota',
      'Elige cómo quieres agregar la foto.',
      [
        {
          text: 'Tomar foto',
          onPress: async () => {
            const result =
              await takePetPhoto();

            if (result.success && result.uri) {
              setFieldValue('photoURL', result.uri);
              setFieldValue(
                'photoBase64',
                result.base64 ?? ''
              );
              setFieldValue(
                'photoMimeType',
                result.mimeType ?? 'image/jpeg'
              );
              return;
            }

            if (result.error) {
              setGeneralError(result.error);
            }
          },
        },
        {
          text: 'Elegir desde galería',
          onPress: async () => {
            const result =
              await pickPetPhotoFromLibrary();

            if (result.success && result.uri) {
              setFieldValue('photoURL', result.uri);
              setFieldValue(
                'photoBase64',
                result.base64 ?? ''
              );
              setFieldValue(
                'photoMimeType',
                result.mimeType ?? 'image/jpeg'
              );
              return;
            }

            if (result.error) {
              setGeneralError(result.error);
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return {
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
    setBirthDate,
    goToPreviousStep,
    goToNextStep,
    openBirthDatePicker,
    closeBirthDatePicker,
    handleBirthDateChange,
    toggleHealthOption,
    incrementWeight,
    decrementWeight,
    openPhotoOptions,
  };
};
