import type { ReactNode } from 'react';
import {
  fireEvent,
  render,
} from '@testing-library/react-native';
import NotificationsScreen from '../screens/NotificationsScreen';

const mockToggleSetting = jest.fn();
const mockRequestPermission = jest.fn();

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

jest.mock('../hooks/useNotificationsScreen', () => ({
  useNotificationsScreen: () => ({
    permission: {
      status: 'granted',
      granted: true,
      canAskAgain: true,
    },
    settings: {
      owner_id: 'user-1',
      upcoming_care_enabled: true,
      medications_enabled: true,
      vaccines_enabled: true,
      important_alerts_enabled: true,
      daily_summary_enabled: false,
    },
    device: {
      id: 'device-1',
      owner_id: 'user-1',
      expo_push_token: 'ExponentPushToken[test]',
      platform: 'ios',
      device_name: 'Jose iPhone',
      is_active: true,
      last_registered_at:
        '2026-07-08T00:00:00.000Z',
    },
    syncResult: {
      scheduledCount: 2,
      skippedCount: 1,
    },
    isHydrating: false,
    isUpdating: false,
    hasLoadError: false,
    generalError: '',
    successMessage: '',
    retry: jest.fn(),
    goBack: jest.fn(),
    handleRequestPermission:
      mockRequestPermission,
    handleToggleSetting: mockToggleSetting,
    refreshRegistration: jest.fn(),
    openDeviceSettings: jest.fn(),
  }),
}));

describe('NotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders notifications sections', () => {
    const screen = render(
      <NotificationsScreen />
    );

    expect(
      screen.getByText('Notificaciones')
    ).toBeTruthy();
    expect(
      screen.getByText('Estado de permisos')
    ).toBeTruthy();
    expect(
      screen.getByText('Estado del dispositivo')
    ).toBeTruthy();
    expect(
      screen.getByText('Recordatorios y avisos')
    ).toBeTruthy();
  });

  test('toggles a notification preference', () => {
    const screen = render(
      <NotificationsScreen />
    );

    fireEvent(
      screen.getAllByRole('switch')[0],
      'valueChange',
      false
    );

    expect(mockToggleSetting).toHaveBeenCalledWith(
      'upcoming_care_enabled'
    );
  });
});
