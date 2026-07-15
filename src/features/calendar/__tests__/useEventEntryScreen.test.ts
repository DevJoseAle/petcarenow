import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import { useEventEntryScreen } from '../hooks/useEventEntryScreen';
import {
  createCareEvent,
  getCareEventUsageSummary,
  updateCareEvent,
} from '../services/care-event.service';
import { syncNotificationsForOwner } from '@/features/notifications/services/notifications.service';

const mockBack = jest.fn();
const mockHydrateSubscription = jest.fn();
const mockSubscriptionState = {
  accessTier: 'free' as const,
  hydrate: mockHydrateSubscription,
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../services/care-event.service', () => ({
  createCareEvent: jest.fn(),
  getCareEventById: jest.fn(),
  getCareEventUsageSummary: jest.fn(),
  updateCareEvent: jest.fn(),
}));

jest.mock('@/features/notifications/services/notifications.service', () => ({
  syncNotificationsForOwner: jest.fn(),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: { id: string } | null;
    }) => unknown
  ) =>
    selector({
      user: { id: 'user-1' },
    }),
}));

jest.mock('@/features/pets/store/pet.store', () => ({
  usePetStore: () => ({
    pets: [
      {
        id: 'pet-1',
        name: 'Luna',
      },
    ],
    activePetId: 'pet-1',
  }),
}));

jest.mock('@/features/subscriptions/store/subscription.store', () => {
  const useSubscriptionStore = (selector?: unknown) => {
    if (typeof selector === 'function') {
      return selector(mockSubscriptionState);
    }

    return mockSubscriptionState;
  };

  useSubscriptionStore.getState = () => mockSubscriptionState;

  return {
    useSubscriptionStore,
  };
});

describe('useEventEntryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscriptionState.accessTier = 'free';
    mockHydrateSubscription.mockResolvedValue(null);
    (
      createCareEvent as jest.Mock
    ).mockResolvedValue({
      id: 'event-1',
    });
    (
      getCareEventUsageSummary as jest.Mock
    ).mockResolvedValue({
      totalEvents: 0,
    });
    (
      updateCareEvent as jest.Mock
    ).mockResolvedValue({
      id: 'event-1',
    });
    (
      syncNotificationsForOwner as jest.Mock
    ).mockResolvedValue(null);
  });

  test('sends reminder_at when creating a care event', async () => {
    const { result } = renderHook(() =>
      useEventEntryScreen()
    );

    act(() => {
      result.current.setTitle('Vacuna anual');
      result.current.setDescription('Recordatorio');
      result.current.handleDateChange(
        new Date('2026-07-08T00:00:00.000Z')
      );
      result.current.handleTimeChange('21:55');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(createCareEvent).toHaveBeenCalledTimes(1);

    const payload = (
      createCareEvent as jest.Mock
    ).mock.calls[0][0];

    expect(payload).toEqual(
      expect.objectContaining({
        owner_id: 'user-1',
        pet_id: 'pet-1',
      })
    );
    expect(payload.reminder_at).toBe(
      payload.starts_at
    );
  });

  test('keeps the selected local date without shifting the day', () => {
    const { result } = renderHook(() =>
      useEventEntryScreen()
    );

    act(() => {
      result.current.handleDateChange(
        new Date(2026, 6, 10, 12, 0, 0)
      );
    });

    expect(result.current.date).toBe('2026-07-10');
    expect(
      result.current.formattedDateLabel
    ).toBe('2026-07-10');
  });

  test('prevents invalid hour input from being stored', () => {
    const { result } = renderHook(() =>
      useEventEntryScreen()
    );

    act(() => {
      result.current.handleTimeChange('3333');
    });

    expect(result.current.time).toBe('');

    act(() => {
      result.current.handleTimeChange('2359');
    });

    expect(result.current.time).toBe('23:59');
  });

  test('blocks creation when the free event limit is reached', async () => {
    (
      getCareEventUsageSummary as jest.Mock
    ).mockResolvedValue({
      totalEvents: 4,
    });

    const { result } = renderHook(() =>
      useEventEntryScreen()
    );

    act(() => {
      result.current.setTitle('Vacuna anual');
      result.current.setDescription('Recordatorio');
      result.current.handleDateChange(
        new Date('2026-07-08T00:00:00.000Z')
      );
      result.current.handleTimeChange('21:55');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(
      useSubscriptionStore.getState().hydrate
    ).toHaveBeenCalledWith('user-1');
    expect(createCareEvent).not.toHaveBeenCalled();
    expect(result.current.generalError).toContain(
      'Tu plan gratuito permite hasta 4 eventos por usuario.'
    );
  });
});
