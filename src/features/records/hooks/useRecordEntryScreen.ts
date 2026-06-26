import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import {
  createPetRecord,
  getPetRecordById,
  updatePetRecord,
} from '../services/record.service';
import type { PetRecordType } from '../types/record.types';
import {
  formatHourInput,
  isValidHourInput,
} from '@/core/utils/dateTimeInput';

export const useRecordEntryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type?: PetRecordType;
    recordId?: string;
  }>();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const { pets, activePetId } = usePetStore();
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    null;
  const isEditMode = Boolean(params.recordId);
  const [recordType, setRecordType] =
    useState<PetRecordType>(
      params.type ?? 'note'
    );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [
    isDatePickerVisible,
    setIsDatePickerVisible,
  ] = useState(false);
  const [description, setDescription] =
    useState('');
  const [weightValue, setWeightValue] =
    useState('');
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const title = useMemo(() => {
    if (isEditMode) {
      return 'Editar registro';
    }

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
  }, [isEditMode, recordType]);

  const formattedDateLabel =
    date || 'Seleccionar fecha';

  const openDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleDateChange = (nextDate?: Date) => {
    if (!nextDate) {
      closeDatePicker();
      return;
    }

    setDate(nextDate.toISOString().split('T')[0]);
    setGeneralError('');

    if (Platform.OS === 'android') {
      closeDatePicker();
    }
  };

  const handleTimeChange = (value: string) => {
    setTime(formatHourInput(value));
    setGeneralError('');
  };

  useEffect(() => {
    const hydrateRecord = async () => {
      if (!userId || !params.recordId) {
        return;
      }

      try {
        const record = await getPetRecordById(
          userId,
          params.recordId
        );

        if (!record) {
          setGeneralError(
            'No encontramos el registro a editar.'
          );
          return;
        }

        setRecordType(record.record_type);
        setDate(record.recorded_at.split('T')[0] ?? '');
        setTime(
          new Date(record.recorded_at)
            .toISOString()
            .slice(11, 16)
        );
        setDescription(record.description);
        setWeightValue(
          record.value_numeric !== null
            ? String(record.value_numeric)
            : ''
        );
      } catch (error) {
        setGeneralError(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar el registro.'
        );
      }
    };

    void hydrateRecord();
  }, [params.recordId, userId]);

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

    if (!isValidHourInput(time)) {
      setGeneralError(
        'La hora debe tener formato HH:mm.'
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

    const payload = {
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
    };

    if (isEditMode && params.recordId) {
      await updatePetRecord(
        userId,
        params.recordId,
        payload
      );
    } else {
      await createPetRecord({
        owner_id: userId,
        pet_id: activePet.id,
        ...payload,
      });
    }

    setIsSubmitting(false);
    router.back();
  };

  return {
    title,
    isEditMode,
    recordType,
    setRecordType,
    date,
    formattedDateLabel,
    time,
    isDatePickerVisible,
    openDatePicker,
    closeDatePicker,
    handleDateChange,
    handleTimeChange,
    description,
    setDescription,
    weightValue,
    setWeightValue,
    generalError,
    isSubmitting,
    handleBack: () => router.back(),
    handleSubmit,
  };
};
