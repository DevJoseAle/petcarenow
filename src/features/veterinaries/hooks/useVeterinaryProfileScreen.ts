import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import {
  getVeterinaryById,
  listSavedVeterinaryIds,
  removeSavedVeterinary,
  saveVeterinary,
} from '../services/veterinary.service';
import type { Veterinary } from '../types/veterinary.types';
import { useVeterinariesStore } from '../store/veterinaries.store';

export const useVeterinaryProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
  }>();
  const user = useAuthStore((state) => state.user);
  const activePetId = usePetStore(
    (state) => state.activePetId
  );
  const [veterinary, setVeterinary] =
    useState<Veterinary | null>(null);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [saveError, setSaveError] =
    useState('');
  const [isSaving, setIsSaving] =
    useState(false);
  const savedVeterinaryIds = useVeterinariesStore(
    (state) => state.savedVeterinaryIds
  );
  const setSavedVeterinaryIds =
    useVeterinariesStore(
      (state) => state.setSavedVeterinaryIds
    );
  const markSavedVeterinary =
    useVeterinariesStore(
      (state) => state.markSavedVeterinary
    );
  const unmarkSavedVeterinary =
    useVeterinariesStore(
      (state) => state.unmarkSavedVeterinary
    );

  const hydrate = async () => {
    if (!params.id) {
      setGeneralError(
        'No encontramos la veterinaria solicitada.'
      );
      return;
    }

    setIsHydrating(true);
    setGeneralError('');

    try {
      const [data, savedIds] = await Promise.all([
        getVeterinaryById(params.id),
        user?.id
          ? listSavedVeterinaryIds(user.id)
          : Promise.resolve([]),
      ]);

      if (!data) {
        setGeneralError(
          'No encontramos la veterinaria solicitada.'
        );
        return;
      }

      setVeterinary(data);
      setSavedVeterinaryIds(savedIds);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar la veterinaria.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, [params.id, user?.id]);

  const isSaved = veterinary
    ? savedVeterinaryIds.includes(veterinary.id)
    : false;

  return {
    veterinary,
    isHydrating,
    generalError,
    saveError,
    isSaving,
    isSaved,
    goBack: () => router.back(),
    retry: hydrate,
    toggleSaved: async () => {
      if (!user?.id || !veterinary || isSaving) {
        return;
      }

      setIsSaving(true);
      setSaveError('');

      try {
        if (isSaved) {
          await removeSavedVeterinary({
            ownerId: user.id,
            veterinaryId: veterinary.id,
          });
          unmarkSavedVeterinary(veterinary.id);
        } else {
          await saveVeterinary({
            ownerId: user.id,
            veterinaryId: veterinary.id,
            petId: activePetId,
          });
          markSavedVeterinary(veterinary.id);
        }
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'No pudimos actualizar la veterinaria guardada.'
        );
      } finally {
        setIsSaving(false);
      }
    },
    openMaps: () =>
      veterinary
        ? Linking.openURL(
            `https://maps.apple.com/?ll=${veterinary.latitude},${veterinary.longitude}&q=${encodeURIComponent(
              veterinary.name
            )}`
          )
        : undefined,
    callVeterinary: () =>
      veterinary?.phone
        ? Linking.openURL(`tel:${veterinary.phone}`)
        : undefined,
  };
};
