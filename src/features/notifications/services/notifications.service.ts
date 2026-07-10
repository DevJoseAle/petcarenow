import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  Linking,
  Platform,
} from 'react-native';
import { supabase } from '@/config/supabase';
import { listCareEvents } from '@/features/calendar/services/care-event.service';
import type { CareEvent } from '@/features/calendar/types/care-event.types';
import type {
  NotificationDevice,
  NotificationPermissionStatus,
  NotificationSettingKey,
  NotificationSettings,
  NotificationSyncResult,
} from '../types/notification.types';

const NOTIFICATION_CHANNEL_ID =
  'petcare-reminders';
const SCHEDULED_IDS_STORAGE_KEY =
  'pcn:scheduled-notification-ids';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DEFAULT_NOTIFICATION_SETTINGS = (
  ownerId: string
): NotificationSettings => ({
  owner_id: ownerId,
  upcoming_care_enabled: true,
  medications_enabled: true,
  vaccines_enabled: true,
  important_alerts_enabled: true,
  daily_summary_enabled: false,
  created_at: null,
  updated_at: null,
});

const hasMessage = (
  value: unknown
): value is { message: string } =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof value.message === 'string';

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : hasMessage(error)
    ? error.message
    : 'Error desconocido';

const mapNotificationsError = (
  error: unknown,
  fallback: string
) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para gestionar tus notificaciones.'
    );
  }

  if (
    message.includes('does not exist') ||
    message.includes('relation') ||
    message.includes('schema cache')
  ) {
    return new Error(
      'Falta configurar las tablas de notificaciones en Supabase antes de usar esta pantalla.'
    );
  }

  return new Error(
    `${fallback} ${getErrorMessage(error)}`
  );
};

const getProjectId = () =>
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId ??
  null;

const toPermissionStatus = (
  status:
    | Notifications.PermissionStatus
    | NotificationPermissionStatus['status'],
  canAskAgain: boolean
): NotificationPermissionStatus => ({
  status:
    status === 'granted' ||
    status === 'denied' ||
    status === 'undetermined'
      ? status
      : 'undetermined',
  granted: status === 'granted',
  canAskAgain,
});

const getStoredScheduledIds = async () => {
  const rawValue = await AsyncStorage.getItem(
    SCHEDULED_IDS_STORAGE_KEY
  );

  if (!rawValue) {
    return [] as string[];
  }

  try {
    const value = JSON.parse(rawValue);

    return Array.isArray(value)
      ? value.filter(
          (item): item is string =>
            typeof item === 'string'
        )
      : [];
  } catch {
    return [];
  }
};

const setStoredScheduledIds = async (
  ids: string[]
) => {
  await AsyncStorage.setItem(
    SCHEDULED_IDS_STORAGE_KEY,
    JSON.stringify(ids)
  );
};

const ensureNotificationChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    NOTIFICATION_CHANNEL_ID,
    {
      name: 'Recordatorios de PetCareNow',
      importance:
        Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4DB082',
    }
  );
};

const isEventEnabled = (
  event: CareEvent,
  settings: NotificationSettings
) => {
  if (event.status !== 'scheduled') {
    return false;
  }

  switch (event.event_type) {
    case 'medication':
      return settings.medications_enabled;
    case 'vaccine':
      return settings.vaccines_enabled;
    case 'consultation':
    case 'deworming':
    case 'custom':
      return (
        settings.upcoming_care_enabled ||
        settings.important_alerts_enabled
      );
    default:
      return false;
  }
};

const getEventNotificationDate = (
  event: CareEvent
) => {
  const sourceDate =
    event.reminder_at ?? event.starts_at;
  const date = new Date(sourceDate);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const buildEventBody = (event: CareEvent) => {
  const petContext = event.description?.trim();

  switch (event.event_type) {
    case 'medication':
      return petContext?.length
        ? petContext
        : 'Revisa la medicación programada para tu mascota.';
    case 'vaccine':
      return petContext?.length
        ? petContext
        : 'Tu mascota tiene una vacuna o control pendiente.';
    case 'consultation':
      return petContext?.length
        ? petContext
        : 'Tienes una consulta veterinaria programada.';
    case 'deworming':
      return petContext?.length
        ? petContext
        : 'Recuerda el cuidado programado para tu mascota.';
    case 'custom':
    default:
      return petContext?.length
        ? petContext
        : 'Tienes un próximo cuidado pendiente en PetCareNow.';
  }
};

export const getNotificationPermissionStatus =
  async (): Promise<NotificationPermissionStatus> => {
    try {
      const permission =
        await Notifications.getPermissionsAsync();

      return toPermissionStatus(
        permission.status,
        permission.canAskAgain
      );
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos revisar el permiso de notificaciones.'
      );
    }
  };

export const requestNotificationPermission =
  async (): Promise<NotificationPermissionStatus> => {
    try {
      await ensureNotificationChannel();

      const permission =
        await Notifications.requestPermissionsAsync();

      return toPermissionStatus(
        permission.status,
        permission.canAskAgain
      );
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos solicitar el permiso de notificaciones.'
      );
    }
  };

export const openDeviceNotificationSettings =
  async () => {
    await Linking.openSettings();
  };

export const getNotificationSettings =
  async (
    ownerId: string
  ): Promise<NotificationSettings> => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data
        ? (data as NotificationSettings)
        : DEFAULT_NOTIFICATION_SETTINGS(ownerId);
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos cargar tu configuración de notificaciones.'
      );
    }
  };

export const syncNotificationPreferences =
  async (
    ownerId: string,
    input: Partial<
      Omit<
        NotificationSettings,
        'owner_id' | 'created_at' | 'updated_at'
      >
    >
  ): Promise<NotificationSettings> => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            owner_id: ownerId,
            ...input,
          },
          {
            onConflict: 'owner_id',
          }
        )
        .select('*')
        .single();

      if (error || !data) {
        throw error;
      }

      return data as NotificationSettings;
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos guardar tus preferencias de notificaciones.'
      );
    }
  };

export const updateNotificationSetting =
  async (
    ownerId: string,
    key: NotificationSettingKey,
    value: boolean
  ) =>
    syncNotificationPreferences(ownerId, {
      [key]: value,
    });

export const getRegisteredNotificationDevice =
  async (
    ownerId: string
  ): Promise<NotificationDevice | null> => {
    try {
      const { data, error } = await supabase
        .from('notification_devices')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .order('last_registered_at', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return (data as NotificationDevice | null) ?? null;
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos revisar el dispositivo registrado para notificaciones.'
      );
    }
  };

export const registerNotificationDevice =
  async (
    ownerId: string
  ): Promise<NotificationDevice> => {
    try {
      await ensureNotificationChannel();

      const projectId = getProjectId();

      if (!projectId) {
        throw new Error(
          'No encontramos el projectId de Expo para registrar el dispositivo.'
        );
      }

      const tokenResponse =
        await Notifications.getExpoPushTokenAsync(
          {
            projectId,
          }
        );
      const expoPushToken = tokenResponse.data;

      await supabase
        .from('notification_devices')
        .update({ is_active: false })
        .eq('owner_id', ownerId)
        .eq('platform', Platform.OS)
        .neq('expo_push_token', expoPushToken);

      const { data, error } = await supabase
        .from('notification_devices')
        .upsert(
          {
            owner_id: ownerId,
            expo_push_token: expoPushToken,
            platform: Platform.OS,
            device_name:
              Device.deviceName ?? null,
            is_active: true,
            last_registered_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              'owner_id,platform,expo_push_token',
          }
        )
        .select('*')
        .single();

      if (error || !data) {
        throw error;
      }

      return data as NotificationDevice;
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos registrar este dispositivo para notificaciones.'
      );
    }
  };

export const scheduleLocalReminder = async (
  event: CareEvent
) => {
  const triggerDate =
    getEventNotificationDate(event);

  if (
    !triggerDate ||
    triggerDate.getTime() <= Date.now()
  ) {
    return null;
  }

  const identifier =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: buildEventBody(event),
        sound: 'default',
        data: {
          route: '/event-detail',
          eventId: event.id,
          petId: event.pet_id,
          source: 'petcarenow-care',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId:
          Platform.OS === 'android'
            ? NOTIFICATION_CHANNEL_ID
            : undefined,
      },
    });

  return identifier;
};

export const syncScheduledNotifications =
  async ({
    ownerId,
    settings,
  }: {
    ownerId: string;
    settings: NotificationSettings;
  }): Promise<NotificationSyncResult> => {
    try {
      const currentIds =
        await getStoredScheduledIds();

      await Promise.all(
        currentIds.map((id) =>
          Notifications.cancelScheduledNotificationAsync(
            id
          ).catch(() => undefined)
        )
      );

      const events = await listCareEvents(ownerId);
      let scheduledCount = 0;
      let skippedCount = 0;
      const nextIds: string[] = [];

      for (const event of events) {
        if (!isEventEnabled(event, settings)) {
          skippedCount += 1;
          continue;
        }

        const identifier =
          await scheduleLocalReminder(event);

        if (identifier) {
          scheduledCount += 1;
          nextIds.push(identifier);
        } else {
          skippedCount += 1;
        }
      }

      if (settings.daily_summary_enabled) {
        const summaryId =
          await Notifications.scheduleNotificationAsync({
            content: {
              title:
                'Tu resumen diario está listo',
              body: 'Revisa próximos cuidados, registros y novedades de tu mascota en PetCareNow.',
              sound: 'default',
              data: {
                route: '/(app)/(tabs)/index',
                source:
                  'petcarenow-daily-summary',
              },
            },
            trigger: {
              type:
                Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 60 * 60 * 24,
              repeats: true,
              channelId:
                Platform.OS === 'android'
                  ? NOTIFICATION_CHANNEL_ID
                  : undefined,
            },
          });

        nextIds.push(summaryId);
        scheduledCount += 1;
      }

      await setStoredScheduledIds(nextIds);

      return {
        scheduledCount,
        skippedCount,
      };
    } catch (error) {
      throw mapNotificationsError(
        error,
        'No pudimos sincronizar tus recordatorios locales.'
      );
    }
  };

export const syncNotificationsForOwner = async (
  ownerId: string
): Promise<NotificationSyncResult | null> => {
  const permission =
    await getNotificationPermissionStatus();

  if (!permission.granted) {
    return null;
  }

  const settings =
    await getNotificationSettings(ownerId);

  return syncScheduledNotifications({
    ownerId,
    settings,
  });
};
