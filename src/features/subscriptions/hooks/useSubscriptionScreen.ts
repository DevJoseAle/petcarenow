import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '../store/subscription.store';
import {
  purchaseSubscriptionPackage,
  restoreSubscriptionPurchases,
  sanitizeSubscriptionActionError,
  subscriptionBenefits,
} from '../services/subscription.service';
import type {
  PurchaseActionResult,
  SubscriptionPackageSummary,
} from '../types/subscription.types';

export const useSubscriptionScreen = () => {
  const router = useRouter();
  const ownerId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const {
    snapshot,
    isHydrating,
    generalError: hydrationError,
    hydrate,
  } = useSubscriptionStore();
  const [isPurchasing, setIsPurchasing] =
    useState(false);
  const [isRestoring, setIsRestoring] =
    useState(false);
  const [actionError, setActionError] =
    useState('');
  const [feedbackMessage, setFeedbackMessage] =
    useState('');
  const [
    selectedPackageId,
    setSelectedPackageId,
  ] = useState<string | null>(null);

  const hydrateSnapshot = async () => {
    setActionError('');
    setFeedbackMessage('');
    await hydrate(ownerId);
  };

  useEffect(() => {
    void hydrateSnapshot();
  }, [ownerId]);

  useEffect(() => {
    const firstPackageId =
      snapshot?.packages[0]?.id ?? null;

    if (!snapshot?.packages.length) {
      setSelectedPackageId(null);
      return;
    }

    const selectedPackageStillExists =
      snapshot.packages.some(
        (item) => item.id === selectedPackageId
      );

    if (!selectedPackageStillExists) {
      setSelectedPackageId(firstPackageId);
    }
  }, [selectedPackageId, snapshot]);

  const applyPurchaseResult = async (
    result: PurchaseActionResult
  ) => {
    setFeedbackMessage(result.message);

    if (
      result.kind === 'purchased' ||
      result.kind === 'restored'
    ) {
      await hydrate(ownerId);
    }
  };

  const handlePurchase = async () => {
    const selectedPackage =
      snapshot?.packages.find(
        (item) => item.id === selectedPackageId
      ) ?? snapshot?.packages[0];

    if (
      !ownerId ||
      !selectedPackage ||
      isPurchasing
    ) {
      return;
    }

    setIsPurchasing(true);
    setActionError('');
    setFeedbackMessage('');

    try {
      const result =
        await purchaseSubscriptionPackage(
          ownerId,
          selectedPackage.package
        );
      await applyPurchaseResult(result);
    } catch (error) {
      setActionError(
        sanitizeSubscriptionActionError(
          error,
          'No pudimos iniciar la compra.'
        )
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!ownerId || isRestoring) {
      return;
    }

    setIsRestoring(true);
    setActionError('');
    setFeedbackMessage('');

    try {
      const result =
        await restoreSubscriptionPurchases(
          ownerId
        );
      await applyPurchaseResult(result);
    } catch (error) {
      setActionError(
        sanitizeSubscriptionActionError(
          error,
          'No pudimos restaurar tus compras.'
        )
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const currentPackage =
    snapshot?.packages.find(
      (item) => item.id === selectedPackageId
    ) ??
    snapshot?.packages[0] ??
    null;

  const handleSelectPackage = (
    selectedPackage: SubscriptionPackageSummary
  ) => {
    setSelectedPackageId(selectedPackage.id);
  };

  return {
    benefits: subscriptionBenefits,
    snapshot,
    currentPackage,
    packages: snapshot?.packages ?? [],
    selectedPackageId,
    isHydrating,
    isPurchasing,
    isRestoring,
    generalError:
      actionError || hydrationError,
    feedbackMessage,
    goBack: () => router.back(),
    retry: hydrateSnapshot,
    handleSelectPackage,
    handlePurchase,
    handleRestore,
  };
};
