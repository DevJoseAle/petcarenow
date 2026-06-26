import type { Pet } from '@/features/pets/types/pet.types';
import type {
  CareEvent,
  CareEventMetadata,
} from '@/features/calendar/types/care-event.types';

export interface CareProfileVaccinationItem {
  id: string;
  title: string;
  subtitle: string;
  appliedAtLabel: string;
  nextDueLabel: string | null;
  event: CareEvent;
}

export interface CareProfileMedicalVisit {
  id: string;
  title: string;
  dateLabel: string;
  clinicName: string | null;
  doctorName: string | null;
  reason: string | null;
  notes: string | null;
  event: CareEvent;
}

export interface CareProfileData {
  pet: Pet;
  vaccinations: CareProfileVaccinationItem[];
  latestMedicalVisit: CareProfileMedicalVisit | null;
  hasPartialSections: boolean;
}

export interface CareProfileSharePayload {
  petName: string;
  petTypeLabel: string;
  breed: string | null;
  birthDateLabel: string | null;
  weightLabel: string | null;
  allergies: string[];
  medicalConditions: string[];
  vaccinations: Array<{
    title: string;
    subtitle: string;
    appliedAtLabel: string;
    nextDueLabel: string | null;
  }>;
  latestMedicalVisit: {
    title: string;
    dateLabel: string;
    clinicName: string | null;
    doctorName: string | null;
    reason: string | null;
  } | null;
}

export const getCareEventMetadataValue = (
  metadata: CareEventMetadata | null,
  key: keyof CareEventMetadata
) => metadata?.[key] ?? null;
