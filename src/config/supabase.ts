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
const isServerSide =
  typeof window === 'undefined';

const createMemoryStorage = () => {
  const store = new Map<string, string>();

  return {
    getItem: async (key: string) =>
      store.get(key) ?? null,
    setItem: async (
      key: string,
      value: string
    ) => {
      store.set(key, value);
    },
    removeItem: async (key: string) => {
      store.delete(key);
    },
  };
};

class NoopWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  readonly readyState = 3;
  readonly url: string;
  readonly protocol = '';

  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;

  constructor(address: string | URL) {
    this.url = String(address);
  }

  close() {}

  send() {}

  addEventListener() {}

  removeEventListener() {}
}

const storage = isServerSide
  ? createMemoryStorage()
  : isWeb
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
      autoRefreshToken: !isServerSide,
      persistSession: !isServerSide,
      detectSessionInUrl: false,
      lock: processLock,
      skipAutoInitialize: isServerSide,
    },
    realtime: isServerSide
      ? {
          transport: NoopWebSocket,
        }
      : undefined,
  }
);

if (!isWeb && !isServerSide) {
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
