

import { Stack } from 'expo-router'
import { RouteDetails } from '@/features/core/navigatorTypes/navigatorTypesTitle'
import { HomeRoutes } from '@/features/core/navigatorTypes/navigatorTypes';
import { createNativeHeaderOptions } from '@/features/config/UI/largeTitleScreen';

export default function HomeLayout() {
    const indexTitle = RouteDetails[HomeRoutes.Home].title;

  return (
    <Stack>
      <Stack.Screen name="index" options={createNativeHeaderOptions(indexTitle)} />
    </Stack>
  )
}