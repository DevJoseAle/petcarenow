import React from 'react';
import {
  fireEvent,
  render,
} from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

const mockHookState = {
  email: 'user@example.com',
  password: 'secret123',
  emailError: '',
  passwordError: '',
  generalError: '',
  isSubmitting: false,
  isPasswordVisible: false,
  setEmail: jest.fn(),
  setPassword: jest.fn(),
  handleEmailBlur: jest.fn(),
  handlePasswordBlur: jest.fn(),
  handleSubmit: jest.fn(),
  goToRegister: jest.fn(),
  goToForgotPassword: jest.fn(),
  togglePasswordVisibility: jest.fn(),
};

jest.mock('@/components/Screen', () => ({
  Screen: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>,
}));

jest.mock('@/core/theme/useTheme', () => ({
  useTheme: () => ({
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    primary: '#208AEF',
    primarySoft: '#60A5FA',
    gradient: ['#FFFFFF', '#F3F4F6'],
  }),
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

jest.mock('../hooks/useLoginScreen', () => ({
  useLoginScreen: () => mockHookState,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHookState.generalError = '';
    mockHookState.isSubmitting = false;
  });

  test('renders form and delegates interactions to the hook', () => {
    const { getByPlaceholderText, getByText } =
      render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Tumail@email.com'),
      'next@example.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Contraseña'),
      'new-secret'
    );
    fireEvent.press(getByText('Iniciar Sesión'));
    fireEvent.press(
      getByText('Crea tu cuenta aquí')
    );
    fireEvent.press(
      getByText(
        '¿Olvidaste tu Contraseña?'
      )
    );

    expect(mockHookState.setEmail).toHaveBeenCalledWith(
      'next@example.com'
    );
    expect(
      mockHookState.setPassword
    ).toHaveBeenCalledWith('new-secret');
    expect(
      mockHookState.handleSubmit
    ).toHaveBeenCalled();
    expect(
      mockHookState.goToRegister
    ).toHaveBeenCalled();
    expect(
      mockHookState.goToForgotPassword
    ).toHaveBeenCalled();
  });

  test('shows general error returned by the hook', () => {
    mockHookState.generalError =
      'El correo o la contraseña no son correctos.';

    const { getByText } = render(
      <LoginScreen />
    );

    expect(
      getByText(
        'El correo o la contraseña no son correctos.'
      )
    ).toBeTruthy();
  });
});
