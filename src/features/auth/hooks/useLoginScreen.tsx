import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginWithEmail } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { hasRegisteredPets } from '@/features/pets/services/pet.service';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import type {
  LoginCredentials,
  LoginValidationErrors,
} from '../types/auth.types';
import {
  normalizeEmail,
  validateLoginCredentials,
} from '../utils/auth.validators';

const initialCredentials: LoginCredentials = {
  email: '',
  password: '',
};

export const useLoginScreen = () => {
  const router = useRouter();
  const setSession = useAuthStore(
    (state) => state.setSession
  );
  const markHasPets =
    usePetOnboardingGateStore(
      (state) => state.markHasPets
    );
  const resetPetGate =
    usePetOnboardingGateStore(
      (state) => state.reset
    );
  const [credentials, setCredentials] =
    useState<LoginCredentials>(
      initialCredentials
    );
  const [errors, setErrors] =
    useState<LoginValidationErrors>({});
  const [generalError, setGeneralError] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const setFieldValue = (
    field: keyof LoginCredentials,
    value: string
  ) => {
    setCredentials((current) => ({
      ...current,
      [field]:
        field === 'email'
          ? normalizeEmail(value)
          : value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setGeneralError('');
  };

  const validateForm = () => {
    const nextErrors =
      validateLoginCredentials(credentials);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEmailBlur = () => {
    setCredentials((current) => ({
      ...current,
      email: normalizeEmail(current.email),
    }));
    validateForm();
  };

  const handlePasswordBlur = () => {
    validateForm();
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    const result = await loginWithEmail(
      credentials
    );

    setIsSubmitting(false);

    if (!result.success) {
      setGeneralError(result.error.message);
      return;
    }

    setSession(result.data.session);
    try {
      const hasPets = await hasRegisteredPets(
        result.data.user.id
      );

      if (hasPets) {
        markHasPets();
        router.replace('/(app)');
        return;
      }

      resetPetGate();
      router.replace('/pet-onboarding');
    } catch {
      resetPetGate();
      router.replace('/pet-onboarding');
    }
  };

  const goToRegister = () => {
    router.push('/(auth)/register');
  };

  const goToForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((current) => !current);
  };

  return {
    email: credentials.email,
    password: credentials.password,
    emailError: errors.email,
    passwordError: errors.password,
    generalError,
    isSubmitting,
    isPasswordVisible,
    setEmail: (value: string) =>
      setFieldValue('email', value),
    setPassword: (value: string) =>
      setFieldValue('password', value),
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
    goToRegister,
    goToForgotPassword,
    togglePasswordVisibility,
  };
};
