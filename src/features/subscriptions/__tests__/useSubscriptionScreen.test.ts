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
    (
      getSubscriptionSnapshot as jest.Mock
    ).mockResolvedValue({
      environment: 'preview',
      access: 'free',
      entitlementId: 'premium',
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
});
