import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useOnboardingStore } from '@/features/auth/store/onboarding.store';

export default function RootLayout() {
  const hydrateSession = useAuthStore(
    (state) => state.hydrateSession
  );
  const setSession = useAuthStore(
    (state) => state.setSession
  );
  const hydrateOnboarding =
    useOnboardingStore(
      (state) => state.hydrateOnboarding
    );

  useEffect(() => {
    hydrateSession();
    hydrateOnboarding();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    hydrateOnboarding,
    hydrateSession,
    setSession,
  ]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" options={{
        title: "PetCareNow",
        headerLargeTitleEnabled: true,
      }} />
    </Stack>
  );
}
