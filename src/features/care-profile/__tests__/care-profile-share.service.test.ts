import {
  buildCareProfileShareMessage,
  buildCareProfileSharePayload,
} from '../services/care-profile-share.service';
import {
  PetGender,
  PetType,
} from '@/features/pets/types/pet.types';

const profile = {
  pet: {
    id: 'pet-1',
    owner_id: 'user-1',
    name: 'Luna',
    pet_type: PetType.Dog,
    gender: PetGender.Female,
    breed: 'Labrador',
    birth_date: '2023-01-10',
    age_years: null,
    weight_kg: 12,
    photo_url: null,
    allergies: ['Polen'],
    medical_conditions: ['Artritis'],
    is_active: true,
    created_at: null,
    updated_at: null,
  },
  vaccinations: [
    {
      id: 'vac-1',
      title: 'Rabia',
      subtitle: 'Refuerzo anual',
      appliedAtLabel: '20 de junio de 2026',
      nextDueLabel: '20 de junio de 2027',
      event: {} as never,
    },
  ],
  latestMedicalVisit: {
    id: 'visit-1',
    title: 'Consulta de control',
    dateLabel: '10 de junio de 2026',
    clinicName: 'Clinica Norte',
    doctorName: 'Dra. Perez',
    reason: 'Chequeo general',
    notes: null,
    event: {} as never,
  },
  hasPartialSections: false,
};

describe('care-profile-share.service', () => {
  test('builds a share payload', () => {
    const payload =
      buildCareProfileSharePayload(profile);

    expect(payload.petName).toBe('Luna');
    expect(payload.vaccinations).toHaveLength(1);
    expect(payload.latestMedicalVisit?.clinicName).toBe(
      'Clinica Norte'
    );
  });

  test('builds a readable share message without null artifacts', () => {
    const payload =
      buildCareProfileSharePayload(profile);
    const message =
      buildCareProfileShareMessage(payload);

    expect(message).toContain('Perfil de cuidado de Luna');
    expect(message).toContain('Vacunas:');
    expect(message).toContain('Última visita médica:');
    expect(message).not.toContain('undefined');
    expect(message).not.toContain('null');
  });
});
