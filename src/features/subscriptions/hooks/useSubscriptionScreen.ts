import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  getSubscriptionSnapshot,
  purchaseSubscriptionPackage,
  restoreSubscriptionPurchases,
  subscriptionBenefits,
} from '../services/subscription.service';
import type {
  PurchaseActionResult,
  SubscriptionSnapshot,
} from '../types/subscription.types';

export const useSubscriptionScreen = () => {
  const router = useRouter();
  const ownerId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [snapshot, setSnapshot] =
    useState<SubscriptionSnapshot | null>(null);
  const [isHydrating, setIsHydrating] =
    useState(true);
  const [isPurchasing, setIsPurchasing] =
    useState(false);
  const [isRestoring, setIsRestoring] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [feedbackMessage, setFeedbackMessage] =
    useState('');

  const hydrate = async () => {
    if (!ownerId) {
      setGeneralError(
        'No encontramos una sesión activa para cargar tu suscripción.'
      );
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    setGeneralError('');
    setFeedbackMessage('');

    try {
      const nextSnapshot =
        await getSubscriptionSnapshot(ownerId);
      setSnapshot(nextSnapshot);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar tu estado de suscripción.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    void hydrate();
  }, [ownerId]);

  const applyPurchaseResult = async (
    result: PurchaseActionResult
  ) => {
    setFeedbackMessage(result.message);

    if (
      result.kind === 'purchased' ||
      result.kind === 'restored'
    ) {
      await hydrate();
    }
  };

  const handlePurchase = async () => {
    if (
      !ownerId ||
      !snapshot?.packages.length ||
      isPurchasing
    ) {
      return;
    }

    setIsPurchasing(true);
    setGeneralError('');
    setFeedbackMessage('');

    try {
      const result =
        await purchaseSubscriptionPackage(
          ownerId,
          snapshot.packages[0].package
        );
      await applyPurchaseResult(result);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos iniciar la compra.'
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
    setGeneralError('');
    setFeedbackMessage('');

    try {
      const result =
        await restoreSubscriptionPurchases(
          ownerId
        );
      await applyPurchaseResult(result);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos restaurar tus compras.'
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const currentPackage =
    snapshot?.packages[0] ?? null;

  return {
    benefits: subscriptionBenefits,
    snapshot,
    currentPackage,
    isHydrating,
    isPurchasing,
    isRestoring,
    generalError,
    feedbackMessage,
    goBack: () => router.back(),
    retry: hydrate,
    handlePurchase,
    handleRestore,
  };
};
