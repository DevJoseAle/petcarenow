import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { logger } from '@/core/utils/debug';

export default function AppLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const hasPets = usePetOnboardingGateStore(
    (state) => state.hasPets
  );
  const isPetGateHydrating =
    usePetOnboardingGateStore(
      (state) => state.isHydrating
    );
  const petGateError =
    usePetOnboardingGateStore(
      (state) => state.generalError
    );
  const hydratePetStatus =
    usePetOnboardingGateStore(
      (state) => state.hydratePetStatus
    );
  const hydratePets = usePetStore(
    (state) => state.hydratePets
  );
  const resetPets = usePetStore(
    (state) => state.reset
  );
  const prevUserIdRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      userId &&
      userId !== prevUserIdRef.current
    ) {
      logger.debug(
        'AppLayout calling hydratePetStatus',
        { userId }
      );
      prevUserIdRef.current = userId;
      hasNavigatedRef.current = false;
      hydratePetStatus(userId);
      hydratePets(userId);
    }

    if (!userId) {
      prevUserIdRef.current = null;
      resetPets();
    }
  }, [
    hydratePetStatus,
    hydratePets,
    isAuthenticated,
    resetPets,
    userId,
  ]);

  useEffect(() => {
    if (
      isHydrating ||
      isPetGateHydrating ||
      !isAuthenticated
    ) {
      return;
    }

    const needsOnboarding = petGateError || !hasPets;

    if (
      needsOnboarding &&
      !hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = true;
      router.replace('/pet-onboarding');
    } else if (
      !needsOnboarding &&
      hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = false;
    }
  }, [
    hasPets,
    isAuthenticated,
    isHydrating,
    isPetGateHydrating,
    petGateError,
    router,
  ]);

  if (isHydrating || isPetGateHydrating) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pet-detail" />
      <Stack.Screen name="pet-onboarding" />
      <Stack.Screen name="care-profile" />
      <Stack.Screen name="event-detail" />
      <Stack.Screen name="record-detail" />
      <Stack.Screen name="record-entry" />
      <Stack.Screen name="event-entry" />
      <Stack.Screen name="veterinaries" />
      <Stack.Screen name="saved-veterinaries" />
      <Stack.Screen name="user-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="veterinary-profile" />
      <Stack.Screen name="quick-actions" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
