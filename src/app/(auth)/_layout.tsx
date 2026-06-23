
import { createNativeHeaderOptions } from "@/config/UI/largeTitleScreen";
import { AuthRoutes } from "@/core/navigatorTypes/navigatorTypes";
import { RouteDetails } from "@/core/navigatorTypes/navigatorTypesTitle";
import { Stack } from "expo-router";


export default function AuthLayout() {

  const loginTitle = RouteDetails[AuthRoutes.Login].title;
  
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
    </Stack>
  );
}