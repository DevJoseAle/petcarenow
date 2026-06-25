import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';

export const useHomeScreen = () => {
  const router = useRouter();
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );
  const resetPetGate =
    usePetOnboardingGateStore(
      (state) => state.reset
    );
  const user = useAuthStore((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const [logoutError, setLogoutError] =
    useState('');

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError('');

    try {
      await clearSession();
      resetPetGate();
      router.replace('/(auth)/login');
    } catch {
      setLogoutError(
        'No pudimos cerrar tu sesión. Inténtalo nuevamente.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    userEmail: user?.email ?? '',
    isLoggingOut,
    logoutError,
    handleLogout,
  };
};
