import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type {
  NotificationDevice,
  NotificationPermissionStatus,
  NotificationSettingKey,
  NotificationSettings,
  NotificationSyncResult,
} from '../types/notification.types';
import {
  getNotificationPermissionStatus,
  getNotificationSettings,
  getRegisteredNotificationDevice,
  openDeviceNotificationSettings,
  registerNotificationDevice,
  requestNotificationPermission,
  syncScheduledNotifications,
  updateNotificationSetting,
} from '../services/notifications.service';

const emptyPermission: NotificationPermissionStatus = {
  status: 'undetermined',
  granted: false,
  canAskAgain: true,
};

export const useNotificationsScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [settings, setSettings] =
    useState<NotificationSettings | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermissionStatus>(
      emptyPermission
    );
  const [device, setDevice] =
    useState<NotificationDevice | null>(null);
  const [syncResult, setSyncResult] =
    useState<NotificationSyncResult | null>(null);
  const [isHydrating, setIsHydrating] =
    useState(true);
  const [isUpdating, setIsUpdating] =
    useState(false);
  const [hasLoadError, setHasLoadError] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  const ownerId = user?.id ?? null;

  const hydrate = async () => {
    if (!ownerId) {
      setHasLoadError(true);
      setGeneralError(
        'No encontramos una sesión activa para cargar tus notificaciones.'
      );
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    setHasLoadError(false);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const [
        permissionStatus,
        nextSettings,
        registeredDevice,
      ] = await Promise.all([
        getNotificationPermissionStatus(),
        getNotificationSettings(ownerId),
        getRegisteredNotificationDevice(ownerId),
      ]);

      setPermission(permissionStatus);
      setSettings(nextSettings);
      setDevice(registeredDevice);

      if (permissionStatus.granted) {
        const result =
          await syncScheduledNotifications({
            ownerId,
            settings: nextSettings,
          });
        setSyncResult(result);
      } else {
        setSyncResult(null);
      }
    } catch (error) {
      setHasLoadError(true);
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar tu configuración de notificaciones.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, [ownerId]);

  const refreshRegistration = async () => {
    if (!ownerId) {
      return;
    }

    setIsUpdating(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const registeredDevice =
        await registerNotificationDevice(ownerId);
      setDevice(registeredDevice);

      if (settings) {
        const result =
          await syncScheduledNotifications({
            ownerId,
            settings,
          });
        setSyncResult(result);
      }

      setSuccessMessage(
        'Este dispositivo quedó registrado para recibir notificaciones.'
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos registrar este dispositivo.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestPermission = async () => {
    if (!ownerId) {
      return;
    }

    setIsUpdating(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const nextPermission =
        await requestNotificationPermission();
      setPermission(nextPermission);

      if (!nextPermission.granted) {
        setSuccessMessage(
          'Cuando quieras activarlas, también podrás hacerlo desde Ajustes del dispositivo.'
        );
        return;
      }

      const registeredDevice =
        await registerNotificationDevice(ownerId);
      setDevice(registeredDevice);

      const nextSettings =
        settings ??
        (await getNotificationSettings(ownerId));
      setSettings(nextSettings);

      const result =
        await syncScheduledNotifications({
          ownerId,
          settings: nextSettings,
        });
      setSyncResult(result);

      setSuccessMessage(
        'Las notificaciones quedaron activas y este dispositivo ya está registrado.'
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos activar las notificaciones.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSetting = async (
    key: NotificationSettingKey
  ) => {
    if (!ownerId || !settings || isUpdating) {
      return;
    }

    const nextValue = !settings[key];

    setIsUpdating(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const nextSettings =
        await updateNotificationSetting(
          ownerId,
          key,
          nextValue
        );
      setSettings(nextSettings);

      if (permission.granted) {
        const result =
          await syncScheduledNotifications({
            ownerId,
            settings: nextSettings,
          });
        setSyncResult(result);
      }

      setSuccessMessage(
        'Tus preferencias de notificaciones se actualizaron correctamente.'
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos actualizar esta preferencia.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    permission,
    settings,
    device,
    syncResult,
    isHydrating,
    isUpdating,
    hasLoadError,
    generalError,
    successMessage,
    retry: hydrate,
    goBack: () => router.back(),
    handleRequestPermission,
    handleToggleSetting,
    refreshRegistration,
    openDeviceSettings:
      openDeviceNotificationSettings,
  };
};
