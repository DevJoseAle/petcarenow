import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { listCareEvents } from '../services/care-event.service';
import type { CareEvent } from '../types/care-event.types';

export const useCalendarScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [events, setEvents] = useState<CareEvent[]>(
    []
  );
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateEvents = async () => {
    if (!userId) {
      return;
    }

    setIsHydrating(true);
    setGeneralError('');

    try {
      const nextEvents = await listCareEvents(userId);
      setEvents(nextEvents);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar el calendario.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrateEvents();
  }, [userId]);

  return {
    events,
    isHydrating,
    generalError,
    retry: hydrateEvents,
    goToEventEntry: () => router.push('/event-entry'),
  };
};
