import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import { usePetOnboardingScreen } from '../hooks/usePetOnboardingScreen';
import {
  createPet,
  getPetUsageSummary,
} from '../services/pet.service';
import {
  PetGender,
  PetType,
} from '../types/pet.types';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockMarkHasPets = jest.fn();
const mockHydrateSubscription = jest.fn();
const mockSubscriptionState = {
  accessTier: 'free' as const,
  hydrate: mockHydrateSubscription,
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock('../services/pet.service', () => ({
  createPet: jest.fn(),
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

jest.mock('../store/petOnboardingGate.store', () => ({
  usePetOnboardingGateStore: (
    selector: (state: {
      markHasPets: typeof mockMarkHasPets;
    }) => unknown
  ) =>
    selector({
      markHasPets: mockMarkHasPets,
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

const mockedCreatePet =
  createPet as jest.MockedFunction<
    typeof createPet
  >;

const advanceToFinalStep = async (
  result: {
    current: ReturnType<
      typeof usePetOnboardingScreen
    >;
  }
) => {
  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.setFieldValue('name', 'Luna');
    result.current.setFieldValue(
      'petType',
      PetType.Cat
    );
  });

  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.setFieldValue(
      'breed',
      'mixed'
    );
    result.current.setFieldValue(
      'gender',
      PetGender.Female
    );
  });

  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.handleBirthDateChange(
      new Date('2024-01-10')
    );
  });

  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.setFieldValue('weightKg', '4');
  });

  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.setFieldValue(
      'healthStatus',
      'none'
    );
  });

  await act(async () => {
    await result.current.goToNextStep();
  });

  act(() => {
    result.current.setFieldValue(
      'photoURL',
      'file:///tmp/luna.jpg'
    );
  });
};

describe('usePetOnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(Alert, 'alert')
      .mockImplementation(jest.fn());
    mockSubscriptionState.accessTier = 'free';
    mockHydrateSubscription.mockResolvedValue(null);
    (
      getPetUsageSummary as jest.Mock
    ).mockResolvedValue({
      totalPets: 0,
      activePets: 0,
      inactivePets: 0,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('blocks progression when first step is invalid', async () => {
    const { result } = renderHook(() =>
      usePetOnboardingScreen()
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.errors).toEqual({
      name: 'El nombre es obligatorio.',
      petType: 'Selecciona el tipo de mascota.',
    });
  });

  test('advances to next step when current step is valid', async () => {
    const { result } = renderHook(() =>
      usePetOnboardingScreen()
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    act(() => {
      result.current.setFieldValue(
        'name',
        'Luna'
      );
      result.current.setFieldValue(
        'petType',
        PetType.Cat
      );
    });

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  test('submits pet successfully on final step', async () => {
    mockedCreatePet.mockResolvedValue({
      success: true,
      data: {
        id: 'pet-1',
      } as never,
    });

    const { result } = renderHook(() =>
      usePetOnboardingScreen()
    );

    await advanceToFinalStep(result);

    await act(async () => {
      await result.current.goToNextStep();
    });

    await waitFor(() => {
      expect(mockedCreatePet).toHaveBeenCalled();
    });
    expect(mockMarkHasPets).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(app)/(tabs)'
    );
  });

  test('blocks onboarding submission when the free pet limit is reached', async () => {
    (
      getPetUsageSummary as jest.Mock
    ).mockResolvedValue({
      totalPets: 1,
      activePets: 1,
      inactivePets: 0,
    });

    const { result } = renderHook(() =>
      usePetOnboardingScreen()
    );

    await advanceToFinalStep(result);

    await act(async () => {
      await result.current.goToNextStep();
    });

    await waitFor(() => {
      expect(mockedCreatePet).not.toHaveBeenCalled();
      expect(result.current.generalError).toContain(
        'Tu plan gratuito permite registrar solo 1 mascota.'
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        'Límite del plan gratuito',
        expect.stringContaining(
          'Tu plan gratuito permite registrar solo 1 mascota.'
        ),
        expect.any(Array)
      );
    });
  });
});
