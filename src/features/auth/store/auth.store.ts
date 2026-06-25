import { supabase } from '@/config/supabase';
import type {
  Session,
  User,
} from '@supabase/supabase-js';
import { create } from 'zustand';
import { logger } from '@/core/utils/debug';

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
    setSession: (session) => {
      logger.debug('AuthStore setSession called', {
        hasSession: Boolean(session),
        userId: session?.user?.id,
      });
      set({
        session,
        user: getSessionUser(session),
        isAuthenticated: Boolean(session),
        isHydrating: false,
      });
    },
    hydrateSession: async () => {
      logger.debug('AuthStore hydrateSession started');
      const { data } =
        await supabase.auth.getSession();

      logger.debug('AuthStore hydrateSession result', {
        hasSession: Boolean(data.session),
        userId: data.session?.user?.id,
      });

      set({
        session: data.session,
        user: getSessionUser(data.session),
        isAuthenticated: Boolean(data.session),
        isHydrating: false,
      });
    },
    clearSession: async () => {
      logger.debug('AuthStore clearSession called');
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
