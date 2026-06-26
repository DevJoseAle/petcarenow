import { useEffect, useState } from 'react';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  deleteCareEvent,
  getCareEventById,
} from '../services/care-event.service';
import type { CareEvent } from '../types/care-event.types';

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const useEventDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    eventId?: string;
  }>();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [event, setEvent] = useState<CareEvent | null>(
    null
  );
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateEvent = async () => {
    if (!userId || !params.eventId) {
      setGeneralError(
        'No encontramos el evento solicitado.'
      );
      return;
    }

    setIsHydrating(true);
    setGeneralError('');

    try {
      const nextEvent = await getCareEventById(
        userId,
        params.eventId
      );

      if (!nextEvent) {
        setGeneralError(
          'No encontramos el evento solicitado.'
        );
        setEvent(null);
        return;
      }

      setEvent(nextEvent);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar el evento.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    void hydrateEvent();
  }, [params.eventId, userId]);

  const handleDelete = () => {
    if (!userId || !event) {
      return;
    }

    Alert.alert(
      'Eliminar evento',
      `¿Seguro que quieres eliminar "${event.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            setGeneralError('');

            try {
              await deleteCareEvent(userId, event.id);
              router.back();
            } catch (error) {
              setGeneralError(
                error instanceof Error
                  ? error.message
                  : 'No pudimos eliminar el evento.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    event,
    isHydrating,
    isDeleting,
    generalError,
    eventDateTimeLabel: event
      ? formatDateTime(event.starts_at)
      : '',
    retry: hydrateEvent,
    handleBack: () => router.back(),
    goToEdit: () =>
      event
        ? router.push(
            `/event-entry?eventId=${event.id}`
          )
        : undefined,
    handleDelete,
  };
};
