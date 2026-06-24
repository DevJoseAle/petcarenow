import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signUpWithEmail } from '../services/auth.service';
import type {
  SignUpCredentials,
  SignUpValidationErrors,
} from '../types/auth.types';
import {
  normalizeEmail,
  validateSignUpCredentials,
} from '../utils/auth.validators';

const initialCredentials: SignUpCredentials = {
  email: '',
  password: '',
};

export const useSignUpScreen = () => {
  const router = useRouter();
  const [credentials, setCredentials] =
    useState<SignUpCredentials>(
      initialCredentials
    );
  const [errors, setErrors] =
    useState<SignUpValidationErrors>({});
  const [generalError, setGeneralError] =
    useState('');
  const [successMessage, setSuccessMessage] =
    useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const setFieldValue = (
    field: keyof SignUpCredentials,
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
    setSuccessMessage('');
  };

  const validateForm = () => {
    const nextErrors =
      validateSignUpCredentials(credentials);
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
    setSuccessMessage('');

    const result = await signUpWithEmail(
      credentials
    );

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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((current) => !current);
  };

  return {
    email: credentials.email,
    password: credentials.password,
    emailError: errors.email,
    passwordError: errors.password,
    generalError,
    successMessage,
    isSubmitting,
    isPasswordVisible,
    setEmail: (value: string) =>
      setFieldValue('email', value),
    setPassword: (value: string) =>
      setFieldValue('password', value),
    handleEmailBlur,
    handlePasswordBlur,
    handleSubmit,
    goToLogin,
    togglePasswordVisibility,
  };
};
