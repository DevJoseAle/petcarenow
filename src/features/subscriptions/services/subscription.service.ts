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
} from '../types/subscription.types';

const getAppleApiKey = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY;

const getGoogleApiKey = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;

const getEntitlementId = () =>
  process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID ??
  'premium';

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
      access: 'free',
      entitlementId: getEntitlementId(),
      customerInfo: null,
      offering: null,
      packages: [],
    };
  }

  if (!getPlatformApiKey()) {
    return {
      environment: 'missing_keys',
      access: 'free',
      entitlementId: getEntitlementId(),
      customerInfo: null,
      offering: null,
      packages: [],
    };
  }

  await configureRevenueCat(ownerId);

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
    access: getActiveEntitlement(customerInfo)
      ? 'premium'
      : 'free',
    entitlementId: getEntitlementId(),
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
          error instanceof Error
            ? error.message
            : 'No pudimos procesar la compra.',
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
          error instanceof Error
            ? error.message
            : 'No pudimos restaurar tus compras.',
      };
    }
  };
