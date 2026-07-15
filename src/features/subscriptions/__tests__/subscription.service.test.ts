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
    syncPurchases: jest.fn(),
    invalidateCustomerInfoCache: jest.fn(),
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
  sanitizeSubscriptionActionError,
  sanitizeSubscriptionLoadError,
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
    mockedPurchases.getAppUserID.mockResolvedValue(
      'user-1'
    );
    mockedPurchases.getCustomerInfo.mockResolvedValue(
      {
        originalAppUserId: 'user-1',
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
    expect(result.storeMode).toBe('app_store');
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

  test('sanitizes provider load errors', () => {
    const result =
      sanitizeSubscriptionLoadError(
        new Error(
          '[RevenueCat] Native module (RNPurchases) not found.'
        )
      );

    expect(result.environment).toBe(
      'provider_unavailable'
    );
    expect(result.message).not.toContain(
      'RevenueCat'
    );
    expect(result.message).not.toContain(
      'RNPurchases'
    );
  });

  test('sanitizes provider action errors', () => {
    const message =
      sanitizeSubscriptionActionError(
        new Error(
          '[RevenueCat] Native module (RNPurchases) not found.'
        ),
        'fallback'
      );

    expect(message).not.toContain(
      'RevenueCat'
    );
    expect(message).not.toContain(
      'RNPurchases'
    );
    expect(message).not.toBe('fallback');
  });
});
