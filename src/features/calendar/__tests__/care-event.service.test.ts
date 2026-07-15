import {
  createCareEvent,
  deleteCareEvent,
  getCareEventById,
  getCareEventUsageSummary,
  getLatestConsultationByPet,
  listCareEvents,
  listUpcomingCareEventsByPet,
  listVaccinesByPet,
  updateCareEvent,
} from '../services/care-event.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('care-event.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lists care events for the owner', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [{ id: 'event-1', owner_id: 'user-1' }],
      error: null,
    });
    const eq = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listCareEvents('user-1')
    ).resolves.toEqual([
      expect.objectContaining({ id: 'event-1' }),
    ]);
  });

  test('filters upcoming care events by pet', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [{ id: 'event-1', pet_id: 'pet-1' }],
      error: null,
    });
    const statusEq = jest.fn(() => ({ order }));
    const petEq = jest.fn(() => ({
      eq: statusEq,
    }));
    const ownerEq = jest.fn(() => ({
      eq: petEq,
    }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listUpcomingCareEventsByPet('user-1', 'pet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        pet_id: 'pet-1',
      }),
    ]);
  });

  test('returns the total event usage for the owner', async () => {
    const ownerEq = jest.fn().mockResolvedValue({
      count: 4,
      error: null,
    });
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getCareEventUsageSummary('user-1')
    ).resolves.toEqual({
      totalEvents: 4,
    });
  });

  test('returns only vaccines for the selected pet', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [{ id: 'event-1', event_type: 'vaccine' }],
      error: null,
    });
    const neq = jest.fn(() => ({ order }));
    const typeEq = jest.fn(() => ({ neq }));
    const petEq = jest.fn(() => ({
      eq: typeEq,
    }));
    const ownerEq = jest.fn(() => ({
      eq: petEq,
    }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVaccinesByPet('user-1', 'pet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        event_type: 'vaccine',
      }),
    ]);
  });

  test('returns latest completed consultation for the selected pet', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'event-1',
        event_type: 'consultation',
        status: 'completed',
      },
      error: null,
    });
    const limit = jest.fn(() => ({ maybeSingle }));
    const order = jest.fn(() => ({ limit }));
    const statusEq = jest.fn(() => ({ order }));
    const typeEq = jest.fn(() => ({
      eq: statusEq,
    }));
    const petEq = jest.fn(() => ({
      eq: typeEq,
    }));
    const ownerEq = jest.fn(() => ({
      eq: petEq,
    }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getLatestConsultationByPet('user-1', 'pet-1')
    ).resolves.toEqual(
      expect.objectContaining({
        event_type: 'consultation',
      })
    );
  });

  test('creates a care event', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'event-1',
        owner_id: 'user-1',
        pet_id: 'pet-1',
        title: 'Control general',
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));

    mockedSupabase.from.mockReturnValue({
      insert,
    } as never);

    await expect(
      createCareEvent({
        owner_id: 'user-1',
        pet_id: 'pet-1',
        event_type: 'consultation',
        title: 'Control general',
        starts_at: '2026-06-30T14:00:00.000Z',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'event-1',
        title: 'Control general',
      })
    );
  });

  test('gets a care event by id', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'event-1',
        owner_id: 'user-1',
      },
      error: null,
    });
    const idEq = jest.fn(() => ({ maybeSingle }));
    const ownerEq = jest.fn(() => ({ eq: idEq }));
    const select = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getCareEventById('user-1', 'event-1')
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'event-1',
      })
    );
  });

  test('updates a care event', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'event-1',
        title: 'Control actualizado',
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
      updateCareEvent('user-1', 'event-1', {
        title: 'Control actualizado',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        title: 'Control actualizado',
      })
    );
  });

  test('deletes a care event', async () => {
    const idEq = jest.fn().mockResolvedValue({
      error: null,
    });
    const ownerEq = jest.fn(() => ({ eq: idEq }));
    const del = jest.fn(() => ({ eq: ownerEq }));

    mockedSupabase.from.mockReturnValue({
      delete: del,
    } as never);

    await expect(
      deleteCareEvent('user-1', 'event-1')
    ).resolves.toBeUndefined();
  });
});
