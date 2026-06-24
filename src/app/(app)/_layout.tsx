
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { createNativeHeaderOptions } from '@/config/UI/largeTitleScreen';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { HomeRoutes } from '@/core/navigatorTypes/navigatorTypes';
import { RouteDetails } from '@/core/navigatorTypes/navigatorTypesTitle';
import { Stack } from 'expo-router'


export default function HomeLayout() {
  const indexTitle = RouteDetails[HomeRoutes.Home].title;
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );

  if (isHydrating) {
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

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={createNativeHeaderOptions(indexTitle)} />
    </Stack>
  )
}
