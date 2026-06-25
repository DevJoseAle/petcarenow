import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { createCareEvent } from '../services/care-event.service';
import type { CareEventType } from '../types/care-event.types';

export const useEventEntryScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const { pets, activePetId } = usePetStore();
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    null;
  const [eventType, setEventType] =
    useState<CareEventType>('custom');
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async () => {
    if (!userId || !activePet) {
      setGeneralError(
        'Necesitamos una mascota activa para programar el evento.'
      );
      return;
    }

    if (!title.trim() || !date || !time) {
      setGeneralError(
        'Título, fecha y hora son obligatorios.'
      );
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    await createCareEvent({
      owner_id: userId,
      pet_id: activePet.id,
      event_type: eventType,
      title: title.trim(),
      description: description.trim() || null,
      starts_at: new Date(
        `${date}T${time}:00`
      ).toISOString(),
    });

    setIsSubmitting(false);
    router.back();
  };

  return {
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
  };
};
