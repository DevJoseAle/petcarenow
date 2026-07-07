import { supabase } from '@/config/supabase';
import type {
  VeterinaryHourBlock,
  VeterinaryRichProfile,
  VeterinaryServiceCategory,
  VeterinaryServiceItem,
  VeterinaryStaffMember,
} from '../types/veterinary.types';
import { getVeterinaryById } from './veterinary.service';

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

const mapRichProfileError = (error: unknown) => {
  const message =
    getErrorMessage(error).toLowerCase();

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet')
  ) {
    return new Error(
      'No pudimos conectarnos para cargar el perfil de la clínica.'
    );
  }

  return new Error(
    `No pudimos procesar el perfil de la clínica. ${getErrorMessage(
      error
    )}`
  );
};

export const listVeterinaryServiceCategories =
  async () => {
    const { data, error } = await supabase
      .from('veterinary_service_categories')
      .select('*')
      .order('sort_order', {
        ascending: true,
      });

    if (error) {
      throw mapRichProfileError(error);
    }

    return (data ?? []) as VeterinaryServiceCategory[];
  };

export const listVeterinaryServices = async (
  veterinaryId: string
) => {
  const { data, error } = await supabase
    .from('veterinary_services')
    .select('*')
    .eq('veterinary_id', veterinaryId)
    .order('name', {
      ascending: true,
    });

    if (error) {
      throw mapRichProfileError(error);
    }

    return (data ?? []) as VeterinaryServiceItem[];
  };

export const listVeterinaryStaff = async (
  veterinaryId: string
) => {
  const { data, error } = await supabase
    .from('veterinary_staff')
    .select('*')
    .eq('veterinary_id', veterinaryId)
    .eq('is_active', true)
    .order('full_name', {
      ascending: true,
    });

    if (error) {
      throw mapRichProfileError(error);
    }

    return (data ?? []) as VeterinaryStaffMember[];
  };

export const listVeterinaryHours = async (
  veterinaryId: string
) => {
    const { data, error } = await supabase
      .from('veterinary_hours')
      .select('*')
      .eq('veterinary_id', veterinaryId)
      .order('hour_type', {
        ascending: true,
      })
      .order('day_of_week', {
        ascending: true,
        nullsFirst: false,
      });

    if (error) {
      throw mapRichProfileError(error);
    }

    return (data ?? []) as VeterinaryHourBlock[];
  };

export const getVeterinaryRichProfile = async (
  veterinaryId: string
) => {
  try {
    const [
      veterinary,
      categories,
      services,
      staff,
      hours,
    ] = await Promise.all([
      getVeterinaryById(veterinaryId),
      listVeterinaryServiceCategories(),
      listVeterinaryServices(veterinaryId),
      listVeterinaryStaff(veterinaryId),
      listVeterinaryHours(veterinaryId),
    ]);

    if (!veterinary) {
      return null;
    }

    const categoriesByCode = new Map(
      categories.map((category) => [
        category.code,
        category,
      ])
    );

    const enrichedServices = services.map(
      (service) => ({
        ...service,
        category:
          categoriesByCode.get(
            service.category_code
          ) ?? null,
      })
    );

    return {
      veterinary,
      serviceCategories: categories,
      services: enrichedServices,
      staff,
      hours,
    } satisfies VeterinaryRichProfile;
  } catch (error) {
    throw mapRichProfileError(error);
  }
};
