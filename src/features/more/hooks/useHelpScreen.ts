import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  getHelpContactOptions,
  getHelpFaqItems,
  getHelpLegalLinks,
  openHelpContactOption,
  openHelpLegalLink,
} from '../services/help.service';
import type {
  HelpContactOption,
  HelpLegalLink,
} from '../types/help.types';

export const useHelpScreen = () => {
  const router = useRouter();
  const [isOpeningId, setIsOpeningId] =
    useState<string | null>(null);
  const [generalError, setGeneralError] =
    useState('');

  const faqItems = useMemo(
    () => getHelpFaqItems(),
    []
  );
  const contactOptions = useMemo(
    () => getHelpContactOptions(),
    []
  );
  const legalLinks = useMemo(
    () => getHelpLegalLinks(),
    []
  );

  const handleOpenContactOption = async (
    option: HelpContactOption
  ) => {
    setIsOpeningId(option.id);
    setGeneralError('');

    try {
      await openHelpContactOption(option);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos abrir el canal de ayuda.'
      );
    } finally {
      setIsOpeningId(null);
    }
  };

  const handleOpenLegalLink = async (
    link: HelpLegalLink
  ) => {
    setIsOpeningId(link.id);
    setGeneralError('');

    try {
      await openHelpLegalLink(link.type);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos abrir el recurso legal.'
      );
    } finally {
      setIsOpeningId(null);
    }
  };

  return {
    faqItems,
    contactOptions,
    legalLinks,
    isOpeningId,
    generalError,
    goBack: () => router.back(),
    handleOpenContactOption,
    handleOpenLegalLink,
  };
};
