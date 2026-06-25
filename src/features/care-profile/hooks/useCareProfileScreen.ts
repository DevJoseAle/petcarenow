import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { usePetStore } from '@/features/pets/store/pet.store';

export const useCareProfileScreen = () => {
  const router = useRouter();
  const { pets, activePetId } = usePetStore();
  const activePet = useMemo(
    () =>
      pets.find((pet) => pet.id === activePetId) ??
      null,
    [activePetId, pets]
  );

  return {
    activePet,
    goToEditPet: () =>
      activePet
        ? router.push(`/pet-detail?petId=${activePet.id}`)
        : undefined,
    goToCalendar: () => router.push('/calendar'),
  };
};
