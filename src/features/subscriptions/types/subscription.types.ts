import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';

export type SubscriptionEnvironment =
  | 'preview'
  | 'configured'
  | 'missing_keys'
  | 'provider_unavailable'
  | 'unsupported_platform';

export type SubscriptionStoreMode =
  | 'test_store'
  | 'app_store'
  | 'play_store'
  | 'unknown';

export type SubscriptionAccess =
  | 'free'
  | 'premium';

export interface SubscriptionPlanLimits {
  maxPets: number | null;
  maxEvents: number | null;
}

export type SubscriptionAccessDecisionStatus =
  | 'allowed'
  | 'blocked_by_plan'
  | 'unsupported';

export interface SubscriptionAccessDecision {
  status: SubscriptionAccessDecisionStatus;
  message: string;
}

export interface SubscriptionBenefit {
  id: string;
  title: string;
  description: string;
}

export interface SubscriptionPackageSummary {
  id: string;
  identifier: string;
  title: string;
  price: string;
  description: string;
  package: PurchasesPackage;
}

export interface SubscriptionSnapshot {
  environment: SubscriptionEnvironment;
  storeMode: SubscriptionStoreMode;
  access: SubscriptionAccess;
  entitlementId: string;
  appUserId: string | null;
  originalAppUserId: string | null;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  packages: SubscriptionPackageSummary[];
}

export interface SubscriptionStoreSnapshot {
  snapshot: SubscriptionSnapshot | null;
  accessTier: SubscriptionAccess;
  isPremium: boolean;
  environment: SubscriptionEnvironment | null;
  entitlementId: string | null;
  lastValidatedAt: string | null;
  isHydrating: boolean;
  generalError: string;
}

export interface PurchaseActionResult {
  kind:
    | 'purchased'
    | 'restored'
    | 'cancelled'
    | 'preview'
    | 'error';
  message: string;
  customerInfo?: CustomerInfo | null;
}
