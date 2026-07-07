import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import {
  getVeterinaryRichProfile,
} from '../services/veterinary-rich-profile.service';
import {
  listSavedVeterinaryIds,
  removeSavedVeterinary,
  saveVeterinary,
} from '../services/veterinary.service';
import type { VeterinaryRichProfile } from '../types/veterinary.types';
import { useVeterinariesStore } from '../store/veterinaries.store';

const buildSocialLinks = (
  profile: VeterinaryRichProfile | null
) => {
  const veterinary = profile?.veterinary;

  if (!veterinary) {
    return [];
  }

  return [
    {
      id: 'website',
      label: 'Sitio web',
      url: veterinary.website_url,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      url: veterinary.instagram_url,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      url: veterinary.facebook_url,
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      url: veterinary.tiktok_url,
    },
  ].filter((item) => Boolean(item.url));
};

export const useVeterinaryProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
  }>();
  const user = useAuthStore((state) => state.user);
  const activePetId = usePetStore(
    (state) => state.activePetId
  );
  const [profile, setProfile] =
    useState<VeterinaryRichProfile | null>(null);
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
        getVeterinaryRichProfile(params.id),
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

      setProfile(data);
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
    void hydrate();
  }, [params.id, user?.id]);

  const veterinary = profile?.veterinary ?? null;
  const isSaved = veterinary
    ? savedVeterinaryIds.includes(veterinary.id)
    : false;

  const servicesByCategory = useMemo(() => {
    if (!profile) {
      return [];
    }

    return profile.serviceCategories
      .map((category) => ({
        category,
        services: profile.services.filter(
          (service) =>
            service.category_code ===
            category.code
        ),
      }))
      .filter((item) => item.services.length > 0);
  }, [profile]);

  const socialLinks = useMemo(
    () => buildSocialLinks(profile),
    [profile]
  );

  const toggleSaved = async () => {
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
  };

  const openMaps = () =>
    veterinary
      ? Linking.openURL(
          `https://maps.apple.com/?ll=${veterinary.latitude},${veterinary.longitude}&q=${encodeURIComponent(
            veterinary.name
          )}`
        )
      : undefined;

  const callVeterinary = async () => {
    if (!veterinary?.phone) {
      return;
    }

    const url = `tel:${veterinary.phone}`;
    const supported =
      await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        'Error',
        'La función de llamada no está soportada en este dispositivo'
      );
      return;
    }

    await Linking.openURL(url);
  };

  const openWhatsApp = async () => {
    if (!veterinary?.whatsapp_phone) {
      return;
    }

    const normalizedPhone =
      veterinary.whatsapp_phone.replace(
        /[^+\d]/g,
        ''
      );
    const url = `https://wa.me/${normalizedPhone.replace(
      '+',
      ''
    )}`;
    await Linking.openURL(url);
  };

  const sendEmail = async () => {
    if (!veterinary?.email) {
      return;
    }

    await Linking.openURL(
      `mailto:${veterinary.email}`
    );
  };

  const openExternalLink = async (
    url: string
  ) => {
    await Linking.openURL(url);
  };

  return {
    profile,
    veterinary,
    isHydrating,
    generalError,
    saveError,
    isSaving,
    isSaved,
    servicesByCategory,
    socialLinks,
    goBack: () => router.back(),
    retry: hydrate,
    toggleSaved,
    openMaps,
    callVeterinary,
    openWhatsApp,
    sendEmail,
    openExternalLink,
  };
};
