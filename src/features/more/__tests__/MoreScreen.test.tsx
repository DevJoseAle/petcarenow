import { render } from '@testing-library/react-native';
import MoreScreen from '../screens/MoreScreen';

jest.mock('@/components/Screen', () => ({
  Screen: ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const { View } = require('react-native');

    return <View>{children}</View>;
  },
}));

jest.mock('../hooks/useMoreScreen', () => ({
  useMoreScreen: () => ({
    isLoggingOut: false,
    logoutError: '',
    handleLogout: jest.fn(),
    items: [
      {
        id: 'profile',
        label: 'Perfil de usuario',
        status: 'active',
        onPress: jest.fn(),
      },
      {
        id: 'settings',
        label: 'Configuración',
        status: 'coming-soon',
        onPress: jest.fn(),
      },
    ],
  }),
}));

describe('MoreScreen', () => {
  test('renders active and coming soon items', () => {
    const screen = render(<MoreScreen />);

    expect(
      screen.getByText('Más opciones')
    ).toBeTruthy();
    expect(
      screen.getByText('Perfil de usuario')
    ).toBeTruthy();
    expect(
      screen.getByText('Configuración')
    ).toBeTruthy();
    expect(
      screen.getByText('Próximamente')
    ).toBeTruthy();
    expect(
      screen.getByText('Cerrar sesión')
    ).toBeTruthy();
  });
});
