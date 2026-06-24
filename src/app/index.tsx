import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useOnboardingStore } from '@/features/auth/store/onboarding.store';

export default function Index() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );
  const isOnboarded = useOnboardingStore(
    (state) => state.isOnboarded
  );
  const isOnboardingHydrating =
    useOnboardingStore(
      (state) => state.isHydrating
    );

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
    return <Redirect href="/(app)" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
