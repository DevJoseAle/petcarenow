import {
  act,
  renderHook,
} from '@testing-library/react-native';
import { usePetsScreen } from '../hooks/usePetsScreen';
import { getPetUsageSummary } from '../services/pet.service';

console.warn = jest.fn();

const mockPush = jest.fn();
const mockHydratePets = jest.fn();
const mockSelectPet = jest.fn();
const mockHydrateSubscription = jest.fn();
const mockSubscriptionState = {
  accessTier: 'free' as const,
  hydrate: mockHydrateSubscription,
};
const mockAlert = jest.fn();

jest.mock('react-native', () => {
  return {
    Alert: {
      alert: mockAlert,
    },
    Platform: {
      OS: 'ios',
      select: <T extends Record<string, unknown>>(
        options: T
      ) =>
        (options.ios ??
          options.default ??
          null) as T[keyof T],
    },
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../services/pet.service', () => ({
  getPetUsageSummary: jest.fn(),
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

jest.mock('../store/pet.store', () => ({
  usePetStore: () => ({
    pets: [
      {
        id: 'pet-1',
        name: 'Luna',
        is_active: true,
      },
    ],
    activePetId: 'pet-1',
    isHydrating: false,
    generalError: '',
    hydratePets: mockHydratePets,
    selectPet: mockSelectPet,
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

describe('usePetsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscriptionState.accessTier = 'free';
    mockHydrateSubscription.mockResolvedValue(null);
    mockHydratePets.mockResolvedValue(undefined);
    (
      getPetUsageSummary as jest.Mock
    ).mockResolvedValue({
      totalPets: 0,
      activePets: 0,
      inactivePets: 0,
    });
  });

  test('navigates to create pet when the user still has free capacity', async () => {
    const { result } = renderHook(() =>
      usePetsScreen()
    );

    await act(async () => {
      await result.current.goToCreatePet();
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/pet-detail?mode=create'
    );
  });
});
