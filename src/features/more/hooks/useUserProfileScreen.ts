import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  getProfileById,
  updateProfile,
} from '../services/profile.service';

const normalizeOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const useUserProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('es');
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [isSaving, setIsSaving] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');
  const [successMessage, setSuccessMessage] =
    useState('');
  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);

  const hydrate = async () => {
    if (!user?.id) {
      setGeneralError(
        'No encontramos una sesión activa para cargar tu perfil.'
      );
      return;
    }

    setIsHydrating(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const profile = await getProfileById(user.id);

      if (!profile) {
        setGeneralError(
          'No encontramos tu perfil de usuario.'
        );
        return;
      }

      setFullName(profile.full_name ?? '');
      setCountry(profile.country ?? '');
      setLanguage(profile.language ?? 'es');
      setOnboardingCompleted(
        Boolean(profile.onboarding_completed)
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar tu perfil.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id || isSaving) {
      return;
    }

    setIsSaving(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const profile = await updateProfile(user.id, {
        full_name: normalizeOptionalValue(fullName),
        country: normalizeOptionalValue(country),
        language:
          normalizeOptionalValue(language) ?? 'es',
      });

      setFullName(profile.full_name ?? '');
      setCountry(profile.country ?? '');
      setLanguage(profile.language ?? 'es');
      setSuccessMessage(
        'Tu perfil fue actualizado correctamente.'
      );
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar tu perfil.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    email: user?.email ?? 'Correo no disponible',
    fullName,
    country,
    language,
    onboardingCompleted,
    isHydrating,
    isSaving,
    generalError,
    successMessage,
    setFullName,
    setCountry,
    setLanguage,
    retry: hydrate,
    goBack: () => router.back(),
    handleSave,
  };
};
