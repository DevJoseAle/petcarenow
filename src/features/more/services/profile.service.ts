import { supabase } from '@/config/supabase';
import type {
  UpdateUserProfileInput,
  UserProfile,
} from '../types/profile.types';

const hasMessage = (
  value: unknown
): value is { message: string } =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof value.message === 'string';

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : hasMessage(error)
    ? error.message
    : 'Error desconocido';

const mapProfileError = (error: unknown) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para cargar tu perfil.'
    );
  }

  return new Error(
    `No pudimos procesar tu perfil. ${getErrorMessage(
      error
    )}`
  );
};

export const getProfileById = async (
  ownerId: string
) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ownerId)
    .maybeSingle();

  if (error) {
    throw mapProfileError(error);
  }

  return (data as UserProfile | null) ?? null;
};

export const updateProfile = async (
  ownerId: string,
  input: UpdateUserProfileInput
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', ownerId)
    .select('*')
    .single();

  if (error || !data) {
    throw mapProfileError(error);
  }

  return data as UserProfile;
};
