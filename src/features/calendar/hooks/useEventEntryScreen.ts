import { useEffect, useState } from 'react';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Platform } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import {
  createCareEvent,
  getCareEventById,
  updateCareEvent,
} from '../services/care-event.service';
import { syncNotificationsForOwner } from '@/features/notifications/services/notifications.service';
import type { CareEventType } from '../types/care-event.types';
import {
  buildIsoDateTime,
  formatLocalDateInput,
  formatLocalTimeInput,
  formatHourInput,
  isValidHourInput,
} from '@/core/utils/dateTimeInput';

export const useEventEntryScreen = () => {
  const params = useLocalSearchParams<{
    eventId?: string;
  }>();
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const { pets, activePetId } = usePetStore();
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    null;
  const isEditMode = Boolean(params.eventId);
  const [eventType, setEventType] =
    useState<CareEventType>('custom');
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [
    isDatePickerVisible,
    setIsDatePickerVisible,
  ] = useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    const hydrateEvent = async () => {
      if (!userId || !params.eventId) {
        return;
      }

      try {
        const event = await getCareEventById(
          userId,
          params.eventId
        );

        if (!event) {
          setGeneralError(
            'No encontramos el evento a editar.'
          );
          return;
        }

        setEventType(event.event_type);
        setTitle(event.title);
        setDescription(event.description ?? '');
        setDate(
          formatLocalDateInput(
            new Date(event.starts_at)
          )
        );
        setTime(
          event.starts_at
            ? formatLocalTimeInput(
                new Date(event.starts_at)
              )
            : ''
        );
      } catch (error) {
        setGeneralError(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar el evento.'
        );
      }
    };

    void hydrateEvent();
  }, [params.eventId, userId]);

  const formattedDateLabel = date || 'Seleccionar fecha';

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

    setDate(formatLocalDateInput(nextDate));
    setGeneralError('');

    if (Platform.OS === 'android') {
      closeDatePicker();
    }
  };

  const handleTimeChange = (value: string) => {
    setTime(formatHourInput(value));
    setGeneralError('');
  };

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

    if (!isValidHourInput(time)) {
      setGeneralError(
        'La hora debe tener formato HH:mm.'
      );
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    const startsAt = buildIsoDateTime(date, time);
    const reminderAt = startsAt;

    if (isEditMode && params.eventId) {
      await updateCareEvent(userId, params.eventId, {
        event_type: eventType,
        title: title.trim(),
        description: description.trim() || null,
        starts_at: startsAt,
        reminder_at: reminderAt,
      });
    } else {
      await createCareEvent({
        owner_id: userId,
        pet_id: activePet.id,
        event_type: eventType,
        title: title.trim(),
        description: description.trim() || null,
        starts_at: startsAt,
        reminder_at: reminderAt,
      });
    }

    await syncNotificationsForOwner(userId).catch(
      () => null
    );

    setIsSubmitting(false);
    router.back();
  };

  return {
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
    handleBack: () => router.back(),
    handleSubmit,
  };
};
