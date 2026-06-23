

import { createNativeHeaderOptions } from '@/config/UI/largeTitleScreen';
import { HomeRoutes } from '@/core/navigatorTypes/navigatorTypes';
import { RouteDetails } from '@/core/navigatorTypes/navigatorTypesTitle';
import { Stack } from 'expo-router'


export default function HomeLayout() {
    const indexTitle = RouteDetails[HomeRoutes.Home].title;

  return (
    <Stack>
      <Stack.Screen name="index" options={createNativeHeaderOptions(indexTitle)} />
    </Stack>
  )
}