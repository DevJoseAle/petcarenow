import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  createPet,
  deletePet,
  updatePet,
} from '../services/pet.service';
import { usePetStore } from '../store/pet.store';
import {
  PetGender,
  PetType,
  catBreedOptions,
  dogBreedOptions,
} from '../types/pet.types';

export const usePetDetailScreen = () => {
  const params = useLocalSearchParams<{
    petId?: string;
    mode?: string;
  }>();
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
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
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] =
    useState('');
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
      const result = await createPet({
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
        weight_kg: weightKg ? Number(weightKg) : null,
        photo_url: null,
        allergies: allergies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        medical_conditions: medicalConditions
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        is_active: true,
      });

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

    const result = await updatePet(pet.id, {
      name: name.trim(),
      pet_type: petType,
      gender:
        gender === PetGender.Unknown ? null : gender,
      breed: breed.trim() || null,
      birth_date: birthDate || null,
      weight_kg: weightKg ? Number(weightKg) : null,
      allergies: allergies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      medical_conditions: medicalConditions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

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
            router.back();
          },
        },
      ]
    );
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
    allergies,
    setAllergies,
    medicalConditions,
    setMedicalConditions,
    breedOptions,
    generalError,
    isSubmitting,
    handleSave,
    handleDelete,
  };
};
