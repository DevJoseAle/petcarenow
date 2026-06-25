import {
  act,
  renderHook,
} from '@testing-library/react-native';
import { useLoginScreen } from '../hooks/useLoginScreen';
import { loginWithEmail } from '../services/auth.service';
import { hasRegisteredPets } from '@/features/pets/services/pet.service';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockSetSession = jest.fn();
const mockMarkHasPets = jest.fn();
const mockResetPetGate = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
}));

jest.mock('../services/auth.service', () => ({
  loginWithEmail: jest.fn(),
}));

jest.mock('@/features/pets/services/pet.service', () => ({
  hasRegisteredPets: jest.fn(),
}));

jest.mock('../store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      setSession: typeof mockSetSession;
    }) => unknown
  ) =>
    selector({
      setSession: mockSetSession,
    }),
}));

jest.mock('@/features/pets/store/petOnboardingGate.store', () => ({
  usePetOnboardingGateStore: (
    selector: (state: {
      markHasPets: typeof mockMarkHasPets;
      reset: typeof mockResetPetGate;
    }) => unknown
  ) =>
    selector({
      markHasPets: mockMarkHasPets,
      reset: mockResetPetGate,
    }),
}));

const mockedLoginWithEmail =
  loginWithEmail as jest.MockedFunction<
    typeof loginWithEmail
  >;
const mockedHasRegisteredPets =
  hasRegisteredPets as jest.MockedFunction<
    typeof hasRegisteredPets
  >;

describe('useLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exposes initial form state', () => {
    const { result } = renderHook(() =>
      useLoginScreen()
    );

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isSubmitting).toBe(
      false
    );
    expect(
      result.current.isPasswordVisible
    ).toBe(false);
  });

  test('validates required fields before submit', async () => {
    const { result } = renderHook(() =>
      useLoginScreen()
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(
      mockedLoginWithEmail
    ).not.toHaveBeenCalled();
    expect(result.current.emailError).toBe(
      'El correo electrónico es obligatorio.'
    );
    expect(result.current.passwordError).toBe(
      'La contraseña es obligatoria.'
    );
  });

  test('submits successfully and navigates to app flow', async () => {
    mockedLoginWithEmail.mockResolvedValue({
      success: true,
      data: {
        session: {
          access_token: 'token',
        } as never,
        user: {
          id: 'user-1',
          email: 'user@example.com',
        } as never,
      },
    });
    mockedHasRegisteredPets.mockResolvedValue(
      true
    );

    const { result } = renderHook(() =>
      useLoginScreen()
    );

    act(() => {
      result.current.setEmail(
        'USER@example.com'
      );
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(
      mockedLoginWithEmail
    ).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(
      mockedHasRegisteredPets
    ).toHaveBeenCalledWith('user-1');
    expect(mockSetSession).toHaveBeenCalled();
    expect(mockMarkHasPets).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(app)'
    );
  });

  test('redirects to pet onboarding when user has no registered pets', async () => {
    mockedLoginWithEmail.mockResolvedValue({
      success: true,
      data: {
        session: {
          access_token: 'token',
        } as never,
        user: {
          id: 'user-1',
          email: 'user@example.com',
        } as never,
      },
    });
    mockedHasRegisteredPets.mockResolvedValue(
      false
    );

    const { result } = renderHook(() =>
      useLoginScreen()
    );

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockResetPetGate).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/pet-onboarding'
    );
  });

  test('surfaces service errors on failed login', async () => {
    mockedLoginWithEmail.mockResolvedValue({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message:
          'El correo o la contraseña no son correctos.',
      },
    });

    const { result } = renderHook(() =>
      useLoginScreen()
    );

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('wrong-password');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.generalError).toBe(
      'El correo o la contraseña no son correctos.'
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
