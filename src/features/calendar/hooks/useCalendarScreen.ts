import { useCallback, useState } from 'react';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';
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
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateEvents = async (
    options?: { refresh?: boolean }
  ) => {
    if (!userId) {
      return;
    }

    if (options?.refresh) {
      setIsRefreshing(true);
    } else {
      setIsHydrating(true);
    }
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
      if (options?.refresh) {
        setIsRefreshing(false);
      } else {
        setIsHydrating(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      void hydrateEvents();
    }, [userId])
  );

  return {
    events,
    isHydrating,
    isRefreshing,
    generalError,
    retry: hydrateEvents,
    refresh: () =>
      hydrateEvents({ refresh: true }),
    goToEventEntry: () => router.push('/event-entry'),
    goToEventDetail: (eventId: string) =>
      router.push(`/event-detail?eventId=${eventId}`),
  };
};
