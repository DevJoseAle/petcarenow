import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import { evaluatePetCreationAccess } from '@/features/subscriptions/services/subscription-access.service';
import {
  createPet,
  deletePet,
  getPetUsageSummary,
  updatePet,
} from '../services/pet.service';
import {
  pickPetPhotoFromLibrary,
  takePetPhoto,
} from '../services/pet-media.service';
import { usePetStore } from '../store/pet.store';
import {
  PetGender,
  PetType,
  catBreedOptions,
  dogBreedOptions,
} from '../types/pet.types';
import { formatBirthDateLabel } from '../utils/pet.validators';

export const usePetDetailScreen = () => {
  const params = useLocalSearchParams<{
    petId?: string;
    mode?: string;
  }>();
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const hydrateSubscription =
    useSubscriptionStore(
      (state) => state.hydrate
    );
  const {
    pets,
    upsertPet,
    removePet,
    activePetId,
    selectPet,
  } = usePetStore();
  const isCreateMode = params.mode === 'create';
  const pet =
    pets.find((item) => item.id === params.petId) ??
    pets.find((item) => item.id === activePetId) ??
    null;
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<PetType>(
    PetType.Dog
  );
  const [gender, setGender] = useState<PetGender>(
    PetGender.Unknown
  );
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [photoBase64, setPhotoBase64] =
    useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] =
    useState<string | null>(null);
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] =
    useState('');
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [
    isBirthDatePickerVisible,
    setIsBirthDatePickerVisible,
  ] = useState(false);

  useEffect(() => {
    if (!pet || isCreateMode) {
      return;
    }

    setName(pet.name);
    setPetType(pet.pet_type);
    setGender(pet.gender ?? PetGender.Unknown);
    setBreed(pet.breed ?? '');
    setBirthDate(pet.birth_date ?? '');
    setWeightKg(
      pet.weight_kg !== null
        ? String(pet.weight_kg)
        : ''
    );
    setPhotoURL(pet.photo_url ?? '');
    setPhotoBase64(null);
    setPhotoMimeType(null);
    setAllergies(pet.allergies.join(', '));
    setMedicalConditions(
      pet.medical_conditions.join(', ')
    );
  }, [isCreateMode, pet]);

  const breedOptions = useMemo(() => {
    if (petType === PetType.Dog) {
      return dogBreedOptions;
    }

    if (petType === PetType.Cat) {
      return catBreedOptions;
    }

    return [];
  }, [petType]);

  const formattedBirthDateLabel =
    formatBirthDateLabel(birthDate);

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

    setBirthDate(
      date.toISOString().split('T')[0]
    );
    setGeneralError('');

    if (Platform.OS === 'android') {
      closeBirthDatePicker();
    }
  };

  const updatePhotoState = ({
    uri,
    base64,
    mimeType,
  }: {
    uri: string;
    base64: string | null;
    mimeType: string | null;
  }) => {
    setPhotoURL(uri);
    setPhotoBase64(base64);
    setPhotoMimeType(mimeType);
    setGeneralError('');
  };

  const handlePhotoResult = async (
    action: () => Promise<{
      success: boolean;
      uri: string | null;
      base64: string | null;
      mimeType: string | null;
      error?: string;
    }>
  ) => {
    const result = await action();

    if (!result.success) {
      if (result.error) {
        setGeneralError(result.error);
      }

      return;
    }

    if (!result.uri) {
      setGeneralError(
        'No pudimos obtener la foto seleccionada.'
      );
      return;
    }

    updatePhotoState({
      uri: result.uri,
      base64: result.base64,
      mimeType: result.mimeType,
    });
  };

  const openPhotoOptions = () => {
    Alert.alert(
      'Foto de mascota',
      'Elige cómo quieres actualizar la foto.',
      [
        {
          text: 'Tomar foto',
          onPress: () => {
            void handlePhotoResult(takePetPhoto);
          },
        },
        {
          text: 'Elegir desde galería',
          onPress: () => {
            void handlePhotoResult(
              pickPetPhotoFromLibrary
            );
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!userId) {
      setGeneralError(
        'No pudimos identificar al usuario.'
      );
      return;
    }

    if (!name.trim()) {
      setGeneralError(
        'El nombre de la mascota es obligatorio.'
      );
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    if (isCreateMode) {
      try {
        await hydrateSubscription(userId);

        const accessTier =
          useSubscriptionStore.getState().accessTier;
        const usage =
          await getPetUsageSummary(userId);
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
        {
          owner_id: userId,
          name: name.trim(),
          pet_type: petType,
          gender:
            gender === PetGender.Unknown
              ? null
              : gender,
          breed: breed.trim() || null,
          birth_date: birthDate || null,
          age_years: null,
          weight_kg: weightKg
            ? Number(weightKg)
            : null,
          photo_url: null,
          allergies: allergies
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          medical_conditions:
            medicalConditions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
          is_active: true,
        },
        {
          localPhotoUri: photoURL || undefined,
          localPhotoBase64:
            photoBase64 ?? undefined,
          localPhotoMimeType:
            photoMimeType ?? undefined,
        }
      );

      setIsSubmitting(false);

      if (!result.success) {
        setGeneralError(result.error.message);
        return;
      }

      upsertPet(result.data);
      selectPet(result.data.id);
      router.back();
      return;
    }

    if (!pet) {
      setIsSubmitting(false);
      setGeneralError(
        'No encontramos la mascota a editar.'
      );
      return;
    }

    const hasNewLocalPhoto =
      Boolean(photoBase64) ||
      photoURL.startsWith('file:');

    const result = await updatePet(
      pet.id,
      {
        name: name.trim(),
        pet_type: petType,
        gender:
          gender === PetGender.Unknown
            ? null
            : gender,
        breed: breed.trim() || null,
        birth_date: birthDate || null,
        weight_kg: weightKg
          ? Number(weightKg)
          : null,
        allergies: allergies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        medical_conditions:
          medicalConditions
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
      },
      hasNewLocalPhoto
        ? {
            ownerId: userId,
            localPhotoUri: photoURL,
            localPhotoBase64:
              photoBase64 ?? undefined,
            localPhotoMimeType:
              photoMimeType ?? undefined,
          }
        : undefined
    );

    setIsSubmitting(false);

    if (!result.success) {
      setGeneralError(result.error.message);
      return;
    }

    upsertPet(result.data);
    router.back();
  };

  const handleDelete = () => {
    if (!pet) {
      return;
    }

    Alert.alert(
      'Eliminar mascota',
      `¿Seguro que quieres eliminar a ${pet.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePet(pet.id);

            if (!result.success) {
              setGeneralError(result.error.message);
              return;
            }

            removePet(pet.id);
            const remainingPets = usePetStore
              .getState()
              .pets;

            if (remainingPets.length === 0) {
              router.replace('/(app)/(tabs)');
              return;
            }

            router.back();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return {
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
    goBack: () => router.back(),
    handleCancel,
    handleSave,
    handleDelete,
  };
};
