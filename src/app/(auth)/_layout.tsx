import { createNativeHeaderOptions } from "@/features/config/UI/largeTitleScreen";
import { AuthRoutes } from "@/features/core/navigatorTypes/navigatorTypes";
import { RouteDetails } from "@/features/core/navigatorTypes/navigatorTypesTitle";
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
        options={createNativeHeaderOptions("")}
      />
    </Stack>
  );
}