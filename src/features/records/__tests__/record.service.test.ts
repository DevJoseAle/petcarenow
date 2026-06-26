import {
  createPetRecord,
  deletePetRecord,
  getPetRecordById,
  listPetRecords,
  updatePetRecord,
} from '../services/record.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('record.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lists pet records for owner and pet', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [{ id: 'record-1', pet_id: 'pet-1' }],
      error: null,
    });
    const petEq = jest.fn(() => ({ order }));
    const ownerEq = jest.fn(() => ({ eq: petEq }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listPetRecords('user-1', 'pet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'record-1',
      }),
    ]);
  });

  test('creates a pet record', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'record-1',
        description: 'Control de peso',
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));

    mockedSupabase.from.mockReturnValue({
      insert,
    } as never);

    await expect(
      createPetRecord({
        owner_id: 'user-1',
        pet_id: 'pet-1',
        record_type: 'weight',
        recorded_at: '2026-06-26T12:00:00.000Z',
        description: 'Control de peso',
        value_numeric: 12,
        value_unit: 'kg',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'record-1',
      })
    );
  });

  test('gets a pet record by id', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: { id: 'record-1' },
      error: null,
    });
    const idEq = jest.fn(() => ({ maybeSingle }));
    const ownerEq = jest.fn(() => ({ eq: idEq }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getPetRecordById('user-1', 'record-1')
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'record-1',
      })
    );
  });

  test('updates a pet record', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'record-1',
        description: 'Actualizado',
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const idEq = jest.fn(() => ({ select }));
    const ownerEq = jest.fn(() => ({ eq: idEq }));
    const update = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      update,
    } as never);

    await expect(
      updatePetRecord('user-1', 'record-1', {
        description: 'Actualizado',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        description: 'Actualizado',
      })
    );
  });

  test('deletes a pet record', async () => {
    const idEq = jest.fn().mockResolvedValue({
      error: null,
    });
    const ownerEq = jest.fn(() => ({ eq: idEq }));
    const del = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      delete: del,
    } as never);

    await expect(
      deletePetRecord('user-1', 'record-1')
    ).resolves.toBeUndefined();
  });
});
