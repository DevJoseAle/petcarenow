import {
  PetGender,
  PetType,
  type CreatePetInput,
} from '../types/pet.types';

export interface PetOnboardingFormState {
  name: string;
  petType: PetType | null;
  gender: PetGender | null;
  breed: string;
  birthDate: string;
  ageYears: string;
  weightKg: string;
  photoURL: string;
  photoBase64: string;
  photoMimeType: string;
  healthStatus: 'unset' | 'none' | 'selected';
  selectedAllergies: string[];
  selectedMedicalConditions: string[];
}

export interface PetOnboardingErrors {
  name?: string;
  petType?: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  ageYears?: string;
  weightKg?: string;
  healthStatus?: string;
  photoURL?: string;
}

export const initialPetOnboardingFormState: PetOnboardingFormState =
  {
    name: '',
    petType: null,
    gender: null,
    breed: '',
    birthDate: '',
    ageYears: '',
    weightKg: '',
    photoURL: '',
    photoBase64: '',
    photoMimeType: '',
    healthStatus: 'unset',
    selectedAllergies: [],
    selectedMedicalConditions: [],
  };

export const validatePetOnboardingStep = (
  currentStep: number,
  form: PetOnboardingFormState
) => {
  const errors: PetOnboardingErrors = {};

  if (currentStep === 1) {
    if (!form.name.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }

    if (!form.petType) {
      errors.petType =
        'Selecciona el tipo de mascota.';
    }
  }

  if (currentStep === 2) {
    if (!form.breed.trim()) {
      errors.breed = 'La raza es obligatoria.';
    }

    if (!form.gender) {
      errors.gender = 'Selecciona el sexo de tu mascota.';
    }
  }

  if (currentStep === 3) {
    if (!form.birthDate) {
      errors.birthDate =
        'La fecha de nacimiento es obligatoria.';
    } else {
      const date = new Date(form.birthDate);
      const isValidDate =
        !Number.isNaN(date.getTime());

      if (!isValidDate) {
        errors.birthDate =
          'Ingresa una fecha válida.';
      } else if (date > new Date()) {
        errors.birthDate =
          'La fecha de nacimiento no puede ser futura.';
      }
    }
  }

  if (currentStep === 4) {
    if (!form.weightKg) {
      errors.weightKg =
        'El peso es obligatorio.';
    } else {
      const weight = Number(form.weightKg);

      if (
        Number.isNaN(weight) ||
        weight <= 0
      ) {
        errors.weightKg =
          'El peso debe ser un número mayor que 0.';
      }
    }
  }

  if (currentStep === 5) {
    if (form.healthStatus === 'unset') {
      errors.healthStatus =
        'Selecciona al menos una opción de salud.';
    }
  }

  if (currentStep === 6) {
    if (!form.photoURL.trim()) {
      errors.photoURL =
        'La foto de la mascota es obligatoria.';
    }
  }

  return errors;
};

export const calculateAgeYearsFromBirthDate = (
  birthDate: string
) => {
  if (!birthDate) {
    return '';
  }

  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const today = new Date();
  let age =
    today.getFullYear() - date.getFullYear();
  const monthDifference =
    today.getMonth() - date.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < date.getDate())
  ) {
    age -= 1;
  }

  if (age < 0) {
    return '';
  }

  return String(age);
};

export const formatBirthDateLabel = (
  birthDate: string
) => {
  if (!birthDate) {
    return 'Seleccionar fecha';
  }

  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return 'Seleccionar fecha';
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getApproximateHumanAgeLabel = (
  ageYears: string
) => {
  if (!ageYears) {
    return '';
  }

  const age = Number(ageYears);

  if (Number.isNaN(age) || age < 0) {
    return '';
  }

  const equivalent =
    age <= 1 ? 15 : age * 7 + 8;

  return `Eso equivale a ${equivalent} años humanos aprox.`;
};

export const getHealthSummary = (
  form: PetOnboardingFormState
) => {
  const values = [
    ...form.selectedAllergies,
    ...form.selectedMedicalConditions,
  ];

  return values.length > 0 ? values : ['Ninguna'];
};

export const sanitizePetPayload = (
  ownerId: string,
  form: PetOnboardingFormState
): CreatePetInput => ({
  owner_id: ownerId,
  name: form.name.trim(),
  pet_type: form.petType as PetType,
  gender: form.gender,
  breed: form.breed.trim() || null,
  birth_date: form.birthDate || null,
  age_years: form.ageYears
    ? Number(form.ageYears)
    : null,
  weight_kg: form.weightKg
    ? Number(form.weightKg)
    : null,
  // Keep preview local for now; do not persist a device URI to backend.
  photo_url: null,
  allergies: form.selectedAllergies,
  medical_conditions:
    form.selectedMedicalConditions,
  is_active: true,
});
