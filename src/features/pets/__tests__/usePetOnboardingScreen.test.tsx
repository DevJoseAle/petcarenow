import {
  act,
  renderHook,
} from '@testing-library/react-native';
import { usePetOnboardingScreen } from '../hooks/usePetOnboardingScreen';
import { createPet } from '../services/pet.service';
import {
  PetGender,
  PetType,
} from '../types/pet.types';

const mockReplace = jest.fn();
const mockMarkHasPets = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('../services/pet.service', () => ({
  createPet: jest.fn(),
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

const mockedCreatePet =
  createPet as jest.MockedFunction<
    typeof createPet
  >;

describe('usePetOnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      result.current.setFieldValue(
        'weightKg',
        '4'
      );
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

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect(mockedCreatePet).toHaveBeenCalled();
    expect(mockMarkHasPets).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(app)/(tabs)'
    );
  });
});
