import { Alert, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { usePetStore } from '@/features/pets/store/pet.store';
import {
  getSettings,
  type AppLanguagePreference,
  updateSetting,
} from '../services/settings.service';

const languageLabels: Record<
  AppLanguagePreference,
  string
> = {
  es: 'Español',
  en: 'English',
};

export const useSettingsScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const pets = usePetStore((state) => state.pets);
  const activePetId = usePetStore(
    (state) => state.activePetId
  );
  const [language, setLanguage] =
    useState<AppLanguagePreference>('es');
  const [isHydrating, setIsHydrating] =
    useState(true);
  const [hasLoadError, setHasLoadError] =
    useState(false);
  const [isUpdating, setIsUpdating] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  const activePet =
    pets.find((pet) => pet.id === activePetId) ?? null;
  const activePetSummary = activePet
    ? `${activePet.name} · ${activePet.breed ?? 'Sin raza registrada'}`
    : 'No encontramos una mascota activa. Puedes administrarla desde Mascotas.';
  const themeSummary =
    colorScheme === 'dark'
      ? 'Oscuro'
      : colorScheme === 'light'
      ? 'Claro'
      : 'Sistema';

  const hydrate = async () => {
    setIsHydrating(true);
    setHasLoadError(false);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const settings = await getSettings();
      setLanguage(settings.language);
    } catch (error) {
      setHasLoadError(true);
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar tu configuración.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const handleLanguageChange = async (
    nextLanguage: AppLanguagePreference
  ) => {
    if (
      nextLanguage === language ||
      isUpdating
    ) {
      return;
    }

    setIsUpdating(true);
    setHasLoadError(false);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const settings = await updateSetting(
        'language',
        nextLanguage
      );

      setLanguage(settings.language);
      setSuccessMessage(
        `Idioma preferido actualizado a ${languageLabels[settings.language]}.`
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar tu configuración.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const showThemeInfo = () => {
    Alert.alert(
      'Tema del dispositivo',
      'Por ahora la app sigue el tema del sistema. Más adelante podrás personalizarlo desde aquí.'
    );
  };

  return {
    language,
    languageLabels,
    themeSummary,
    activePetName:
      activePet?.name ?? 'Sin mascota activa',
    activePetSummary,
    isHydrating,
    hasLoadError,
    isUpdating,
    generalError,
    successMessage,
    retry: hydrate,
    goBack: () => router.back(),
    openProfile: () =>
      router.push('/user-profile' as never),
    openPets: () =>
      router.push('/(app)/(tabs)/pets' as never),
    handleLanguageChange,
    showThemeInfo,
  };
};
