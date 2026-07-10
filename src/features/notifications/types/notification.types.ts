export type NotificationPermissionState =
  | 'granted'
  | 'denied'
  | 'undetermined';

export interface NotificationPermissionStatus {
  status: NotificationPermissionState;
  granted: boolean;
  canAskAgain: boolean;
}

export interface NotificationSettings {
  owner_id: string;
  upcoming_care_enabled: boolean;
  medications_enabled: boolean;
  vaccines_enabled: boolean;
  important_alerts_enabled: boolean;
  daily_summary_enabled: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export type NotificationSettingKey =
  keyof Omit<
    NotificationSettings,
    'owner_id' | 'created_at' | 'updated_at'
  >;

export interface NotificationDevice {
  id: string;
  owner_id: string;
  expo_push_token: string;
  platform: string;
  device_name: string | null;
  is_active: boolean;
  last_registered_at: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface NotificationSyncResult {
  scheduledCount: number;
  skippedCount: number;
}
