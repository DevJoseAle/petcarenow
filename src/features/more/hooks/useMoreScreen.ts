import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';

type MoreItemStatus = 'active' | 'coming-soon';

interface MoreItem {
  id: string;
  label: string;
  status: MoreItemStatus;
  onPress: () => void;
}

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
  const showComingSoon = (label: string) => {
    Alert.alert(
      'Próximamente',
      `${label} estará disponible en una próxima iteración.`
    );
  };

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

  let items: MoreItem[] = [
      {
        id: 'profile',
        label: 'Perfil de usuario',
        status: 'active',
        onPress: () =>
          router.push('/user-profile' as never),
      },
      {
        id: 'saved-vets',
        label: 'Veterinarias guardadas',
        status: 'active',
        onPress: () =>
          router.push(
            '/saved-veterinaries' as never
          ),
      },
      {
        id: 'settings',
        label: 'Configuración',
        status: 'active',
        onPress: () =>
          router.push('/settings' as never),
      },
      {
        id: 'notifications',
        label: 'Notificaciones',
        status: 'active',
        onPress: () =>
          router.push('/notifications' as never),
      },
      {
        id: 'premium',
        label: 'Suscripción / Premium',
        status: 'coming-soon',
        onPress: () =>
          showComingSoon('Suscripción / Premium'),
      },
      {
        id: 'help',
        label: 'Ayuda',
        status: 'coming-soon',
        onPress: () => showComingSoon('Ayuda'),
      },
      {
        id: 'legal',
        label: 'Términos y privacidad',
        status: 'coming-soon',
        onPress: () =>
          showComingSoon('Términos y privacidad'),
      },
    ]
  return {
    isLoggingOut,
    logoutError,
    handleLogout,
    items
    
  };
};
