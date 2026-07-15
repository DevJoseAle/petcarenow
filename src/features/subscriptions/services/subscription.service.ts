import { Platform } from 'react-native';
import Constants from 'expo-constants';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import type {
  PurchaseActionResult,
  SubscriptionPackageSummary,
  SubscriptionSnapshot,
  SubscriptionStoreMode,
} from '../types/subscription.types';

const PROVIDER_UNAVAILABLE_MESSAGE =
  'La suscripción premium no está disponible en este build todavía. Reinstala o recompila la app de desarrollo y vuelve a intentarlo.';

const GENERIC_LOAD_ERROR =
  'No pudimos cargar la suscripción en este momento. Intenta nuevamente en unos minutos.';

const GENERIC_PURCHASE_ERROR =
  'No pudimos procesar la compra en este momento. Intenta nuevamente más tarde.';

const GENERIC_RESTORE_ERROR =
  'No pudimos restaurar tus compras en este momento. Intenta nuevamente más tarde.';

const getAppleApiKey = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY;

const getGoogleApiKey = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;

const getTestApiKey = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;

const shouldUseTestStore = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE ===
  'true';

const getEntitlementId = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID ??
  'premium';

const getStoreMode = (): SubscriptionStoreMode => {
  if (shouldUseTestStore()) {
    return 'test_store';
  }

  if (Platform.OS === 'ios') {
    return 'app_store';
  }

  if (Platform.OS === 'android') {
    return 'play_store';
  }

  return 'unknown';
};

export const subscriptionBenefits = [
  {
    id: 'premium-care',
    title: 'Herramientas premium',
    description:
      'Desbloquea funciones exclusivas para profundizar el cuidado de tu mascota.',
  },
  {
    id: 'better-planning',
    title: 'Planificación mejorada',
    description:
      'Accede a una experiencia más completa para organizar controles, seguimientos y recordatorios.',
  },
  {
    id: 'future-upgrades',
    title: 'Beneficios futuros',
    description:
      'Tu plan premium quedará listo para futuras mejoras de producto y ventajas exclusivas.',
  },
] as const;

const isPreviewMode = () =>
  Constants.appOwnership === 'expo';

const getPlatformApiKey = () => {
  if (shouldUseTestStore()) {
    return getTestApiKey();
  }

  if (Platform.OS === 'ios') {
    return getAppleApiKey();
  }

  if (Platform.OS === 'android') {
    return getGoogleApiKey();
  }

  return null;
};

const getActiveEntitlement = (
  customerInfo: CustomerInfo | null
) =>
  customerInfo?.entitlements.active[
    getEntitlementId()
  ] ?? null;

const mapPackages = (
  availablePackages: PurchasesPackage[]
): SubscriptionPackageSummary[] =>
  availablePackages.map((item) => ({
    id: item.identifier,
    identifier: item.identifier,
    title:
      item.product.title ||
      item.product.identifier,
    price:
      item.product.priceString ||
      'Precio no disponible',
    description:
      item.product.description ||
      'Suscripción premium',
    package: item,
  }));

export const isRevenueCatPreviewMode = () =>
  isPreviewMode();

const isProviderUnavailableError = (
  error: unknown
) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error ?? '');
  const normalizedMessage =
    message.toLowerCase();

  return (
    normalizedMessage.includes('rnpurchases') ||
    normalizedMessage.includes('revenuecat') ||
    normalizedMessage.includes('native module') ||
    normalizedMessage.includes('not found') ||
    normalizedMessage.includes('not properly linked')
  );
};

export const sanitizeSubscriptionLoadError = (
  error: unknown
) => {
  if (isProviderUnavailableError(error)) {
    return {
      environment:
        'provider_unavailable' as const,
      message:
        PROVIDER_UNAVAILABLE_MESSAGE,
    };
  }

  return {
    environment: null,
    message:
      error instanceof Error &&
      error.message.trim().length > 0
        ? error.message
        : GENERIC_LOAD_ERROR,
  };
};

export const sanitizeSubscriptionActionError = (
  error: unknown,
  fallbackMessage: string
) => {
  if (isProviderUnavailableError(error)) {
    return PROVIDER_UNAVAILABLE_MESSAGE;
  }

  if (
    error instanceof Error &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return fallbackMessage;
};

export const configureRevenueCat = async (
  ownerId: string
) => {
  const apiKey = getPlatformApiKey();

  if (!apiKey) {
    throw new Error(
      'Faltan las llaves públicas de RevenueCat para esta plataforma.'
    );
  }

  const configured =
    await Purchases.isConfigured();

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  if (!configured) {
    Purchases.configure({
      apiKey,
      appUserID: ownerId,
    });
    return;
  }

  const currentAppUserId =
    await Purchases.getAppUserID();

  if (currentAppUserId !== ownerId) {
    await Purchases.logIn(ownerId);
  }
};

export const getSubscriptionSnapshot = async (
  ownerId: string
): Promise<SubscriptionSnapshot> => {
  if (
    Platform.OS !== 'ios' &&
    Platform.OS !== 'android'
  ) {
    return {
      environment: 'unsupported_platform',
      storeMode: getStoreMode(),
      access: 'free',
      entitlementId: getEntitlementId(),
      appUserId: ownerId,
      originalAppUserId: null,
      customerInfo: null,
      offering: null,
      packages: [],
    };
  }

  if (!getPlatformApiKey()) {
    return {
      environment: 'missing_keys',
      storeMode: getStoreMode(),
      access: 'free',
      entitlementId: getEntitlementId(),
      appUserId: ownerId,
      originalAppUserId: null,
      customerInfo: null,
      offering: null,
      packages: [],
    };
  }

  await configureRevenueCat(ownerId);
  Purchases.invalidateCustomerInfoCache();

  if (!shouldUseTestStore()) {
    await Purchases.syncPurchases();
  }

  const appUserId =
    await Purchases.getAppUserID();

  const [
    customerInfo,
    offerings,
  ] = await Promise.all([
    Purchases.getCustomerInfo(),
    Purchases.getOfferings(),
  ]);

  const currentOffering =
    offerings.current ?? null;
  const packages = currentOffering
    ? mapPackages(currentOffering.availablePackages)
    : [];

  return {
    environment: isPreviewMode()
      ? 'preview'
      : 'configured',
    storeMode: getStoreMode(),
    access: getActiveEntitlement(customerInfo)
      ? 'premium'
      : 'free',
    entitlementId: getEntitlementId(),
    appUserId,
    originalAppUserId:
      customerInfo?.originalAppUserId ?? null,
    customerInfo,
    offering: currentOffering,
    packages,
  };
};

export const purchaseSubscriptionPackage =
  async (
    ownerId: string,
    selectedPackage: PurchasesPackage
  ): Promise<PurchaseActionResult> => {
    if (isPreviewMode()) {
      return {
        kind: 'preview',
        message:
          'Estás en Expo Go. Aquí puedes probar la UI, pero la compra real requiere un development build.',
      };
    }

    await configureRevenueCat(ownerId);

    try {
      const result =
        await Purchases.purchasePackage(
          selectedPackage
        );

      return {
        kind: 'purchased',
        message:
          'La compra se procesó correctamente.',
        customerInfo: result.customerInfo,
      };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'userCancelled' in error &&
        error.userCancelled
      ) {
        return {
          kind: 'cancelled',
          message:
            'La compra fue cancelada por el usuario.',
        };
      }

      return {
        kind: 'error',
        message:
          sanitizeSubscriptionActionError(
            error,
            GENERIC_PURCHASE_ERROR
          ),
      };
    }
  };

export const restoreSubscriptionPurchases =
  async (
    ownerId: string
  ): Promise<PurchaseActionResult> => {
    if (isPreviewMode()) {
      return {
        kind: 'preview',
        message:
          'La restauración real de compras requiere un development build.',
      };
    }

    await configureRevenueCat(ownerId);

    try {
      const customerInfo =
        await Purchases.restorePurchases();

      return {
        kind: 'restored',
        message:
          'Las compras se restauraron correctamente.',
        customerInfo,
      };
    } catch (error) {
      return {
        kind: 'error',
        message:
          sanitizeSubscriptionActionError(
            error,
            GENERIC_RESTORE_ERROR
          ),
      };
    }
  };
