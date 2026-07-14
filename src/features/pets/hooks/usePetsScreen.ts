import {  useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import { evaluatePetCreationAccess } from '@/features/subscriptions/services/subscription-access.service';
import { usePetStore } from '../store/pet.store';
import { getPetUsageSummary } from '../services/pet.service';
import { Alert } from 'react-native';

export const usePetsScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const {
    pets,
    activePetId,
    isHydrating,
    generalError,
    hydratePets,
    selectPet,
  } = usePetStore();
  const hydrateSubscription =
    useSubscriptionStore(
      (state) => state.hydrate
    );

  useEffect(() => {
    if (userId) {
      hydratePets(userId);
      void hydrateSubscription(userId);
    }
  }, [hydratePets, hydrateSubscription, userId]);

  const activePet =
    pets.find((pet) => pet.id === activePetId) ?? null;

  return {
    pets,
    activePet,
    activePetId,
    isHydrating,
    generalError,
    retry: () =>
      userId ? hydratePets(userId) : Promise.resolve(),
    selectPet,
    goToCreatePet: async () => {
      if (!userId) {
        Alert.alert(
          'Sesión requerida',
          'Necesitamos una sesión activa para validar tu plan.'
        );
        return;
      }

      try {
        await hydrateSubscription(userId);

        const accessTier =
          useSubscriptionStore.getState().accessTier;
        const usage =
          await getPetUsageSummary(userId);
        const decision =
          evaluatePetCreationAccess({
            accessTier,
            usage,
          });
          
        if (decision.status === 'blocked_by_plan') {
          Alert.alert(
            'Límite del plan gratuito',
            decision.message,
            [
              {
                text: 'Más tarde',
                style: 'cancel',
              },
              {
                text: 'Ver Premium',
                onPress: () =>
                  router.push('/subscription'),
              },
            ]
          );
          return;
        }

        router.push('/pet-detail?mode=create');
      } catch (error) {
        Alert.alert(
          'No pudimos validar tu plan',
          error instanceof Error
            ? error.message
            : 'Intenta nuevamente en unos minutos.'
        );
      }
    },
    goToPetDetail: (petId: string) =>
      router.push(`/pet-detail?petId=${petId}`),
  };
};
