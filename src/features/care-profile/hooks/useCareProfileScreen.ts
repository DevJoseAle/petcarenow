import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { buildCareProfile } from '../services/care-profile.service';
import { shareCareProfile } from '../services/care-profile-share.service';
import type { CareProfileData } from '../types/care-profile.types';

export const useCareProfileScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const { pets, activePetId, isHydrating } =
    usePetStore();
  const activePet = useMemo(
    () =>
      pets.find((pet) => pet.id === activePetId) ??
      pets[0] ??
      null,
    [activePetId, pets]
  );
  const [profile, setProfile] =
    useState<CareProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateProfile = useCallback(async () => {
    if (!userId || !activePet) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      const nextProfile = await buildCareProfile({
        ownerId: userId,
        pet: activePet,
      });
      setProfile(nextProfile);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar el perfil de cuidado.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [activePet, userId]);

  useEffect(() => {
    void hydrateProfile();
  }, [hydrateProfile]);

  const goToEditPet = () => {
    if (!activePet) {
      return;
    }

    router.push(`/pet-detail?petId=${activePet.id}`);
  };

  const handleShare = async () => {
    if (!profile) {
      setGeneralError(
        'No encontramos información suficiente para compartir.'
      );
      return;
    }

    setIsSharing(true);
    setGeneralError('');

    try {
      await shareCareProfile(profile);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos compartir el perfil.'
      );
    } finally {
      setIsSharing(false);
    }
  };

  return {
    activePet,
    profile,
    isLoading:
      isHydrating || (Boolean(activePet) && isLoading),
    isSharing,
    generalError,
    retry: hydrateProfile,
    goToEditPet,
    goToPets: () => router.push('/pets'),
    goToCalendar: () => router.push('/calendar'),
    handleShare,
  };
};
