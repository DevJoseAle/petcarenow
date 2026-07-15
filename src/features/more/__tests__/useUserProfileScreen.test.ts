import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useUserProfileScreen } from '../hooks/useUserProfileScreen';
import {
  getProfileById,
  updateProfile,
} from '../services/profile.service';
import { deleteCurrentUserAccount } from '../services/account-deletion.service';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockClearSession = jest.fn();
const mockSetSession = jest.fn();
const mockResetPetGate = jest.fn();
const mockResetPets = jest.fn();
const mockResetSubscription = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

jest.mock('../services/profile.service', () => ({
  getProfileById: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock(
  '../services/account-deletion.service',
  () => ({
    deleteCurrentUserAccount: jest.fn(),
  })
);

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: {
        id: string;
        email: string;
      } | null;
      clearSession: () => Promise<void>;
      setSession: (
        session: null
      ) => void;
    }) => unknown
  ) =>
    selector({
      user: {
        id: 'user-1',
        email: 'jose@example.com',
      },
      clearSession: mockClearSession,
      setSession: mockSetSession,
    }),
}));

jest.mock(
  '@/features/pets/store/petOnboardingGate.store',
  () => ({
    usePetOnboardingGateStore: (
      selector: (state: {
        reset: () => void;
      }) => unknown
    ) =>
      selector({
        reset: mockResetPetGate,
      }),
  })
);

jest.mock('@/features/pets/store/pet.store', () => ({
  usePetStore: (
    selector: (state: {
      reset: () => void;
    }) => unknown
  ) =>
    selector({
      reset: mockResetPets,
    }),
}));

jest.mock(
  '@/features/subscriptions/store/subscription.store',
  () => ({
    useSubscriptionStore: (
      selector: (state: {
        reset: () => void;
      }) => unknown
    ) =>
      selector({
        reset: mockResetSubscription,
      }),
  })
);

const mockedGetProfileById =
  getProfileById as jest.MockedFunction<
    typeof getProfileById
  >;
const mockedUpdateProfile =
  updateProfile as jest.MockedFunction<
    typeof updateProfile
  >;
const mockedDeleteCurrentUserAccount =
  deleteCurrentUserAccount as jest.MockedFunction<
    typeof deleteCurrentUserAccount
  >;

describe('useUserProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClearSession.mockResolvedValue(undefined);
  });

  test('hydrates profile data', async () => {
    mockedGetProfileById.mockResolvedValue({
      id: 'user-1',
      full_name: 'Jose',
      avatar_url: null,
      country: 'Chile',
      language: 'es',
      onboarding_completed: true,
      created_at: null,
      updated_at: null,
    });

    const { result } = renderHook(() =>
      useUserProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(result.current.fullName).toBe('Jose');
    expect(result.current.country).toBe('Chile');
    expect(result.current.email).toBe(
      'jose@example.com'
    );
  });

  test('saves updated profile data', async () => {
    mockedGetProfileById.mockResolvedValue({
      id: 'user-1',
      full_name: 'Jose',
      avatar_url: null,
      country: 'Chile',
      language: 'es',
      onboarding_completed: true,
      created_at: null,
      updated_at: null,
    });
    mockedUpdateProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'Jose Rodriguez',
      avatar_url: null,
      country: 'Chile',
      language: 'es',
      onboarding_completed: true,
      created_at: null,
      updated_at: null,
    });

    const { result } = renderHook(() =>
      useUserProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    act(() => {
      result.current.setFullName(
        'Jose Rodriguez'
      );
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(
      mockedUpdateProfile
    ).toHaveBeenCalledWith('user-1', {
      full_name: 'Jose Rodriguez',
      country: 'Chile',
      language: 'es',
    });
    expect(result.current.successMessage).toBe(
      'Tu perfil fue actualizado correctamente.'
    );
  });

  test('surfaces profile load errors', async () => {
    mockedGetProfileById.mockRejectedValue(
      new Error('Fallo al cargar')
    );

    const { result } = renderHook(() =>
      useUserProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(result.current.generalError).toBe(
      'Fallo al cargar'
    );
  });

  test('deletes account and clears local state', async () => {
    mockedGetProfileById.mockResolvedValue({
      id: 'user-1',
      full_name: 'Jose',
      avatar_url: null,
      country: 'Chile',
      language: 'es',
      onboarding_completed: true,
      created_at: null,
      updated_at: null,
    });
    mockedDeleteCurrentUserAccount.mockResolvedValue();

    const { result } = renderHook(() =>
      useUserProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    act(() => {
      result.current.openDeleteAccountConfirmation();
    });

    expect(
      result.current.isDeleteConfirmationVisible
    ).toBe(true);

    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(
      mockedDeleteCurrentUserAccount
    ).toHaveBeenCalled();
    expect(mockClearSession).toHaveBeenCalled();
    expect(mockResetPetGate).toHaveBeenCalled();
    expect(mockResetPets).toHaveBeenCalled();
    expect(
      mockResetSubscription
    ).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(auth)/login'
    );
  });

  test('surfaces delete account errors', async () => {
    mockedGetProfileById.mockResolvedValue({
      id: 'user-1',
      full_name: 'Jose',
      avatar_url: null,
      country: 'Chile',
      language: 'es',
      onboarding_completed: true,
      created_at: null,
      updated_at: null,
    });
    mockedDeleteCurrentUserAccount.mockRejectedValue(
      new Error('No pudimos eliminar la cuenta')
    );

    const { result } = renderHook(() =>
      useUserProfileScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handleDeleteAccount();
    });

    expect(
      result.current.deleteAccountError
    ).toBe('No pudimos eliminar la cuenta');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
