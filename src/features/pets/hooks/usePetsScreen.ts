import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '../store/pet.store';

export const usePetsScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const {
    pets,
    activePetId,
    isHydrating,
    generalError,
    hydratePets,
    selectPet,
  } = usePetStore();

  useEffect(() => {
    if (userId) {
      hydratePets(userId);
    }
  }, [hydratePets, userId]);

  const activePet =
    pets.find((pet) => pet.id === activePetId) ?? null;

  return {
    pets,
    activePet,
    activePetId,
    isHydrating,
    generalError,
    retry: () =>
      userId ? hydratePets(userId) : Promise.resolve(),
    selectPet,
    goToCreatePet: () =>
      router.push('/pet-detail?mode=create'),
    goToPetDetail: (petId: string) =>
      router.push(`/pet-detail?petId=${petId}`),
  };
};
