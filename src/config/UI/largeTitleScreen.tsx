
import { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

export function createNativeHeaderOptions(
  title: string
): NativeStackNavigationOptions {
  return {
    title,
    headerLargeTitleEnabled: Platform.OS === 'ios',
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
  };
}