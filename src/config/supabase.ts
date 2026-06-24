import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {
  AppState,
  Platform,
} from 'react-native';
import {
  createClient,
  processLock,
} from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

const isWeb = Platform.OS === 'web';

const storage = isWeb
  ? {
      getItem: (key: string) =>
        AsyncStorage.getItem(key),
      setItem: (
        key: string,
        value: string
      ) => AsyncStorage.setItem(key, value),
      removeItem: (key: string) =>
        AsyncStorage.removeItem(key),
    }
  : {
      getItem: (key: string) =>
        SecureStore.getItemAsync(key),
      setItem: (
        key: string,
        value: string
      ) =>
        SecureStore.setItemAsync(key, value),
      removeItem: (key: string) =>
        SecureStore.deleteItemAsync(key),
    };

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  }
);

if (!isWeb) {
  AppState.addEventListener(
    'change',
    (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    }
  );
}
