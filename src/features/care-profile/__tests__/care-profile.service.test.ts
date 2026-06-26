import { buildCareProfile } from '../services/care-profile.service';
import {
  getLatestConsultationByPet,
  listVaccinesByPet,
} from '@/features/calendar/services/care-event.service';
import {
  PetGender,
  PetType,
} from '@/features/pets/types/pet.types';

jest.mock('@/features/calendar/services/care-event.service', () => ({
  listVaccinesByPet: jest.fn(),
  getLatestConsultationByPet: jest.fn(),
}));

const mockedListVaccinesByPet =
  listVaccinesByPet as jest.MockedFunction<
    typeof listVaccinesByPet
  >;
const mockedGetLatestConsultationByPet =
  getLatestConsultationByPet as jest.MockedFunction<
    typeof getLatestConsultationByPet
  >;

const basePet = {
  id: 'pet-1',
  owner_id: 'user-1',
  name: 'Luna',
  pet_type: PetType.Cat,
  gender: PetGender.Female,
  breed: 'mixed',
  birth_date: '2023-01-10',
  age_years: null,
  weight_kg: 4,
  photo_url: null,
  allergies: ['Polen'],
  medical_conditions: ['Artritis'],
  is_active: true,
  created_at: null,
  updated_at: null,
};

describe('care-profile.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('builds profile with vaccinations and latest consultation', async () => {
    mockedListVaccinesByPet.mockResolvedValue([
      {
        id: 'event-1',
        pet_id: 'pet-1',
        owner_id: 'user-1',
        event_type: 'vaccine',
        title: 'Vacuna antirrabica',
        description: 'Refuerzo anual',
        starts_at: '2026-06-20T12:00:00.000Z',
        ends_at: null,
        status: 'completed',
        reminder_at: null,
        metadata: {
          vaccine_name: 'Rabia',
          dose: 'Refuerzo anual',
          next_due_at: '2027-06-20T12:00:00.000Z',
        },
        created_at: '',
        updated_at: '',
      },
    ]);
    mockedGetLatestConsultationByPet.mockResolvedValue({
      id: 'event-2',
      pet_id: 'pet-1',
      owner_id: 'user-1',
      event_type: 'consultation',
      title: 'Consulta de control',
      description: 'Chequeo general',
      starts_at: '2026-06-10T12:00:00.000Z',
      ends_at: null,
      status: 'completed',
      reminder_at: null,
      metadata: {
        clinic_name: 'Clinica Norte',
        doctor_name: 'Dra. Perez',
      },
      created_at: '',
      updated_at: '',
    });

    const result = await buildCareProfile({
      ownerId: 'user-1',
      pet: basePet,
    });

    expect(result.vaccinations).toHaveLength(1);
    expect(result.latestMedicalVisit?.clinicName).toBe(
      'Clinica Norte'
    );
    expect(result.hasPartialSections).toBe(false);
  });

  test('marks profile as partial when secondary sections are missing', async () => {
    mockedListVaccinesByPet.mockResolvedValue([]);
    mockedGetLatestConsultationByPet.mockResolvedValue(null);

    const result = await buildCareProfile({
      ownerId: 'user-1',
      pet: basePet,
    });

    expect(result.vaccinations).toEqual([]);
    expect(result.latestMedicalVisit).toBeNull();
    expect(result.hasPartialSections).toBe(true);
  });
});
