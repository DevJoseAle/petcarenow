import {
  createPet,
  hasRegisteredPets,
} from '../services/pet.service';
import { supabase } from '@/config/supabase';
import {
  PetGender,
  PetType,
} from '../types/pet.types';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;
const mockedStorageFrom =
  supabase.storage.from as unknown as jest.Mock;

describe('pet.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns true when user already has pets', async () => {
    const limit = jest.fn().mockResolvedValue({
      data: [{ id: 'pet-1' }],
      error: null,
    });
    const eq = jest.fn(() => ({ limit }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      hasRegisteredPets('user-1')
    ).resolves.toBe(true);
  });

  test('returns false when user has no pets', async () => {
    const limit = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const eq = jest.fn(() => ({ limit }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      hasRegisteredPets('user-1')
    ).resolves.toBe(false);
  });

  test('creates pet and returns inserted row', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));

    mockedSupabase.from.mockReturnValue({
      insert,
    } as never);

    const result = await createPet({
      owner_id: 'user-1',
      name: 'Luna',
      pet_type: PetType.Cat,
      gender: PetGender.Female,
      breed: null,
      birth_date: null,
      age_years: null,
      weight_kg: null,
      photo_url: null,
      allergies: [],
      medical_conditions: [],
      is_active: true,
    });

    expect(insert).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
    });
  });

  test('uploads pet photo and stores public url', async () => {
    const photoUrl =
      'https://example.com/user-1/pet-1/photo.jpg';
    const base64Photo = 'cGV0LXBob3Rv';

    const insertSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
      error: null,
    });
    const insertSelect = jest.fn(() => ({
      single: insertSingle,
    }));
    const insert = jest.fn(() => ({
      select: insertSelect,
    }));

    const updateSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: photoUrl,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
      error: null,
    });
    const updateSelect = jest.fn(() => ({
      single: updateSingle,
    }));
    const eq = jest.fn(() => ({
      select: updateSelect,
    }));
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from
      .mockReturnValueOnce({
        insert,
      } as never)
      .mockReturnValueOnce({
        update,
      } as never);

    const upload = jest.fn().mockResolvedValue({
      error: null,
    });
    const getPublicUrl = jest.fn(() => ({
      data: { publicUrl: photoUrl },
    }));

    mockedStorageFrom.mockReturnValue({
      upload,
      getPublicUrl,
    } as never);

    const result = await createPet(
      {
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
      },
      {
        localPhotoUri: 'file:///tmp/luna.jpg',
        localPhotoBase64: base64Photo,
        localPhotoMimeType: 'image/jpeg',
      }
    );

    expect(upload).toHaveBeenCalledWith(
      'user-1/pet-1/photo.jpg',
      expect.any(ArrayBuffer),
      {
        contentType: 'image/jpeg',
        upsert: true,
      }
    );
    expect(update).toHaveBeenCalledWith({
      photo_url: photoUrl,
    });
    expect(result).toEqual({
      success: true,
      data: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: PetType.Cat,
        gender: PetGender.Female,
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: photoUrl,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
    });
  });
});
