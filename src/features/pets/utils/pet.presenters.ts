import {
  PetGender,
  PetType,
  catBreedOptions,
  dogBreedOptions,
  petGenderOptions,
  petTypeOptions,
  type Pet,
} from '../types/pet.types';

export const getPetTypeLabel = (
  petType: PetType | null
) =>
  petTypeOptions.find(
    (option) => option.value === petType
  )?.label ?? 'Tipo no definido';

export const getPetGenderLabel = (
  gender: PetGender | null
) =>
  petGenderOptions.find(
    (option) => option.value === gender
  )?.label ?? 'Sexo no definido';

export const getPetBreedLabel = (
  pet: Pick<Pet, 'pet_type' | 'breed'>
) => {
  if (!pet.breed) {
    return 'Raza no definida';
  }

  const allBreeds = [
    ...dogBreedOptions,
    ...catBreedOptions,
  ];

  return (
    allBreeds.find(
      (option) => option.value === pet.breed
    )?.label ?? pet.breed
  );
};

export const getPetAgeLabel = (pet: Pet) => {
  if (pet.age_years !== null) {
    return `${pet.age_years} años`;
  }

  if (!pet.birth_date) {
    return 'Edad no definida';
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(pet.birth_date));
};

export const getPetWeightLabel = (pet: Pet) =>
  pet.weight_kg !== null
    ? `${pet.weight_kg} kg`
    : 'Peso no definido';
