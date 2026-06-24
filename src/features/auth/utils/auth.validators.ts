import type {
  LoginCredentials,
  LoginValidationErrors,
  ResetPasswordInput,
  ResetPasswordValidationErrors,
  SignUpCredentials,
  SignUpValidationErrors,
} from '../types/auth.types';

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

const getEmailError = (
  email: string
) => {
  const normalizedEmail =
    normalizeEmail(email);

  if (!normalizedEmail) {
    return 'El correo electrónico es obligatorio.';
  }

  if (!emailRegex.test(normalizedEmail)) {
    return 'Ingresa un correo electrónico válido.';
  }

  return undefined;
};

export const validateLoginCredentials = (
  credentials: LoginCredentials
): LoginValidationErrors => {
  const errors: LoginValidationErrors = {};
  const emailError = getEmailError(
    credentials.email
  );

  if (emailError) {
    errors.email = emailError;
  }

  if (!credentials.password.trim()) {
    errors.password =
      'La contraseña es obligatoria.';
  }

  return errors;
};

export const validateSignUpCredentials = (
  credentials: SignUpCredentials
): SignUpValidationErrors => {
  const errors: SignUpValidationErrors = {};
  const emailError = getEmailError(
    credentials.email
  );

  if (emailError) {
    errors.email = emailError;
  }

  if (!credentials.password.trim()) {
    errors.password =
      'La contraseña es obligatoria.';
  } else if (
    credentials.password.trim().length < 6
  ) {
    errors.password =
      'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
};

export const validateResetPasswordInput = (
  input: ResetPasswordInput
): ResetPasswordValidationErrors => {
  const errors: ResetPasswordValidationErrors = {};
  const emailError = getEmailError(
    input.email
  );

  if (emailError) {
    errors.email = emailError;
  }

  return errors;
};
