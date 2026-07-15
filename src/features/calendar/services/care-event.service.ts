import { supabase } from '@/config/supabase';
import type {
  CareEvent,
  CareEventUsageSummary,
  CreateCareEventInput,
  UpdateCareEventInput,
} from '../types/care-event.types';

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

const mapCareEventError = (error: unknown) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para cargar los cuidados.'
    );
  }

  return new Error(
    `No pudimos procesar los cuidados. ${getErrorMessage(
      error
    )}`
  );
};

export const listCareEvents = async (
  ownerId: string
) => {
  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('owner_id', ownerId)
    .order('starts_at', {
      ascending: true,
    });

  if (error) {
    throw mapCareEventError(error);
  }

  return (data ?? []) as CareEvent[];
};

export const getCareEventUsageSummary = async (
  ownerId: string
): Promise<CareEventUsageSummary> => {
  const { count, error } = await supabase
    .from('care_events')
    .select('id', {
      count: 'exact',
      head: true,
    })
    .eq('owner_id', ownerId);

  if (error) {
    throw mapCareEventError(error);
  }

  return {
    totalEvents: count ?? 0,
  };
};

export const listUpcomingCareEventsByPet = async (
  ownerId: string,
  petId: string
) => {
  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('pet_id', petId)
    .eq('status', 'scheduled')
    .order('starts_at', {
      ascending: true,
    });

  if (error) {
    throw mapCareEventError(error);
  }

  return (data ?? []) as CareEvent[];
};

export const listVaccinesByPet = async (
  ownerId: string,
  petId: string
) => {
  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('pet_id', petId)
    .eq('event_type', 'vaccine')
    .neq('status', 'cancelled')
    .order('starts_at', {
      ascending: false,
    });

  if (error) {
    throw mapCareEventError(error);
  }

  return (data ?? []) as CareEvent[];
};

export const getLatestConsultationByPet = async (
  ownerId: string,
  petId: string
) => {
  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('pet_id', petId)
    .eq('event_type', 'consultation')
    .eq('status', 'completed')
    .order('starts_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw mapCareEventError(error);
  }

  return (data as CareEvent | null) ?? null;
};

export const createCareEvent = async (
  input: CreateCareEventInput
) => {
  const { data, error } = await supabase
    .from('care_events')
    .insert({
      pet_id: input.pet_id,
      owner_id: input.owner_id,
      event_type: input.event_type,
      title: input.title,
      description: input.description ?? null,
      starts_at: input.starts_at,
      ends_at: input.ends_at ?? null,
      status: input.status ?? 'scheduled',
      reminder_at: input.reminder_at ?? null,
      metadata: input.metadata ?? null,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw mapCareEventError(error);
  }

  return data as CareEvent;
};

export const getCareEventById = async (
  ownerId: string,
  eventId: string
) => {
  const { data, error } = await supabase
    .from('care_events')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('id', eventId)
    .maybeSingle();

  if (error) {
    throw mapCareEventError(error);
  }

  return (data as CareEvent | null) ?? null;
};

export const updateCareEvent = async (
  ownerId: string,
  eventId: string,
  input: UpdateCareEventInput
) => {
  const { data, error } = await supabase
    .from('care_events')
    .update(input)
    .eq('owner_id', ownerId)
    .eq('id', eventId)
    .select('*')
    .single();

  if (error || !data) {
    throw mapCareEventError(error);
  }

  return data as CareEvent;
};

export const deleteCareEvent = async (
  ownerId: string,
  eventId: string
) => {
  const { error } = await supabase
    .from('care_events')
    .delete()
    .eq('owner_id', ownerId)
    .eq('id', eventId);

  if (error) {
    throw mapCareEventError(error);
  }
};
