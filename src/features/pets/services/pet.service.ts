import { supabase } from '@/config/supabase';
import type {
  CreatePetInput,
  CreatePetResult,
  Pet,
  PetServiceError,
  UpdatePetInput,
} from '../types/pet.types';

interface CreatePetOptions {
  localPhotoUri?: string;
  localPhotoBase64?: string;
  localPhotoMimeType?: string;
}

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

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = Uint8Array.from(
    binaryString,
    (char) => char.charCodeAt(0)
  );

  return bytes.buffer;
};

const mapPetError = (
  error: unknown
): PetServiceError => {
  const message =
    getErrorMessage(error).toLowerCase();
  
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return {
      code: 'NETWORK_ERROR',
      message:
        'No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.',
    };
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message: `Ocurrió un error inesperado al procesar la mascota. ${getErrorMessage(
      error
    )}`,
  };
};

export const hasRegisteredPets = async (
  ownerId: string
) => {
  const { data, error } = await supabase
    .from('pets')
    .select('id')
    .eq('owner_id', ownerId)
    .limit(1);

  if (error) {
    throw mapPetError(error);
  }

  return (data?.length ?? 0) > 0;
};

export const getUserPets = async (
  ownerId: string
) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw mapPetError(error);
  }

  return (data ?? []) as Pet[];
};

export const createPet = async (
  input: CreatePetInput,
  options?: CreatePetOptions
): Promise<CreatePetResult> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .insert(input)
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        error: mapPetError(error),
      };
    }

    if (!options?.localPhotoUri) {
      return {
        success: true,
        data: data as Pet,
      };
    }

    try {
      const filePath = `${input.owner_id}/${data.id}/photo.jpg`;
      let fileBody: ArrayBuffer;

      if (options.localPhotoBase64) {
        fileBody = base64ToArrayBuffer(
          options.localPhotoBase64
        );
      } else if (options.localPhotoUri) {
        const fileResponse = await fetch(
          options.localPhotoUri
        );
        fileBody =
          await fileResponse.arrayBuffer();
      } else {
        throw new Error(
          'No encontramos la imagen local para subir.'
        );
      }

      const { error: uploadError } =
        await supabase.storage
          .from('pet-photos')
          .upload(filePath, fileBody, {
            contentType:
              options.localPhotoMimeType ||
              'image/jpeg',
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from('pet-photos')
          .getPublicUrl(filePath);

      const photoUrl =
        publicUrlData.publicUrl;

      const {
        data: updatedPet,
        error: updateError,
      } = await supabase
        .from('pets')
        .update({
          photo_url: photoUrl,
        })
        .eq('id', data.id)
        .select('*')
        .single();

      if (updateError || !updatedPet) {
        throw updateError;
      }

      return {
        success: true,
        data: updatedPet as Pet,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNEXPECTED_ERROR',
          message: `La mascota fue creada, pero no pudimos guardar su foto. ${getErrorMessage(
            error
          )}`,
        },
        partialData: data as Pet,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: mapPetError(error),
    };
  }
};

export const updatePet = async (
  petId: string,
  input: UpdatePetInput
) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update(input)
      .eq('id', petId)
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false as const,
        error: mapPetError(error),
      };
    }

    return {
      success: true as const,
      data: data as Pet,
    };
  } catch (error) {
    return {
      success: false as const,
      error: mapPetError(error),
    };
  }
};

export const deletePet = async (petId: string) => {
  try {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId);

    if (error) {
      return {
        success: false as const,
        error: mapPetError(error),
      };
    }

    return {
      success: true as const,
    };
  } catch (error) {
    return {
      success: false as const,
      error: mapPetError(error),
    };
  }
};
