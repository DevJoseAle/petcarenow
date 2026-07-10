import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {
  getNotificationSettings,
  registerNotificationDevice,
  syncNotificationPreferences,
} from '../services/notifications.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock(
  '@react-native-async-storage/async-storage',
  () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
  })
);

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  AndroidImportance: {
    HIGH: 'high',
  },
  SchedulableTriggerInputTypes: {
    DATE: 'date',
    TIME_INTERVAL: 'timeInterval',
  },
}));

jest.mock('expo-device', () => ({
  deviceName: 'Jose iPhone',
}));

jest.mock('expo-constants', () => ({
  easConfig: {
    projectId: 'project-id',
  },
  expoConfig: {
    extra: {
      eas: {
        projectId: 'project-id',
      },
    },
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('notifications.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (
      Constants as unknown as {
        easConfig: { projectId: string };
      }
    ).easConfig = { projectId: 'project-id' };
  });

  test('returns default settings when preferences row is missing', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getNotificationSettings('user-1')
    ).resolves.toEqual(
      expect.objectContaining({
        owner_id: 'user-1',
        upcoming_care_enabled: true,
      })
    );
  });

  test('upserts notification preferences', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        owner_id: 'user-1',
        upcoming_care_enabled: false,
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const upsert = jest.fn(() => ({ select }));

    mockedSupabase.from.mockReturnValue({
      upsert,
    } as never);

    await expect(
      syncNotificationPreferences('user-1', {
        upcoming_care_enabled: false,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        upcoming_care_enabled: false,
      })
    );
  });

  test('registers notification device with expo token', async () => {
    (
      Notifications.getExpoPushTokenAsync as jest.Mock
    ).mockResolvedValue({
      data: 'ExponentPushToken[test]',
    });

    const neq = jest.fn().mockResolvedValue({
      error: null,
    });
    const eqUpdatePlatform = jest.fn(() => ({ neq }));
    const eqUpdateOwner = jest.fn(() => ({
      eq: eqUpdatePlatform,
    }));
    const update = jest.fn(() => ({
      eq: eqUpdateOwner,
    }));

    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'device-1',
        owner_id: 'user-1',
        expo_push_token: 'ExponentPushToken[test]',
        platform: 'ios',
        device_name: 'Jose iPhone',
        is_active: true,
        last_registered_at:
          '2026-07-08T00:00:00.000Z',
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const upsert = jest.fn(() => ({ select }));

    mockedSupabase.from.mockImplementation(
      (table: string) =>
        table === 'notification_devices'
          ? ({
              update,
              upsert,
            } as never)
          : ({} as never)
    );

    await expect(
      registerNotificationDevice('user-1')
    ).resolves.toEqual(
      expect.objectContaining({
        owner_id: 'user-1',
        expo_push_token:
          'ExponentPushToken[test]',
      })
    );
  });
});
