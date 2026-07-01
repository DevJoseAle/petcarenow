import {
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  listSavedVeterinaries,
} from '../services/veterinary.service';
import type { Veterinary } from '../types/veterinary.types';

export const useSavedVeterinariesScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [veterinaries, setVeterinaries] =
    useState<Veterinary[]>([]);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrate = async () => {
    if (!userId) {
      setVeterinaries([]);
      return;
    }

    setIsHydrating(true);
    setGeneralError('');

    try {
      const data =
        await listSavedVeterinaries(userId);
      setVeterinaries(data);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar las veterinarias guardadas.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, [userId]);

  return {
    veterinaries,
    isHydrating,
    generalError,
    retry: hydrate,
    goBack: () => router.back(),
    goToProfile: (id: string) =>
      router.push(`/veterinary-profile?id=${id}`),
  };
};
