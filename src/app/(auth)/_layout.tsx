import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { createNativeHeaderOptions } from "@/config/UI/largeTitleScreen";
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthRoutes } from "@/core/navigatorTypes/navigatorTypes";
import { RouteDetails } from "@/core/navigatorTypes/navigatorTypesTitle";
import { Stack } from "expo-router";


export default function AuthLayout() {
  const loginTitle = RouteDetails[AuthRoutes.Login].title;
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

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }
  
  return (
    <Stack>

      <Stack.Screen
        name="login"
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="register"
        options={createNativeHeaderOptions("Crear Cuenta")}
      />
      <Stack.Screen
        name="forgot-password"
        options={createNativeHeaderOptions("Recuperar contraseña")}
      />
            <Stack.Screen
        name="onboarding"
        options={{headerShown: false}}
      />
    </Stack>
  );
}
