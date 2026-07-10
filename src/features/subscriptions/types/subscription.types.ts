import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';

export type SubscriptionEnvironment =
  | 'preview'
  | 'configured'
  | 'missing_keys'
  | 'unsupported_platform';

export type SubscriptionAccess =
  | 'free'
  | 'premium';

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
  access: SubscriptionAccess;
  entitlementId: string;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  packages: SubscriptionPackageSummary[];
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
