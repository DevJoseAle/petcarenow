import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { logger } from '@/core/utils/debug';

export default function RootLayout() {
  const isHydrating = useAuthStore((state) => state.isHydrating);

  logger.debug('RootLayout render', { isHydrating });

  useEffect(() => {
    logger.debug('RootLayout hydrateSession called');
    useAuthStore.getState().hydrateSession();
  }, []);

  logger.debug('RootLayout after useEffect', { isHydrating });

  if (isHydrating) {
    logger.debug('RootLayout showing loading');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  logger.debug('RootLayout rendering Stack');
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
