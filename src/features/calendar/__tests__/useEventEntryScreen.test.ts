import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useEventEntryScreen } from '../hooks/useEventEntryScreen';
import {
  createCareEvent,
  updateCareEvent,
} from '../services/care-event.service';
import { syncNotificationsForOwner } from '@/features/notifications/services/notifications.service';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('../services/care-event.service', () => ({
  createCareEvent: jest.fn(),
  getCareEventById: jest.fn(),
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

describe('useEventEntryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      createCareEvent as jest.Mock
    ).mockResolvedValue({
      id: 'event-1',
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
});
