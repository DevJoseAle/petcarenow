import type {
  AuthServiceError,
  LoginCredentials,
  LoginResult,
  ResetPasswordInput,
  ResetPasswordResult,
  SignUpCredentials,
  SignUpResult,
} from '../types/auth.types';
import { supabase } from '@/config/supabase';
import { normalizeEmail } from '../utils/auth.validators';

const invalidCredentialsMessages = [
  'invalid login credentials',
  'email not confirmed',
  'invalid_grant',
];

const signUpConflictMessages = [
  'user already registered',
  'already been registered',
];

const mapAuthError = (
  error: unknown
): AuthServiceError => {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : '';

  if (
    invalidCredentialsMessages.some((entry) =>
      message.includes(entry)
    )
  ) {
    return {
      code: 'INVALID_CREDENTIALS',
      message:
        'El correo o la contraseña no son correctos.',
    };
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return {
      code: 'NETWORK_ERROR',
      message:
        'No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.',
    };
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message:
      'Ocurrió un error inesperado al iniciar sesión.',
  };
};

export const loginWithEmail = async ({
  email,
  password,
}: LoginCredentials): Promise<LoginResult> => {
  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      });

    if (
      error ||
      !data.session ||
      !data.user
    ) {
      return {
        success: false,
        error: mapAuthError(error),
      };
    }

    return {
      success: true,
      data: {
        session: data.session,
        user: data.user,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: mapAuthError(error),
    };
  }
};

export const signUpWithEmail = async ({
  email,
  password,
}: SignUpCredentials): Promise<SignUpResult> => {
  try {
    const { error, data } =
      await supabase.auth.signUp({
        email: normalizeEmail(email),
        password,
      });

    if (error) {
      const mappedError = mapAuthError(error);
      const message =
        error.message.toLowerCase();

      if (
        signUpConflictMessages.some((entry) =>
          message.includes(entry)
        )
      ) {
        return {
          success: false,
          error: {
            code: 'UNEXPECTED_ERROR',
            message:
              'Ya existe una cuenta con ese correo electrónico.',
          },
        };
      }

      return {
        success: false,
        error: mappedError,
      };
    }

    const requiresEmailConfirmation =
      !data.session;

    return {
      success: true,
      message: requiresEmailConfirmation
        ? 'Tu cuenta fue creada. Revisa tu correo para confirmar el registro antes de iniciar sesión.'
        : 'Tu cuenta fue creada correctamente. Ya puedes continuar.',
    };
  } catch (error) {
    return {
      success: false,
      error: mapAuthError(error),
    };
  }
};

export const requestPasswordReset = async ({
  email,
}: ResetPasswordInput): Promise<ResetPasswordResult> => {
  try {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        normalizeEmail(email)
      );

    if (error) {
      return {
        success: false,
        error: mapAuthError(error),
      };
    }

    return {
      success: true,
      message:
        'Si el correo existe, te enviamos instrucciones para recuperar tu contraseña.',
    };
  } catch (error) {
    return {
      success: false,
      error: mapAuthError(error),
    };
  }
};
