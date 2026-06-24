import {
  normalizeEmail,
  validateLoginCredentials,
  validateResetPasswordInput,
  validateSignUpCredentials,
} from '../utils/auth.validators';

describe('auth.validators', () => {
  test('normalizes email trimming whitespace and lowercasing', () => {
    expect(
      normalizeEmail('  USER@Example.COM ')
    ).toBe('user@example.com');
  });

  test('returns email and password errors for invalid login input', () => {
    expect(
      validateLoginCredentials({
        email: 'correo-invalido',
        password: '',
      })
    ).toEqual({
      email:
        'Ingresa un correo electrónico válido.',
      password:
        'La contraseña es obligatoria.',
    });
  });

  test('requires stronger password rules for sign up', () => {
    expect(
      validateSignUpCredentials({
        email: 'user@example.com',
        password: '123',
      })
    ).toEqual({
      password:
        'La contraseña debe tener al menos 6 caracteres.',
    });
  });

  test('validates reset password email input', () => {
    expect(
      validateResetPasswordInput({
        email: '',
      })
    ).toEqual({
      email:
        'El correo electrónico es obligatorio.',
    });
  });
});
