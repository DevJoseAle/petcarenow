import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSettings,
  updateSetting,
} from '../services/settings.service';

jest.mock(
  '@react-native-async-storage/async-storage',
  () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
  })
);

const mockedAsyncStorage =
  AsyncStorage as jest.Mocked<
    typeof AsyncStorage
  >;

describe('settings.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns default settings when storage is empty', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(
      null
    );

    await expect(getSettings()).resolves.toEqual({
      language: 'es',
      theme: 'system',
    });
  });

  test('updates a persisted setting', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({
        language: 'es',
        theme: 'system',
      })
    );
    mockedAsyncStorage.setItem.mockResolvedValue();

    await expect(
      updateSetting('language', 'en')
    ).resolves.toEqual({
      language: 'en',
      theme: 'system',
    });

    expect(
      mockedAsyncStorage.setItem
    ).toHaveBeenCalledWith(
      'pcn:settings',
      JSON.stringify({
        language: 'en',
        theme: 'system',
      })
    );
  });
});
