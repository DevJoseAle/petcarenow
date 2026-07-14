import {
  createPet,
  deletePet,
  getPetUsageSummary,
  getUserPets,
  hasRegisteredPets,
  updatePet,
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

  test('lists only active pets for the user', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'pet-1',
          owner_id: 'user-1',
          name: 'Luna',
          is_active: true,
        },
      ],
      error: null,
    });
    const activeEq = jest.fn(() => ({ order }));
    const ownerEq = jest.fn(() => ({
      eq: activeEq,
    }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getUserPets('user-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'pet-1',
        is_active: true,
      }),
    ]);

    expect(ownerEq).toHaveBeenCalledWith(
      'owner_id',
      'user-1'
    );
    expect(activeEq).toHaveBeenCalledWith(
      'is_active',
      true
    );
  });

  test('builds a pet usage summary including inactive pets', async () => {
    const ownerEq = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'pet-1',
          is_active: true,
        },
        {
          id: 'pet-2',
          is_active: false,
        },
      ],
      error: null,
    });
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getPetUsageSummary('user-1')
    ).resolves.toEqual({
      totalPets: 2,
      activePets: 1,
      inactivePets: 1,
    });
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

  test('updates pet photo and stores new public url', async () => {
    const photoUrl =
      'https://example.com/user-1/pet-1/photo.jpg';
    const base64Photo = 'cGV0LXBob3Rv';

    const updatePetSingle = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          id: 'pet-1',
          owner_id: 'user-1',
          name: 'Luna',
          pet_type: PetType.Cat,
          gender: PetGender.Female,
          breed: null,
          birth_date: null,
          age_years: null,
          weight_kg: 4,
          photo_url: null,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          id: 'pet-1',
          owner_id: 'user-1',
          name: 'Luna',
          pet_type: PetType.Cat,
          gender: PetGender.Female,
          breed: null,
          birth_date: null,
          age_years: null,
          weight_kg: 4,
          photo_url: photoUrl,
          allergies: [],
          medical_conditions: [],
          is_active: true,
          created_at: null,
          updated_at: null,
        },
        error: null,
      });
    const updatePetSelect = jest.fn(() => ({
      single: updatePetSingle,
    }));
    const eq = jest.fn(() => ({
      select: updatePetSelect,
    }));
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from
      .mockReturnValueOnce({
        update,
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

    const result = await updatePet(
      'pet-1',
      {
        weight_kg: 4,
      },
      {
        ownerId: 'user-1',
        localPhotoUri: 'file:///tmp/luna.jpg',
        localPhotoBase64: base64Photo,
        localPhotoMimeType: 'image/jpeg',
      }
    );

    expect(update).toHaveBeenNthCalledWith(1, {
      weight_kg: 4,
    });
    expect(update).toHaveBeenNthCalledWith(2, {
      photo_url: photoUrl,
    });
    expect(upload).toHaveBeenCalledWith(
      'user-1/pet-1/photo.jpg',
      expect.any(ArrayBuffer),
      {
        contentType: 'image/jpeg',
        upsert: true,
      }
    );
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
        weight_kg: 4,
        photo_url: photoUrl,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
    });
  });

  test('soft deletes a pet by setting is_active to false', async () => {
    const eq = jest.fn().mockResolvedValue({
      data: [{ id: 'pet-1', is_active: false }],
      error: null,
    });
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      update,
    } as never);

    const result = await deletePet('pet-1');

    expect(update).toHaveBeenCalledWith({
      is_active: false,
    });
    expect(eq).toHaveBeenCalledWith('id', 'pet-1');
    expect(result).toEqual({
      success: true,
      data: [{ id: 'pet-1', is_active: false }],
    });
  });
});
