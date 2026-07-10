import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';
import {
  getNotificationPermissionStatus,
  getNotificationSettings,
  getRegisteredNotificationDevice,
  requestNotificationPermission,
  registerNotificationDevice,
  syncScheduledNotifications,
  updateNotificationSetting,
} from '../services/notifications.service';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('../services/notifications.service', () => ({
  getNotificationPermissionStatus: jest.fn(),
  getNotificationSettings: jest.fn(),
  getRegisteredNotificationDevice: jest.fn(),
  requestNotificationPermission: jest.fn(),
  registerNotificationDevice: jest.fn(),
  syncScheduledNotifications: jest.fn(),
  updateNotificationSetting: jest.fn(),
  openDeviceNotificationSettings: jest.fn(),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: {
        id: string;
        email: string;
      } | null;
    }) => unknown
  ) =>
    selector({
      user: {
        id: 'user-1',
        email: 'jose@example.com',
      },
    }),
}));

describe('useNotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (
      getNotificationPermissionStatus as jest.Mock
    ).mockResolvedValue({
      status: 'granted',
      granted: true,
      canAskAgain: true,
    });
    (
      getNotificationSettings as jest.Mock
    ).mockResolvedValue({
      owner_id: 'user-1',
      upcoming_care_enabled: true,
      medications_enabled: true,
      vaccines_enabled: true,
      important_alerts_enabled: true,
      daily_summary_enabled: false,
    });
    (
      getRegisteredNotificationDevice as jest.Mock
    ).mockResolvedValue({
      id: 'device-1',
      owner_id: 'user-1',
      expo_push_token: 'ExponentPushToken[test]',
      platform: 'ios',
      device_name: 'Jose iPhone',
      is_active: true,
      last_registered_at:
        '2026-07-08T00:00:00.000Z',
    });
    (
      syncScheduledNotifications as jest.Mock
    ).mockResolvedValue({
      scheduledCount: 2,
      skippedCount: 1,
    });
  });

  test('hydrates permission, settings and device status', async () => {
    const { result } = renderHook(() =>
      useNotificationsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(
      result.current.permission.granted
    ).toBe(true);
    expect(
      result.current.settings?.owner_id
    ).toBe('user-1');
    expect(result.current.device?.id).toBe(
      'device-1'
    );
  });

  test('updates a setting and resyncs local reminders', async () => {
    (
      updateNotificationSetting as jest.Mock
    ).mockResolvedValue({
      owner_id: 'user-1',
      upcoming_care_enabled: false,
      medications_enabled: true,
      vaccines_enabled: true,
      important_alerts_enabled: true,
      daily_summary_enabled: false,
    });

    const { result } = renderHook(() =>
      useNotificationsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handleToggleSetting(
        'upcoming_care_enabled'
      );
    });

    expect(
      updateNotificationSetting
    ).toHaveBeenCalledWith(
      'user-1',
      'upcoming_care_enabled',
      false
    );
    expect(result.current.successMessage).toContain(
      'preferencias'
    );
  });

  test('requests permission and registers device', async () => {
    (
      requestNotificationPermission as jest.Mock
    ).mockResolvedValue({
      status: 'granted',
      granted: true,
      canAskAgain: true,
    });
    (
      registerNotificationDevice as jest.Mock
    ).mockResolvedValue({
      id: 'device-1',
      owner_id: 'user-1',
      expo_push_token: 'ExponentPushToken[test]',
      platform: 'ios',
      device_name: 'Jose iPhone',
      is_active: true,
      last_registered_at:
        '2026-07-08T00:00:00.000Z',
    });

    const { result } = renderHook(() =>
      useNotificationsScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handleRequestPermission();
    });

    expect(
      registerNotificationDevice
    ).toHaveBeenCalledWith('user-1');
  });
});
