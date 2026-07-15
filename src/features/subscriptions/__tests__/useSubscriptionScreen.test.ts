import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react-native';
import { useSubscriptionScreen } from '../hooks/useSubscriptionScreen';
import {
  getSubscriptionSnapshot,
  purchaseSubscriptionPackage,
  restoreSubscriptionPurchases,
} from '../services/subscription.service';
import { useSubscriptionStore } from '../store/subscription.store';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('../services/subscription.service', () => ({
  subscriptionBenefits: [
    {
      id: 'b1',
      title: 'Premium',
      description: 'Beneficio premium',
    },
  ],
  getSubscriptionSnapshot: jest.fn(),
  purchaseSubscriptionPackage: jest.fn(),
  restoreSubscriptionPurchases: jest.fn(),
  sanitizeSubscriptionLoadError: jest.fn(
    (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : String(error ?? '');

      if (
        message.includes('RevenueCat') ||
        message.includes('RNPurchases')
      ) {
        return {
          environment:
            'provider_unavailable' as const,
          message:
            'La suscripción premium no está disponible en este build todavía. Reinstala o recompila la app de desarrollo y vuelve a intentarlo.',
        };
      }

      return {
        environment: null,
        message: message || 'Error de prueba',
      };
    }
  ),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: { id: string } | null;
    }) => unknown
  ) =>
    selector({
      user: { id: 'user-1' },
    }),
}));

describe('useSubscriptionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useSubscriptionStore.getState().reset();
    });
    (
      getSubscriptionSnapshot as jest.Mock
    ).mockResolvedValue({
      environment: 'preview',
      storeMode: 'app_store',
      access: 'free',
      entitlementId: 'premium',
      appUserId: 'user-1',
      originalAppUserId: 'user-1',
      customerInfo: null,
      offering: null,
      packages: [
        {
          id: 'monthly',
          identifier: '$rc_monthly',
          title: 'Premium mensual',
          price: '$4.99',
          description: 'Plan mensual',
          package: {
            identifier: '$rc_monthly',
          },
        },
      ],
    });
    (
      purchaseSubscriptionPackage as jest.Mock
    ).mockResolvedValue({
      kind: 'preview',
      message: 'Preview',
    });
    (
      restoreSubscriptionPurchases as jest.Mock
    ).mockResolvedValue({
      kind: 'preview',
      message: 'Restore preview',
    });
  });

  afterEach(() => {
    act(() => {
      useSubscriptionStore.getState().reset();
    });
  });

  test('hydrates the subscription snapshot', async () => {
    const { result } = renderHook(() =>
      useSubscriptionScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(result.current.snapshot?.environment).toBe(
      'preview'
    );
    expect(result.current.currentPackage?.title).toBe(
      'Premium mensual'
    );
  });

  test('handles purchase action', async () => {
    const { result } = renderHook(() =>
      useSubscriptionScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handlePurchase();
    });

    expect(
      purchaseSubscriptionPackage
    ).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        identifier: '$rc_monthly',
      })
    );
    expect(
      result.current.feedbackMessage
    ).toContain('Preview');
  });

  test('handles restore action', async () => {
    const { result } = renderHook(() =>
      useSubscriptionScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    await act(async () => {
      await result.current.handleRestore();
    });

    expect(
      restoreSubscriptionPurchases
    ).toHaveBeenCalledWith('user-1');
  });

  test('maps provider errors to controlled state', async () => {
    (
      getSubscriptionSnapshot as jest.Mock
    ).mockRejectedValue(
      new Error(
        '[RevenueCat] Native module (RNPurchases) not found.'
      )
    );

    const { result } = renderHook(() =>
      useSubscriptionScreen()
    );

    await waitFor(() => {
      expect(result.current.isHydrating).toBe(
        false
      );
    });

    expect(result.current.snapshot?.environment).toBe(
      'provider_unavailable'
    );
    expect(result.current.generalError).not.toContain(
      'RevenueCat'
    );
    expect(result.current.generalError).not.toContain(
      'RNPurchases'
    );
  });
});
