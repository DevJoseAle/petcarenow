import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { createNativeHeaderOptions } from '@/config/UI/largeTitleScreen';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { HomeRoutes } from '@/core/navigatorTypes/navigatorTypes';
import { RouteDetails } from '@/core/navigatorTypes/navigatorTypesTitle';
import { logger } from '@/core/utils/debug';

export default function HomeLayout() {
  const router = useRouter();
  const indexTitle = RouteDetails[HomeRoutes.Home].title;
  const petOnboardingTitle = RouteDetails[HomeRoutes.PetOnboarding].title;
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  
  const hasPets = usePetOnboardingGateStore((state) => state.hasPets);
  const isPetGateHydrating = usePetOnboardingGateStore((state) => state.isHydrating);
  const petGateError = usePetOnboardingGateStore((state) => state.generalError);
  const hydratePetStatus = usePetOnboardingGateStore((state) => state.hydratePetStatus);

  const prevUserIdRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);

  logger.debug('HomeLayout render', {
    isAuthenticated,
    isHydrating,
    userId,
    hasPets,
    isPetGateHydrating,
  });

  useEffect(() => {
    if (isAuthenticated && userId && userId !== prevUserIdRef.current) {
      logger.debug('HomeLayout calling hydratePetStatus', { userId });
      prevUserIdRef.current = userId;
      hasNavigatedRef.current = false;
      hydratePetStatus(userId);
    }
  }, [isAuthenticated, userId, hydratePetStatus]);

  useEffect(() => {
    if (isHydrating || isPetGateHydrating || !isAuthenticated) {
      return;
    }

    const needsOnboarding = petGateError || !hasPets;

    logger.debug('HomeLayout navigation effect', { needsOnboarding, hasNavigatedRef: hasNavigatedRef.current });

    if (needsOnboarding && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      logger.info('HomeLayout navigating to pet-onboarding');
      router.push('/pet-onboarding');
    } else if (!needsOnboarding && hasNavigatedRef.current) {
      hasNavigatedRef.current = false;
    }
  }, [isHydrating, isPetGateHydrating, isAuthenticated, petGateError, hasPets, router]);

  if (isHydrating || isPetGateHydrating) {
    logger.debug('HomeLayout loading state', { isHydrating, isPetGateHydrating });
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={createNativeHeaderOptions(indexTitle)} 
      />
      <Stack.Screen
        name="pet-onboarding"
        options={createNativeHeaderOptions(petOnboardingTitle)}
      />
    </Stack>
  );
}
