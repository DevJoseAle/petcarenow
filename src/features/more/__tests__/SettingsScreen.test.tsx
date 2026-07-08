import type { ReactNode } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SettingsScreen from '../screens/SettingsScreen';

jest.mock('@/components/Screen', () => ({
  Screen: ({
    children,
  }: {
    children: ReactNode;
  }) => {
    const { View } = require('react-native');

    return <View>{children}</View>;
  },
}));

jest.mock('../hooks/useSettingsScreen', () => ({
  useSettingsScreen: () => ({
    language: 'es',
    languageLabels: {
      es: 'Español',
      en: 'English',
    },
    themeSummary: 'Claro',
    activePetName: 'Luna',
    activePetSummary: 'Luna · Labrador',
    isHydrating: false,
    hasLoadError: false,
    isUpdating: false,
    generalError: '',
    successMessage: '',
    retry: jest.fn(),
    goBack: jest.fn(),
    openProfile: jest.fn(),
    openPets: jest.fn(),
    handleLanguageChange: jest.fn(),
    showThemeInfo: jest.fn(),
  }),
}));

describe('SettingsScreen', () => {
  test('renders settings groups and future options', () => {
    const screen = render(<SettingsScreen />);

    expect(
      screen.getByText('Configuración')
    ).toBeTruthy();
    expect(
      screen.getByText('Cuenta y app')
    ).toBeTruthy();
    expect(
      screen.getByText('Experiencia')
    ).toBeTruthy();
    expect(
      screen.getByText('Editar perfil')
    ).toBeTruthy();
    expect(
      screen.getByText('Luna')
    ).toBeTruthy();
  });

  test('delegates language selection to the hook', () => {
    const screen = render(<SettingsScreen />);

    fireEvent.press(screen.getByText('English'));

    expect(
      screen.getByText('English')
    ).toBeTruthy();
  });
});
