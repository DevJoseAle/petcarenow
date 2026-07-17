import { supabase } from '@/config/supabase';

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

const mapDeleteAccountError = (
  error: unknown
) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('session') ||
    message.includes('not authenticated') ||
    message.includes('jwt')
  ) {
    return new Error(
      'Tu sesión ya no es válida. Inicia sesión nuevamente para eliminar tu cuenta.'
    );
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para eliminar tu cuenta. Revisa tu conexión e inténtalo nuevamente.'
    );
  }

  if (
    message.includes('function') ||
    message.includes('404') ||
    message.includes('not found')
  ) {
    return new Error(
      'La eliminación de cuenta no está disponible en este ambiente todavía.'
    );
  }

  return new Error(
    `No pudimos eliminar tu cuenta. ${getErrorMessage(
      error
    )}`
  );
};

export const deleteCurrentUserAccount =
  async () => {
    const { data, error: sessionError } =
      await supabase.auth.getSession();

    const accessToken =
      data.session?.access_token;

    if (sessionError || !accessToken) {
      throw new Error(
        'No encontramos una sesión activa para eliminar tu cuenta.'
      );
    }

    const { error } =
      await supabase.functions.invoke(
        'delete-account',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {},
        }
      );

    if (error) {
      throw mapDeleteAccountError(error);
    }
  };
