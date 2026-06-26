import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getOnboardedValue } from '@/features/auth/services/onboarding.service';

export default function Index() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );
  const [isOnboardingHydrating, setIsOnboardingHydrating] =
    useState(true);
  const [isOnboarded, setIsOnboarded] = useState(
    false
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateOnboarding = async () => {
      const onboarded =
        await getOnboardedValue();

      if (isMounted) {
        setIsOnboarded(onboarded);
        setIsOnboardingHydrating(false);
      }
    };

    hydrateOnboarding();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isHydrating || isOnboardingHydrating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
