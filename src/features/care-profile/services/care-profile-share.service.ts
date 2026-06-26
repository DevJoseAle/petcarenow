import { Share } from 'react-native';
import {
  PetType,
  type Pet,
} from '@/features/pets/types/pet.types';
import type {
  CareProfileData,
  CareProfileSharePayload,
} from '../types/care-profile.types';

const PET_TYPE_LABELS: Record<PetType, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  hamster: 'Hámster',
  reptile: 'Reptil',
  other: 'Otro',
};

const formatBirthDateLabel = (pet: Pet) =>
  pet.birth_date
    ? new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(pet.birth_date))
    : null;

const formatWeightLabel = (pet: Pet) =>
  pet.weight_kg !== null
    ? `${pet.weight_kg} kg`
    : null;

export const buildCareProfileSharePayload = (
  profile: CareProfileData
): CareProfileSharePayload => ({
  petName: profile.pet.name,
  petTypeLabel: PET_TYPE_LABELS[profile.pet.pet_type],
  breed: profile.pet.breed,
  birthDateLabel: formatBirthDateLabel(profile.pet),
  weightLabel: formatWeightLabel(profile.pet),
  allergies: profile.pet.allergies.filter(Boolean),
  medicalConditions:
    profile.pet.medical_conditions.filter(Boolean),
  vaccinations: profile.vaccinations.map((item) => ({
    title: item.title,
    subtitle: item.subtitle,
    appliedAtLabel: item.appliedAtLabel,
    nextDueLabel: item.nextDueLabel,
  })),
  latestMedicalVisit: profile.latestMedicalVisit
    ? {
        title: profile.latestMedicalVisit.title,
        dateLabel: profile.latestMedicalVisit.dateLabel,
        clinicName:
          profile.latestMedicalVisit.clinicName,
        doctorName:
          profile.latestMedicalVisit.doctorName,
        reason: profile.latestMedicalVisit.reason,
      }
    : null,
});

const appendSection = (
  lines: string[],
  label: string,
  value: string | null
) => {
  if (!value) {
    return;
  }

  lines.push(`${label}: ${value}`);
};

export const buildCareProfileShareMessage = (
  payload: CareProfileSharePayload
) => {
  const lines: string[] = [
    `Perfil de cuidado de ${payload.petName}`,
  ];

  appendSection(lines, 'Tipo', payload.petTypeLabel);
  appendSection(lines, 'Raza', payload.breed);
  appendSection(
    lines,
    'Fecha de nacimiento',
    payload.birthDateLabel
  );
  appendSection(lines, 'Peso', payload.weightLabel);

  if (payload.allergies.length > 0) {
    appendSection(
      lines,
      'Alergias',
      payload.allergies.join(', ')
    );
  }

  if (payload.medicalConditions.length > 0) {
    appendSection(
      lines,
      'Condiciones médicas',
      payload.medicalConditions.join(', ')
    );
  }

  if (payload.vaccinations.length > 0) {
    lines.push('');
    lines.push('Vacunas:');
    payload.vaccinations.forEach((item) => {
      const detail = [item.subtitle, item.appliedAtLabel]
        .filter(Boolean)
        .join(' · ');
      lines.push(`- ${item.title}${detail ? ` (${detail})` : ''}`);
      if (item.nextDueLabel) {
        lines.push(`  Próxima dosis: ${item.nextDueLabel}`);
      }
    });
  }

  if (payload.latestMedicalVisit) {
    lines.push('');
    lines.push('Última visita médica:');
    lines.push(
      `- ${payload.latestMedicalVisit.title} (${payload.latestMedicalVisit.dateLabel})`
    );

    appendSection(
      lines,
      'Clínica',
      payload.latestMedicalVisit.clinicName
    );
    appendSection(
      lines,
      'Profesional',
      payload.latestMedicalVisit.doctorName
    );
    appendSection(
      lines,
      'Motivo',
      payload.latestMedicalVisit.reason
    );
  }

  return lines.join('\n');
};

export const shareCareProfile = async (
  profile: CareProfileData
) => {
  const payload =
    buildCareProfileSharePayload(profile);
  const message =
    buildCareProfileShareMessage(payload);

  await Share.share({
    message,
  });
};
