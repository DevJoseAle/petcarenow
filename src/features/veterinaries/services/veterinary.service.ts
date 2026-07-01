import { supabase } from '@/config/supabase';
import type {
  Veterinary,
  VeterinaryFilters,
} from '../types/veterinary.types';

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

const mapVeterinaryError = (error: unknown) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para cargar las veterinarias.'
    );
  }

  return new Error(
    `No pudimos procesar las veterinarias. ${getErrorMessage(
      error
    )}`
  );
};

export const listVeterinaries = async (
  filters?: Partial<VeterinaryFilters>
) => {
  let query = supabase
    .from('veterinaries')
    .select('*')
    .order('is_emergency', {
      ascending: false,
    })
    .order('is_24_7', {
      ascending: false,
    })
    .order('name', {
      ascending: true,
    });

  if (filters?.onlyEmergency) {
    query = query.eq('is_emergency', true);
  }

  if (filters?.only24Hours) {
    query = query.eq('is_24_7', true);
  }

  const { data, error } = await query;

  if (error) {
    throw mapVeterinaryError(error);
  }

  return (data ?? []) as Veterinary[];
};

export const getVeterinaryById = async (
  veterinaryId: string
) => {
  const { data, error } = await supabase
    .from('veterinaries')
    .select('*')
    .eq('id', veterinaryId)
    .maybeSingle();

  if (error) {
    throw mapVeterinaryError(error);
  }

  return (data as Veterinary | null) ?? null;
};

export const listSavedVeterinaryIds = async (
  ownerId: string
) => {
  const { data, error } = await supabase
    .from('saved_veterinaries')
    .select('veterinary_id')
    .eq('owner_id', ownerId);

  if (error) {
    throw mapVeterinaryError(error);
  }

  return (data ?? []).map(
    (item) => item.veterinary_id as string
  );
};

export const listSavedVeterinaries = async (
  ownerId: string
) => {
  const savedIds =
    await listSavedVeterinaryIds(ownerId);

  if (savedIds.length === 0) {
    return [] as Veterinary[];
  }

  const { data, error } = await supabase
    .from('veterinaries')
    .select('*')
    .in('id', savedIds)
    .order('name', {
      ascending: true,
    });

  if (error) {
    throw mapVeterinaryError(error);
  }

  return (data ?? []) as Veterinary[];
};

export const saveVeterinary = async ({
  ownerId,
  veterinaryId,
  petId,
}: {
  ownerId: string;
  veterinaryId: string;
  petId?: string | null;
}) => {
  const { error } = await supabase
    .from('saved_veterinaries')
    .upsert(
      {
        owner_id: ownerId,
        veterinary_id: veterinaryId,
        pet_id: petId ?? null,
      },
      {
        onConflict: 'owner_id,veterinary_id',
      }
    );

  if (error) {
    throw mapVeterinaryError(error);
  }
};

export const removeSavedVeterinary = async ({
  ownerId,
  veterinaryId,
}: {
  ownerId: string;
  veterinaryId: string;
}) => {
  const { error } = await supabase
    .from('saved_veterinaries')
    .delete()
    .eq('owner_id', ownerId)
    .eq('veterinary_id', veterinaryId);

  if (error) {
    throw mapVeterinaryError(error);
  }
};
