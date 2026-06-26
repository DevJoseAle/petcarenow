import React from 'react';
import { render } from '@testing-library/react-native';
import CareProfileScreen from '../screens/CareProfileScreen';

const mockHookState = {
  activePet: {
    id: 'pet-1',
    name: 'Luna',
    breed: 'mixed',
    birth_date: '2023-01-10',
    weight_kg: 4,
    photo_url: null,
    allergies: ['Polen'],
    medical_conditions: ['Artritis'],
  },
  profile: {
    vaccinations: [
      {
        id: 'vac-1',
        title: 'Rabia',
        subtitle: 'Refuerzo anual',
        appliedAtLabel: '20 de junio de 2026',
        nextDueLabel: '20 de junio de 2027',
      },
    ],
    latestMedicalVisit: {
      title: 'Consulta de control',
      dateLabel: '10 de junio de 2026',
      clinicName: 'Clinica Norte',
      reason: 'Chequeo general',
    },
  },
  isLoading: false,
  isSharing: false,
  generalError: '',
  retry: jest.fn(),
  goToEditPet: jest.fn(),
  goToPets: jest.fn(),
  handleShare: jest.fn(),
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
    background: '#FFFFFF',
  }),
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

jest.mock('../hooks/useCareProfileScreen', () => ({
  useCareProfileScreen: () => mockHookState,
}));

describe('CareProfileScreen', () => {
  test('renders the main care profile blocks', () => {
    const { getByText } = render(
      <CareProfileScreen />
    );

    expect(
      getByText('Perfil de cuidado')
    ).toBeTruthy();
    expect(getByText('Perfil base')).toBeTruthy();
    expect(getByText('Vacunas')).toBeTruthy();
    expect(
      getByText('Última visita médica')
    ).toBeTruthy();
    expect(
      getByText('Compartir perfil')
    ).toBeTruthy();
  });
});
