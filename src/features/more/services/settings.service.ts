import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguagePreference = 'es' | 'en';
export type AppThemePreference = 'system';

export interface AppSettings {
  language: AppLanguagePreference;
  theme: AppThemePreference;
}

const SETTINGS_STORAGE_KEY = 'pcn:settings';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  theme: 'system',
};

const isValidLanguage = (
  value: unknown
): value is AppLanguagePreference =>
  value === 'es' || value === 'en';

const isValidTheme = (
  value: unknown
): value is AppThemePreference => value === 'system';

const mapSettingsError = (action: 'load' | 'update') =>
  new Error(
    action === 'load'
      ? 'No pudimos cargar tu configuración.'
      : 'No pudimos guardar tu configuración.'
  );

const sanitizeSettings = (
  value: unknown
): AppSettings => {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return DEFAULT_SETTINGS;
  }

  const candidate = value as Partial<AppSettings>;

  return {
    language: isValidLanguage(candidate.language)
      ? candidate.language
      : DEFAULT_SETTINGS.language,
    theme: isValidTheme(candidate.theme)
      ? candidate.theme
      : DEFAULT_SETTINGS.theme,
  };
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const rawValue = await AsyncStorage.getItem(
      SETTINGS_STORAGE_KEY
    );

    if (!rawValue) {
      return DEFAULT_SETTINGS;
    }

    return sanitizeSettings(JSON.parse(rawValue));
  } catch {
    throw mapSettingsError('load');
  }
};

export const updateSetting = async <
  K extends keyof AppSettings,
>(
  key: K,
  value: AppSettings[K]
): Promise<AppSettings> => {
  try {
    const currentSettings = await getSettings();
    const nextSettings = {
      ...currentSettings,
      [key]: value,
    };

    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(nextSettings)
    );

    return nextSettings;
  } catch {
    throw mapSettingsError('update');
  }
};
