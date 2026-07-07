import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { createNativeHeaderOptions } from "@/config/UI/largeTitleScreen";
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthRoutes } from "@/core/navigatorTypes/navigatorTypes";
import { RouteDetails } from "@/core/navigatorTypes/navigatorTypesTitle";


export default function AuthLayout() {
  const router = useRouter();
  const loginTitle = RouteDetails[AuthRoutes.Login].title;
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const isHydrating = useAuthStore(
    (state) => state.isHydrating
  );
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (
      !isHydrating &&
      isAuthenticated &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;
      router.replace('/(app)/(tabs)');
    }

    if (!isAuthenticated) {
      hasRedirectedRef.current = false;
    }
  }, [isAuthenticated, isHydrating, router]);

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

  if (isAuthenticated) {
    return null;
  }

  return (
    <Stack>

      <Stack.Screen
        name="login"
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: 'Crear Cuenta',
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal'
        }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          title: 'Recuperar Contraseña',
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal'
        }} />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
