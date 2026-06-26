import { supabase } from '@/config/supabase';
import type {
  CreatePetRecordInput,
  PetRecord,
  UpdatePetRecordInput,
} from '../types/record.types';

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

const mapRecordError = (error: unknown) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para cargar los registros.'
    );
  }

  return new Error(
    `No pudimos procesar los registros. ${getErrorMessage(
      error
    )}`
  );
};

export const listPetRecords = async (
  ownerId: string,
  petId?: string
) => {
  let query = supabase
    .from('pet_records')
    .select('*')
    .eq('owner_id', ownerId);

  if (petId) {
    query = query.eq('pet_id', petId);
  }

  const { data, error } = await query.order(
    'recorded_at',
    {
      ascending: false,
    }
  );

  if (error) {
    throw mapRecordError(error);
  }

  return (data ?? []) as PetRecord[];
};

export const createPetRecord = async (
  input: CreatePetRecordInput
) => {
  const { data, error } = await supabase
    .from('pet_records')
    .insert({
      pet_id: input.pet_id,
      owner_id: input.owner_id,
      record_type: input.record_type,
      recorded_at: input.recorded_at,
      description: input.description,
      value_numeric: input.value_numeric ?? null,
      value_unit: input.value_unit ?? null,
      metadata: input.metadata ?? null,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw mapRecordError(error);
  }

  return data as PetRecord;
};

export const getPetRecordById = async (
  ownerId: string,
  recordId: string
) => {
  const { data, error } = await supabase
    .from('pet_records')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('id', recordId)
    .maybeSingle();

  if (error) {
    throw mapRecordError(error);
  }

  return (data as PetRecord | null) ?? null;
};

export const updatePetRecord = async (
  ownerId: string,
  recordId: string,
  input: UpdatePetRecordInput
) => {
  const { data, error } = await supabase
    .from('pet_records')
    .update(input)
    .eq('owner_id', ownerId)
    .eq('id', recordId)
    .select('*')
    .single();

  if (error || !data) {
    throw mapRecordError(error);
  }

  return data as PetRecord;
};

export const deletePetRecord = async (
  ownerId: string,
  recordId: string
) => {
  const { error } = await supabase
    .from('pet_records')
    .delete()
    .eq('owner_id', ownerId)
    .eq('id', recordId);

  if (error) {
    throw mapRecordError(error);
  }
};
