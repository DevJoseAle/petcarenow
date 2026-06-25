import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { listVeterinaries } from '../services/veterinary.service';
import type { Veterinary } from '../types/veterinary.types';

export const useVeterinariesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
  }>();
  const [veterinaries, setVeterinaries] =
    useState<Veterinary[]>([]);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrate = async () => {
    setIsHydrating(true);
    setGeneralError('');

    try {
      const data = await listVeterinaries();
      setVeterinaries(data);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar las veterinarias.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  return {
    mode: params.mode ?? 'list',
    veterinaries,
    isHydrating,
    generalError,
    retry: hydrate,
    goToProfile: (id: string) =>
      router.push(`/veterinary-profile?id=${id}`),
  };
};
