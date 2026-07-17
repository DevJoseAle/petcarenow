jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

jest.mock('@expo/ui/community/datetime-picker', () => 'DateTimePicker');

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

jest.mock(
  '@react-native-async-storage/async-storage',
  () => {
    const storage = new Map<string, string>();

    return {
      getItem: jest.fn(async (key: string) =>
        storage.has(key)
          ? storage.get(key) ?? null
          : null
      ),
      setItem: jest.fn(
        async (key: string, value: string) => {
          storage.set(key, value);
        }
      ),
      removeItem: jest.fn(async (key: string) => {
        storage.delete(key);
      }),
      clear: jest.fn(async () => {
        storage.clear();
      }),
    };
  }
);
