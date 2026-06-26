import {
  getLatestConsultationByPet,
  listVaccinesByPet,
} from '@/features/calendar/services/care-event.service';
import type { Pet } from '@/features/pets/types/pet.types';
import type { CareProfileData } from '../types/care-profile.types';
import { getCareEventMetadataValue } from '../types/care-profile.types';

const formatDateLabel = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const buildCareProfile = async ({
  ownerId,
  pet,
}: {
  ownerId: string;
  pet: Pet;
}): Promise<CareProfileData> => {
  const [vaccines, latestConsultation] =
    await Promise.all([
      listVaccinesByPet(ownerId, pet.id),
      getLatestConsultationByPet(ownerId, pet.id),
    ]);

  const vaccinations = vaccines.map((event) => {
    const vaccineName = getCareEventMetadataValue(
      event.metadata,
      'vaccine_name'
    );
    const dose = getCareEventMetadataValue(
      event.metadata,
      'dose'
    );
    const appliedAt =
      getCareEventMetadataValue(
        event.metadata,
        'applied_at'
      ) ?? event.starts_at;
    const nextDueAt = getCareEventMetadataValue(
      event.metadata,
      'next_due_at'
    );

    return {
      id: event.id,
      title: vaccineName || event.title,
      subtitle: dose || event.description || 'Vacuna registrada',
      appliedAtLabel:
        formatDateLabel(appliedAt) ?? 'Fecha no disponible',
      nextDueLabel: nextDueAt
        ? formatDateLabel(nextDueAt)
        : null,
      event,
    };
  });

  const latestMedicalVisit = latestConsultation
    ? {
        id: latestConsultation.id,
        title: latestConsultation.title,
        dateLabel:
          formatDateLabel(
            latestConsultation.starts_at
          ) ?? 'Fecha no disponible',
        clinicName: getCareEventMetadataValue(
          latestConsultation.metadata,
          'clinic_name'
        ),
        doctorName: getCareEventMetadataValue(
          latestConsultation.metadata,
          'doctor_name'
        ),
        reason:
          getCareEventMetadataValue(
            latestConsultation.metadata,
            'reason'
          ) ?? latestConsultation.description,
        notes: getCareEventMetadataValue(
          latestConsultation.metadata,
          'notes'
        ),
        event: latestConsultation,
      }
    : null;

  return {
    pet,
    vaccinations,
    latestMedicalVisit,
    hasPartialSections:
      vaccinations.length === 0 ||
      latestMedicalVisit === null,
  };
};

export const __private__ = {
  formatDateLabel,
};
