import {
  getVeterinaryById,
  listSavedVeterinaries,
  listSavedVeterinaryIds,
  listVeterinaries,
  removeSavedVeterinary,
  saveVeterinary,
} from '../services/veterinary.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('veterinary.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lists veterinaries with filters', async () => {
    const finalEq = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'vet-1',
          name: 'Clinica Vet',
          photo_url: null,
        },
      ],
      error: null,
    });
    const hourEq = jest.fn(() => finalEq());
    const emergencyEq = jest.fn(() => ({
      eq: hourEq,
    }));
    const thirdOrder = jest.fn(() => ({
      eq: emergencyEq,
    }));
    const secondOrder = jest.fn(() => ({
      order: thirdOrder,
    }));
    const firstOrder = jest.fn(() => ({
      order: secondOrder,
    }));
    const select = jest.fn(() => ({
      order: firstOrder,
    }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVeterinaries({
        onlyEmergency: true,
        only24Hours: true,
      })
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'vet-1',
      }),
    ]);
  });

  test('returns a veterinary by id', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: { id: 'vet-1', name: 'Clinica Vet' },
      error: null,
    });
    const idEq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq: idEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getVeterinaryById('vet-1')
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'vet-1',
      })
    );
  });

  test('lists saved veterinary ids', async () => {
    const ownerEq = jest.fn().mockResolvedValue({
      data: [
        { veterinary_id: 'vet-1' },
        { veterinary_id: 'vet-2' },
      ],
      error: null,
    });
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listSavedVeterinaryIds('user-1')
    ).resolves.toEqual(['vet-1', 'vet-2']);
  });

  test('lists saved veterinaries for the user', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        { id: 'vet-1', name: 'Clinica 1' },
      ],
      error: null,
    });
    const inFn = jest.fn(() => ({ order }));
    const selectVeterinaries = jest.fn(() => ({
      in: inFn,
    }));

    const ownerEq = jest.fn().mockResolvedValue({
      data: [{ veterinary_id: 'vet-1' }],
      error: null,
    });
    const selectSaved = jest.fn(() => ({
      eq: ownerEq,
    }));

    mockedSupabase.from.mockImplementation(
      ((table: string) => {
        if (table === 'saved_veterinaries') {
          return {
            select: selectSaved,
          };
        }

        return {
          select: selectVeterinaries,
        };
      }) as never
    );

    await expect(
      listSavedVeterinaries('user-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'vet-1',
      }),
    ]);
  });

  test('saves a veterinary for the user', async () => {
    const upsert = jest.fn().mockResolvedValue({
      error: null,
    });

    mockedSupabase.from.mockReturnValue({
      upsert,
    } as never);

    await expect(
      saveVeterinary({
        ownerId: 'user-1',
        veterinaryId: 'vet-1',
        petId: 'pet-1',
      })
    ).resolves.toBeUndefined();
  });

  test('removes a saved veterinary', async () => {
    const veterinaryEq = jest.fn().mockResolvedValue({
      error: null,
    });
    const ownerEq = jest.fn(() => ({
      eq: veterinaryEq,
    }));
    const del = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      delete: del,
    } as never);

    await expect(
      removeSavedVeterinary({
        ownerId: 'user-1',
        veterinaryId: 'vet-1',
      })
    ).resolves.toBeUndefined();
  });
});
