import { usePetStore } from '../store/pet.store';
import { getUserPets } from '../services/pet.service';
import { PetGender, PetType } from '../types/pet.types';

jest.mock('../services/pet.service', () => ({
  getUserPets: jest.fn(),
}));

const mockedGetUserPets =
  getUserPets as jest.MockedFunction<
    typeof getUserPets
  >;

describe('pet.store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePetStore.getState().reset();
  });

  test('hydrates pets and selects first pet by default', async () => {
    mockedGetUserPets.mockResolvedValue([
      {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: 'mixed',
        birth_date: null,
        age_years: 2,
        weight_kg: 4,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
      {
        id: 'pet-2',
        owner_id: 'user-1',
        name: 'Max',
        pet_type: PetType.Dog,
        gender: PetGender.Male,
        breed: 'mixed',
        birth_date: null,
        age_years: 3,
        weight_kg: 12,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
    ]);

    await usePetStore.getState().hydratePets('user-1');

    expect(usePetStore.getState()).toMatchObject({
      activePetId: 'pet-1',
      pets: expect.arrayContaining([
        expect.objectContaining({ id: 'pet-1' }),
        expect.objectContaining({ id: 'pet-2' }),
      ]),
      isHydrating: false,
      generalError: '',
    });
  });

  test('allows changing active pet', () => {
    usePetStore.setState({
      pets: [
        {
          id: 'pet-1',
          owner_id: 'user-1',
          name: 'Luna',
          pet_type: PetType.Cat,
          gender: PetGender.Female,
          breed: 'mixed',
          birth_date: null,
          age_years: 2,
          weight_kg: 4,
          photo_url: null,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
        {
          id: 'pet-2',
          owner_id: 'user-1',
          name: 'Max',
          pet_type: PetType.Dog,
          gender: PetGender.Male,
          breed: 'mixed',
          birth_date: null,
          age_years: 3,
          weight_kg: 12,
          photo_url: null,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
      ],
      activePetId: 'pet-1',
      isHydrating: false,
      generalError: '',
    });

    usePetStore.getState().selectPet('pet-2');

    expect(usePetStore.getState().activePetId).toBe(
      'pet-2'
    );
  });

  test('removes active pet and falls back to next one', () => {
    usePetStore.setState({
      pets: [
        {
          id: 'pet-1',
          owner_id: 'user-1',
          name: 'Luna',
          pet_type: PetType.Cat,
          gender: PetGender.Female,
          breed: 'mixed',
          birth_date: null,
          age_years: 2,
          weight_kg: 4,
          photo_url: null,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
        {
          id: 'pet-2',
          owner_id: 'user-1',
          name: 'Max',
          pet_type: PetType.Dog,
          gender: PetGender.Male,
          breed: 'mixed',
          birth_date: null,
          age_years: 3,
          weight_kg: 12,
          photo_url: null,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
      ],
      activePetId: 'pet-1',
      isHydrating: false,
      generalError: '',
    });

    usePetStore.getState().removePet('pet-1');

    expect(usePetStore.getState().activePetId).toBe(
      'pet-2'
    );
  });
});
