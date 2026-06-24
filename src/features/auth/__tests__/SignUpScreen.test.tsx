import React from 'react';
import {
  fireEvent,
  render,
} from '@testing-library/react-native';
import SignUpScreen from '../screens/SignUpScreen';

const mockHookState = {
  email: 'new@example.com',
  password: 'secret123',
  emailError: '',
  passwordError: '',
  generalError: '',
  successMessage: '',
  isSubmitting: false,
  isPasswordVisible: false,
  setEmail: jest.fn(),
  setPassword: jest.fn(),
  handleEmailBlur: jest.fn(),
  handlePasswordBlur: jest.fn(),
  handleSubmit: jest.fn(),
  goToLogin: jest.fn(),
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

jest.mock('../hooks/useSignUpScreen', () => ({
  useSignUpScreen: () => mockHookState,
}));

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHookState.successMessage = '';
    mockHookState.generalError = '';
  });

  test('renders sign up form and delegates actions to the hook', () => {
    const { getByPlaceholderText, getByText } =
      render(<SignUpScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Tumail@email.com'),
      'created@example.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Contraseña'),
      'very-secret'
    );
    fireEvent.press(getByText('Crear Cuenta'));
    fireEvent.press(
      getByText('Volver a Iniciar Sesión')
    );

    expect(mockHookState.setEmail).toHaveBeenCalledWith(
      'created@example.com'
    );
    expect(
      mockHookState.setPassword
    ).toHaveBeenCalledWith('very-secret');
    expect(
      mockHookState.handleSubmit
    ).toHaveBeenCalled();
    expect(
      mockHookState.goToLogin
    ).toHaveBeenCalled();
  });

  test('shows success feedback returned by the hook', () => {
    mockHookState.successMessage =
      'Tu cuenta fue creada correctamente.';

    const { getByText } = render(
      <SignUpScreen />
    );

    expect(
      getByText(
        'Tu cuenta fue creada correctamente.'
      )
    ).toBeTruthy();
  });
});
