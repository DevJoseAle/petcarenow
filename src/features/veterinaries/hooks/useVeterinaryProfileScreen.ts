import {
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getVeterinaryById } from '../services/veterinary.service';
import { useEffect, useState } from 'react';
import type { Veterinary } from '../types/veterinary.types';
import { useVeterinariesStore } from '../store/veterinaries.store';

export const useVeterinaryProfileScreen = () => {
  const params = useLocalSearchParams<{
    id?: string;
  }>();
  const [veterinary, setVeterinary] =
    useState<Veterinary | null>(null);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const savedVeterinaryIds = useVeterinariesStore(
    (state) => state.savedVeterinaryIds
  );
  const toggleSavedVeterinary =
    useVeterinariesStore(
      (state) => state.toggleSavedVeterinary
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

    const data = await getVeterinaryById(params.id);

    if (!data) {
      setGeneralError(
        'No encontramos la veterinaria solicitada.'
      );
      setIsHydrating(false);
      return;
    }

    setVeterinary(data);
    setIsHydrating(false);
  };

  useEffect(() => {
    hydrate();
  }, [params.id]);

  return {
    veterinary,
    isHydrating,
    generalError,
    retry: hydrate,
    isSaved: veterinary
      ? savedVeterinaryIds.includes(veterinary.id)
      : false,
    toggleSaved: () =>
      veterinary
        ? toggleSavedVeterinary(veterinary.id)
        : undefined,
    openMaps: () =>
      veterinary
        ? Linking.openURL(
            `https://maps.apple.com/?ll=${veterinary.latitude},${veterinary.longitude}`
          )
        : undefined,
    callVeterinary: () =>
      veterinary?.phone
        ? Linking.openURL(`tel:${veterinary.phone}`)
        : undefined,
  };
};
