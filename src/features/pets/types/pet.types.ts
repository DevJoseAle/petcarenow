export enum PetType {
  Dog = 'dog',
  Cat = 'cat',
  Bird = 'bird',
  Rabbit = 'rabbit',
  Hamster = 'hamster',
  Reptile = 'reptile',
  Other = 'other',
}

export enum PetGender {
  Male = 'male',
  Female = 'female',
  Unknown = 'unknown',
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  pet_type: PetType;
  gender: PetGender | null;
  breed: string | null;
  birth_date: string | null;
  age_years: number | null;
  weight_kg: number | null;
  photo_url: string | null;
  allergies: string[];
  medical_conditions: string[];
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreatePetInput {
  owner_id: string;
  name: string;
  pet_type: PetType;
  gender: PetGender | null;
  breed: string | null;
  birth_date: string | null;
  age_years: number | null;
  weight_kg: number | null;
  photo_url: string | null;
  allergies: string[];
  medical_conditions: string[];
  is_active: boolean;
}

export interface PetServiceError {
  code: 'NETWORK_ERROR' | 'UNEXPECTED_ERROR';
  message: string;
}

export type CreatePetResult =
  | {
      success: true;
      data: Pet;
    }
  | {
      success: false;
      error: PetServiceError;
      partialData?: Pet;
    };

export interface PetOption<T> {
  value: T;
  label: string;
}

export interface PetHealthOption {
  id: string;
  label: string;
  iconName: string;
  category: 'allergy' | 'medical';
}

export const petTypeOptions: PetOption<PetType>[] = [
  { value: PetType.Dog, label: 'Perro' },
  { value: PetType.Cat, label: 'Gato' },
  { value: PetType.Bird, label: 'Ave' },
  { value: PetType.Rabbit, label: 'Conejo' },
  { value: PetType.Hamster, label: 'Hámster' },
  { value: PetType.Reptile, label: 'Reptil' },
  { value: PetType.Other, label: 'Otro' },
];

export const petGenderOptions: PetOption<PetGender>[] = [
  { value: PetGender.Male, label: 'Masculino' },
  { value: PetGender.Female, label: 'Femenino' },
  { value: PetGender.Unknown, label: 'Desconocido' },
];

export const dogBreedOptions: PetOption<string>[] = [
  { value: 'mixed', label: 'Mestizo' },
  { value: 'labradorRetriever', label: 'Labrador Retriever' },
  { value: 'germanShepherd', label: 'Pastor Alemán' },
  { value: 'bulldog', label: 'Bulldog' },
  { value: 'goldenRetriever', label: 'Golden Retriever' },
  { value: 'poodle', label: 'Poodle' },
  { value: 'chihuahua', label: 'Chihuahua' },
  { value: 'beagle', label: 'Beagle' },
  { value: 'rottweiler', label: 'Rottweiler' },
  { value: 'yorkshireTerrier', label: 'Yorkshire Terrier' },
  { value: 'boxer', label: 'Boxer' },
  { value: 'dachshund', label: 'Dachshund (Salchicha)' },
  { value: 'siberianHusky', label: 'Husky Siberiano' },
  { value: 'shihTzu', label: 'Shih Tzu' },
  { value: 'pug', label: 'Pug' },
  { value: 'borderCollie', label: 'Border Collie' },
  { value: 'other', label: 'Otro' },
];

export const catBreedOptions: PetOption<string>[] = [
  { value: 'mixed', label: 'Mestizo / Carey' },
  { value: 'siamese', label: 'Siamés' },
  { value: 'persian', label: 'Persa' },
  { value: 'maineCoon', label: 'Maine Coon' },
  { value: 'bengal', label: 'Bengala' },
  { value: 'ragdoll', label: 'Ragdoll' },
  { value: 'sphynx', label: 'Sphynx' },
  { value: 'britishShorthair', label: 'British Shorthair' },
  { value: 'russianBlue', label: 'Azul Ruso' },
  { value: 'norwegianForest', label: 'Bosque Noruego' },
  { value: 'other', label: 'Otro' },
];

export const petHealthOptions: PetHealthOption[] = [
  {
    id: 'allergies',
    label: 'Alergias',
    iconName: 'flower-outline',
    category: 'allergy',
  },
  {
    id: 'sterilized',
    label: 'Esterilizado/a',
    iconName: 'cut-outline',
    category: 'medical',
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    iconName: 'water-outline',
    category: 'medical',
  },
  {
    id: 'arthritis',
    label: 'Artritis',
    iconName: 'fitness-outline',
    category: 'medical',
  },
  {
    id: 'cardiac',
    label: 'Cardíaco',
    iconName: 'heart-outline',
    category: 'medical',
  },
  {
    id: 'renal',
    label: 'Renal',
    iconName: 'medkit-outline',
    category: 'medical',
  },
  {
    id: 'other-condition',
    label: 'Otra condición',
    iconName: 'document-text-outline',
    category: 'medical',
  },
];
