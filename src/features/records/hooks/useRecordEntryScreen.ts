import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { createPetRecord } from '../services/record.service';
import type { PetRecordType } from '../types/record.types';

export const useRecordEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: PetRecordType;
  }>();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const { pets, activePetId } = usePetStore();
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    null;
  const [recordType, setRecordType] =
    useState<PetRecordType>(
      params.type ?? 'note'
    );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] =
    useState('');
  const [weightValue, setWeightValue] =
    useState('');
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const title = useMemo(() => {
    switch (recordType) {
      case 'weight':
        return 'Registrar peso';
      case 'symptom':
        return 'Registrar síntoma';
      case 'medication':
        return 'Registrar medicación';
      default:
        return 'Agregar nota';
    }
  }, [recordType]);

  const handleSubmit = async () => {
    if (!userId || !activePet) {
      setGeneralError(
        'Necesitamos una mascota activa para registrar esta acción.'
      );
      return;
    }

    if (!date || !time || !description.trim()) {
      setGeneralError(
        'Fecha, hora y descripción son obligatorias.'
      );
      return;
    }

    if (recordType === 'weight' && !weightValue) {
      setGeneralError(
        'El peso es obligatorio para este registro.'
      );
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    await createPetRecord({
      owner_id: userId,
      pet_id: activePet.id,
      record_type: recordType,
      recorded_at: new Date(
        `${date}T${time}:00`
      ).toISOString(),
      description: description.trim(),
      value_numeric:
        recordType === 'weight'
          ? Number(weightValue)
          : null,
      value_unit:
        recordType === 'weight' ? 'kg' : null,
    });

    setIsSubmitting(false);
    router.back();
  };

  return {
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
  };
};
