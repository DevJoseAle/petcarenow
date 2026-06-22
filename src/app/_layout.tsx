import { Stack } from 'expo-router';

export default function RootLayout() {
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