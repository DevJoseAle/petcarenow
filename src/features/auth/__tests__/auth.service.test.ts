import {
  loginWithEmail,
  requestPasswordReset,
  signUpWithEmail,
} from '../services/auth.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;
const signInWithPasswordMock =
  mockedSupabase.auth
    .signInWithPassword as jest.Mock;
const signUpMock =
  mockedSupabase.auth.signUp as jest.Mock;
const resetPasswordForEmailMock =
  mockedSupabase.auth
    .resetPasswordForEmail as jest.Mock;

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns session and user on successful login', async () => {
    signInWithPasswordMock.mockResolvedValue(
      {
        data: {
          session: {
            access_token: 'token',
          },
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
        error: null,
      } as never
    );

    const result = await loginWithEmail({
      email: 'USER@example.com',
      password: 'secret123',
    });

    expect(
      mockedSupabase.auth.signInWithPassword
    ).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result).toEqual({
      success: true,
      data: {
        session: {
          access_token: 'token',
        },
        user: {
          id: 'user-1',
          email: 'user@example.com',
        },
      },
    });
  });

  test('maps invalid credentials to user-friendly login error', async () => {
    signInWithPasswordMock.mockResolvedValue(
      {
        data: {
          session: null,
          user: null,
        },
        error: new Error(
          'Invalid login credentials'
        ),
      } as never
    );

    const result = await loginWithEmail({
      email: 'user@example.com',
      password: 'wrong',
    });

    expect(result).toEqual({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message:
          'El correo o la contraseña no son correctos.',
      },
    });
  });

  test('returns confirmation message when sign up requires email confirmation', async () => {
    signUpMock.mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    } as never);

    const result = await signUpWithEmail({
      email: 'user@example.com',
      password: 'secret123',
    });

    expect(result).toEqual({
      success: true,
      message:
        'Tu cuenta fue creada. Revisa tu correo para confirmar el registro antes de iniciar sesión.',
    });
  });

  test('returns generic success message for password reset request', async () => {
    resetPasswordForEmailMock.mockResolvedValue(
      {
        error: null,
      } as never
    );

    const result = await requestPasswordReset({
      email: 'user@example.com',
    });

    expect(
      mockedSupabase.auth.resetPasswordForEmail
    ).toHaveBeenCalledWith('user@example.com');
    expect(result).toEqual({
      success: true,
      message:
        'Si el correo existe, te enviamos instrucciones para recuperar tu contraseña.',
    });
  });
});
