import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import {
  getProfileById,
  updateProfile,
} from '../services/profile.service';
import { deleteCurrentUserAccount } from '../services/account-deletion.service';

const normalizeOptionalValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const useUserProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );
  const setSession = useAuthStore(
    (state) => state.setSession
  );
  const resetPetGate =
    usePetOnboardingGateStore(
      (state) => state.reset
    );
  const resetPets = usePetStore(
    (state) => state.reset
  );
  const resetSubscription =
    useSubscriptionStore(
      (state) => state.reset
    );
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
  const [
    isDeleteConfirmationVisible,
    setIsDeleteConfirmationVisible,
  ] = useState(false);
  const [
    isDeletingAccount,
    setIsDeletingAccount,
  ] = useState(false);
  const [
    deleteAccountError,
    setDeleteAccountError,
  ] = useState('');

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

  const cleanupDeletedAccountSession =
    async () => {
      try {
        await clearSession();
      } catch {
        // If remote sign-out fails after deletion,
        // force local auth state cleanup so the user
        // can leave the authenticated flow safely.
        setSession(null);
      } finally {
        resetPetGate();
        resetPets();
        resetSubscription();
      }
    };

  const openDeleteAccountConfirmation =
    () => {
      if (isDeletingAccount) {
        return;
      }

      setDeleteAccountError('');
      setIsDeleteConfirmationVisible(true);
    };

  const closeDeleteAccountConfirmation =
    () => {
      if (isDeletingAccount) {
        return;
      }

      setDeleteAccountError('');
      setIsDeleteConfirmationVisible(false);
    };

  const handleDeleteAccount = async () => {
    if (!user?.id || isDeletingAccount) {
      return;
    }

    setIsDeletingAccount(true);
    setDeleteAccountError('');
    setSuccessMessage('');
    setGeneralError('');

    try {
      await deleteCurrentUserAccount();
      await cleanupDeletedAccountSession();
      router.replace('/(auth)/login');
    } catch (error) {
      setDeleteAccountError(
        error instanceof Error
          ? error.message
          : 'No pudimos eliminar tu cuenta.'
      );
    } finally {
      setIsDeletingAccount(false);
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
    isDeleteConfirmationVisible,
    isDeletingAccount,
    generalError,
    successMessage,
    deleteAccountError,
    setFullName,
    setCountry,
    setLanguage,
    retry: hydrate,
    goBack: () => router.back(),
    handleSave,
    openDeleteAccountConfirmation,
    closeDeleteAccountConfirmation,
    handleDeleteAccount,
  };
};
