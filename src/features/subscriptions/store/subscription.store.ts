import { create } from 'zustand';
import {
  getSubscriptionSnapshot,
  sanitizeSubscriptionLoadError,
} from '../services/subscription.service';
import type {
  SubscriptionAccess,
  SubscriptionEnvironment,
  SubscriptionSnapshot,
  SubscriptionStoreSnapshot,
} from '../types/subscription.types';

interface SubscriptionStoreState
  extends SubscriptionStoreSnapshot {
  hydrate: (
    ownerId: string | null
  ) => Promise<SubscriptionSnapshot | null>;
  refresh: (
    ownerId: string | null
  ) => Promise<SubscriptionSnapshot | null>;
  setSnapshot: (
    snapshot: SubscriptionSnapshot | null
  ) => void;
  reset: () => void;
}

const buildStoreStateFromSnapshot = (
  snapshot: SubscriptionSnapshot | null
): Pick<
  SubscriptionStoreState,
  | 'snapshot'
  | 'accessTier'
  | 'isPremium'
  | 'environment'
  | 'entitlementId'
> => ({
  snapshot,
  accessTier: snapshot?.access ?? 'free',
  isPremium: snapshot?.access === 'premium',
  environment: snapshot?.environment ?? null,
  entitlementId: snapshot?.entitlementId ?? null,
});

const getInitialState = (): SubscriptionStoreSnapshot => ({
  snapshot: null,
  accessTier: 'free',
  isPremium: false,
  environment: null,
  entitlementId: null,
  lastValidatedAt: null,
  isHydrating: false,
  generalError: '',
});

const buildFallbackSnapshot = ({
  environment,
  entitlementId,
}: {
  environment: SubscriptionEnvironment | null;
  entitlementId: string | null;
}): SubscriptionSnapshot | null => {
  if (!environment) {
    return null;
  }

  return {
    environment,
    storeMode: 'unknown',
    access: 'free',
    entitlementId: entitlementId ?? 'premium',
    appUserId: null,
    originalAppUserId: null,
    customerInfo: null,
    offering: null,
    packages: [],
  };
};

export const useSubscriptionStore =
  create<SubscriptionStoreState>((set, get) => ({
    ...getInitialState(),
    hydrate: async (ownerId) => {
      if (!ownerId) {
        set({
          ...buildStoreStateFromSnapshot(null),
          isHydrating: false,
          generalError:
            'No encontramos una sesión activa para cargar tu suscripción.',
        });
        return null;
      }

      set({
        isHydrating: true,
        generalError: '',
      });

      try {
        const snapshot =
          await getSubscriptionSnapshot(ownerId);

        set({
          ...buildStoreStateFromSnapshot(
            snapshot
          ),
          isHydrating: false,
          generalError: '',
          lastValidatedAt:
            new Date().toISOString(),
        });

        return snapshot;
      } catch (error) {
        const handledError =
          sanitizeSubscriptionLoadError(error);
        const previousSnapshot =
          get().snapshot;
        const nextSnapshot =
          previousSnapshot ??
          buildFallbackSnapshot({
            environment:
              handledError.environment,
            entitlementId:
              get().entitlementId,
          });

        set({
          ...buildStoreStateFromSnapshot(
            nextSnapshot
          ),
          isHydrating: false,
          generalError: handledError.message,
        });

        return nextSnapshot;
      }
    },
    refresh: async (ownerId) =>
      get().hydrate(ownerId),
    setSnapshot: (snapshot) =>
      set({
        ...buildStoreStateFromSnapshot(
          snapshot
        ),
        lastValidatedAt: snapshot
          ? new Date().toISOString()
          : null,
      }),
    reset: () => set(getInitialState()),
  }));
