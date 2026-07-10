jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    appOwnership: 'expo',
  },
}));

jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    isConfigured: jest.fn(),
    configure: jest.fn(),
    getAppUserID: jest.fn(),
    logIn: jest.fn(),
    getCustomerInfo: jest.fn(),
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
    setLogLevel: jest.fn(),
  },
  LOG_LEVEL: {
    DEBUG: 'DEBUG',
  },
}));

import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import {
  getSubscriptionSnapshot,
  purchaseSubscriptionPackage,
  restoreSubscriptionPurchases,
} from '../services/subscription.service';

const mockedPurchases =
  Purchases as jest.Mocked<typeof Purchases>;

describe('subscription.service', () => {
  const originalPlatform = Platform.OS;
  const originalAppleKey =
    process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY;
  const originalEntitlement =
    process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
    });
    process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY =
      'appl_test_key';
    process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID =
      'premium';
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', {
      value: originalPlatform,
    });
    process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY =
      originalAppleKey;
    process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID =
      originalEntitlement;
  });

  test('returns preview snapshot in Expo Go', async () => {
    mockedPurchases.isConfigured.mockResolvedValue(
      false
    );
    mockedPurchases.getCustomerInfo.mockResolvedValue(
      {
        entitlements: {
          active: {},
        },
      } as never
    );
    mockedPurchases.getOfferings.mockResolvedValue({
      current: null,
    } as never);

    const result =
      await getSubscriptionSnapshot('user-1');

    expect(result.environment).toBe('preview');
    expect(result.access).toBe('free');
    expect(mockedPurchases.configure).toHaveBeenCalled();
  });

  test('returns missing_keys when api key is absent', async () => {
    process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY =
      '';

    const result =
      await getSubscriptionSnapshot('user-1');

    expect(result.environment).toBe(
      'missing_keys'
    );
    expect(mockedPurchases.configure).not.toHaveBeenCalled();
  });

  test('returns preview purchase result in Expo Go', async () => {
    const result =
      await purchaseSubscriptionPackage(
        'user-1',
        {} as never
      );

    expect(result.kind).toBe('preview');
  });

  test('returns preview restore result in Expo Go', async () => {
    const result =
      await restoreSubscriptionPurchases(
        'user-1'
      );

    expect(result.kind).toBe('preview');
  });
});
