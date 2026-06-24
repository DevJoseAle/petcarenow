import { useState } from 'react';
import { useRouter } from 'expo-router';
import { requestPasswordReset } from '../services/auth.service';
import type {
  ResetPasswordInput,
  ResetPasswordValidationErrors,
} from '../types/auth.types';
import {
  normalizeEmail,
  validateResetPasswordInput,
} from '../utils/auth.validators';

const initialInput: ResetPasswordInput = {
  email: '',
};

export const useForgotPasswordScreen = () => {
  const router = useRouter();
  const [input, setInput] =
    useState<ResetPasswordInput>(
      initialInput
    );
  const [errors, setErrors] =
    useState<ResetPasswordValidationErrors>({});
  const [generalError, setGeneralError] =
    useState('');
  const [successMessage, setSuccessMessage] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const setEmail = (value: string) => {
    setInput({
      email: normalizeEmail(value),
    });
    setErrors({});
    setGeneralError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    const nextErrors =
      validateResetPasswordInput(input);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEmailBlur = () => {
    setInput((current) => ({
      email: normalizeEmail(current.email),
    }));
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
    setSuccessMessage('');

    const result =
      await requestPasswordReset(input);

    setIsSubmitting(false);

    if (!result.success) {
      setGeneralError(result.error.message);
      return;
    }

    setSuccessMessage(result.message);
  };

  const goToLogin = () => {
    router.replace('/(auth)/login');
  };

  return {
    email: input.email,
    emailError: errors.email,
    generalError,
    successMessage,
    isSubmitting,
    setEmail,
    handleEmailBlur,
    handleSubmit,
    goToLogin,
  };
};
