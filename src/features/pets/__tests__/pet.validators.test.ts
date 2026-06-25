import {
  initialPetOnboardingFormState,
  sanitizePetPayload,
  validatePetOnboardingStep,
} from '../utils/pet.validators';
import {
  PetGender,
  PetType,
} from '../types/pet.types';

describe('pet.validators', () => {
  test('requires name and pet type in step 1', () => {
    expect(
      validatePetOnboardingStep(
        1,
        initialPetOnboardingFormState
      )
    ).toEqual({
      name: 'El nombre es obligatorio.',
      petType: 'Selecciona el tipo de mascota.',
    });
  });

  test('validates future birth date on birth step', () => {
    expect(
      validatePetOnboardingStep(3, {
        ...initialPetOnboardingFormState,
        birthDate: '2099-01-01',
      })
    ).toEqual({
      birthDate:
        'La fecha de nacimiento no puede ser futura.',
    });
  });

  test('validates weight on weight step', () => {
    expect(
      validatePetOnboardingStep(4, {
        ...initialPetOnboardingFormState,
        weightKg: '0',
      })
    ).toEqual({
      weightKg:
        'El peso debe ser un número mayor que 0.',
    });
  });

  test('requires breed and gender on step 2', () => {
    expect(
      validatePetOnboardingStep(2, {
        ...initialPetOnboardingFormState,
        petType: PetType.Cat,
      })
    ).toEqual({
      breed: 'La raza es obligatoria.',
      gender:
        'Selecciona el sexo de tu mascota.',
    });
  });

  test('requires health selection on step 5', () => {
    expect(
      validatePetOnboardingStep(5, {
        ...initialPetOnboardingFormState,
      })
    ).toEqual({
      healthStatus:
        'Selecciona al menos una opción de salud.',
    });
  });

  test('requires photo on final step', () => {
    expect(
      validatePetOnboardingStep(6, {
        ...initialPetOnboardingFormState,
      })
    ).toEqual({
      photoURL:
        'La foto de la mascota es obligatoria.',
    });
  });

  test('sanitizes payload values before create', () => {
    expect(
      sanitizePetPayload('user-1', {
        ...initialPetOnboardingFormState,
        name: '  Luna  ',
        petType: PetType.Cat,
        gender: PetGender.Female,
        birthDate: '2024-01-10',
        weightKg: '4.5',
        ageYears: '1',
        photoURL: 'file:///tmp/pet.jpg',
        healthStatus: 'selected',
        selectedAllergies: ['Alergias'],
        selectedMedicalConditions: [
          'Artritis',
          'Cardíaco',
        ],
      })
    ).toEqual({
      owner_id: 'user-1',
      name: 'Luna',
      pet_type: PetType.Cat,
      gender: PetGender.Female,
      breed: null,
      birth_date: '2024-01-10',
      age_years: 1,
      weight_kg: 4.5,
      photo_url: null,
      allergies: ['Alergias'],
      medical_conditions: [
        'Artritis',
        'Cardíaco',
      ],
      is_active: true,
    });
  });
});
