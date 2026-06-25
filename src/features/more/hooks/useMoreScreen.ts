import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';

export const useMoreScreen = () => {
  const router = useRouter();
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );
  const resetPetGate =
    usePetOnboardingGateStore(
      (state) => state.reset
    );
  const resetPets = usePetStore(
    (state) => state.reset
  );
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
      resetPets();
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
    isLoggingOut,
    logoutError,
    handleLogout,
    items: [
      {
        id: 'profile',
        label: 'Perfil de usuario',
        onPress: () => router.push('/pets'),
      },
      {
        id: 'settings',
        label: 'Configuración',
        onPress: () => undefined,
      },
      {
        id: 'notifications',
        label: 'Notificaciones',
        onPress: () => undefined,
      },
      {
        id: 'premium',
        label: 'Suscripción / Premium',
        onPress: () => undefined,
      },
      {
        id: 'saved-vets',
        label: 'Veterinarias guardadas',
        onPress: () => router.push('/veterinaries'),
      },
      {
        id: 'help',
        label: 'Ayuda',
        onPress: () => undefined,
      },
      {
        id: 'legal',
        label: 'Términos y privacidad',
        onPress: () => undefined,
      },
    ],
  };
};
