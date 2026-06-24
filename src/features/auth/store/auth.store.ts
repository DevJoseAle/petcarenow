import { create } from 'zustand';
import type {
  Session,
  User,
} from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setSession: (session: Session | null) => void;
  hydrateSession: () => Promise<void>;
  clearSession: () => Promise<void>;
}

const getSessionUser = (
  session: Session | null
) => session?.user ?? null;

export const useAuthStore = create<AuthState>(
  (set) => ({
    session: null,
    user: null,
    isAuthenticated: false,
    isHydrating: true,
    setSession: (session) =>
      set({
        session,
        user: getSessionUser(session),
        isAuthenticated: Boolean(session),
        isHydrating: false,
      }),
    hydrateSession: async () => {
      const { data } =
        await supabase.auth.getSession();

      set({
        session: data.session,
        user: getSessionUser(data.session),
        isAuthenticated: Boolean(data.session),
        isHydrating: false,
      });
    },
    clearSession: async () => {
      await supabase.auth.signOut();
      set({
        session: null,
        user: null,
        isAuthenticated: false,
        isHydrating: false,
      });
    },
  })
);
