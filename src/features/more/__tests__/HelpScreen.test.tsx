import { render } from '@testing-library/react-native';
import HelpScreen from '../screens/HelpScreen';

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

jest.mock('@/components/icons/Ionicons', () => 'Ionicons');

jest.mock('../hooks/useHelpScreen', () => ({
  useHelpScreen: () => ({
    faqItems: [
      {
        id: 'faq-1',
        question: '¿Cómo activo premium?',
        answer: 'Desde suscripción.',
      },
    ],
    contactOptions: [
      {
        id: 'contact-1',
        label: 'Escríbenos por email',
        description: 'Abre tu correo.',
      },
    ],
    legalLinks: [
      {
        id: 'legal-1',
        label: 'Términos de uso',
        description: 'Consulta las reglas.',
      },
    ],
    isOpeningId: null,
    generalError: '',
    goBack: jest.fn(),
    handleOpenContactOption: jest.fn(),
    handleOpenLegalLink: jest.fn(),
  }),
}));

describe('HelpScreen', () => {
  test('renders faq, contact and legal content', () => {
    const screen = render(<HelpScreen />);

    expect(screen.getByText('Ayuda')).toBeTruthy();
    expect(
      screen.getByText('Preguntas frecuentes')
    ).toBeTruthy();
    expect(
      screen.getByText('¿Cómo activo premium?')
    ).toBeTruthy();
    expect(
      screen.getByText('Contacto')
    ).toBeTruthy();
    expect(
      screen.getByText('Escríbenos por email')
    ).toBeTruthy();
    expect(
      screen.getByText('Legal')
    ).toBeTruthy();
    expect(
      screen.getByText('Términos de uso')
    ).toBeTruthy();
  });
});
