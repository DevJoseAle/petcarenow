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

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('../services/profile.service', () => ({
  getProfileById: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: {
        id: string;
        email: string;
      } | null;
    }) => unknown
  ) =>
    selector({
      user: {
        id: 'user-1',
        email: 'jose@example.com',
      },
    }),
}));

const mockedGetProfileById =
  getProfileById as jest.MockedFunction<
    typeof getProfileById
  >;
const mockedUpdateProfile =
  updateProfile as jest.MockedFunction<
    typeof updateProfile
  >;

describe('useUserProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
