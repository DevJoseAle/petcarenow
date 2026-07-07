import {
  getVeterinaryRichProfile,
  listVeterinaryHours,
  listVeterinaryServiceCategories,
  listVeterinaryServices,
  listVeterinaryStaff,
} from '../services/veterinary-rich-profile.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('veterinary-rich-profile.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lists service categories', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        { code: 'vaccination', label: 'Vacunación' },
      ],
      error: null,
    });
    const select = jest.fn(() => ({ order }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVeterinaryServiceCategories()
    ).resolves.toEqual([
      expect.objectContaining({
        code: 'vaccination',
      }),
    ]);
  });

  test('lists veterinary services', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        { id: 'service-1', veterinary_id: 'vet-1' },
      ],
      error: null,
    });
    const eq = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVeterinaryServices('vet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'service-1',
      }),
    ]);
  });

  test('lists veterinary staff', async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        { id: 'staff-1', veterinary_id: 'vet-1' },
      ],
      error: null,
    });
    const activeEq = jest.fn(() => ({ order }));
    const vetEq = jest.fn(() => ({ eq: activeEq }));
    const select = jest.fn(() => ({ eq: vetEq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVeterinaryStaff('vet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'staff-1',
      }),
    ]);
  });

  test('lists veterinary hours', async () => {
    const dayOrder = jest.fn().mockResolvedValue({
      data: [
        { id: 'hour-1', veterinary_id: 'vet-1' },
      ],
      error: null,
    });
    const typeOrder = jest.fn(() => ({
      order: dayOrder,
    }));
    const eq = jest.fn(() => ({ order: typeOrder }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      listVeterinaryHours('vet-1')
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'hour-1',
      }),
    ]);
  });

  test('builds rich profile combining root and related tables', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'vet-1',
        name: 'Clinica Vet',
      },
      error: null,
    });
    const idEq = jest.fn(() => ({ maybeSingle }));
    const selectVeterinary = jest.fn(() => ({
      eq: idEq,
    }));

    const categoriesOrder = jest.fn().mockResolvedValue({
      data: [
        {
          code: 'vaccination',
          label: 'Vacunación',
          sort_order: 1,
        },
      ],
      error: null,
    });
    const selectCategories = jest.fn(() => ({
      order: categoriesOrder,
    }));

    const servicesOrder = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'service-1',
          veterinary_id: 'vet-1',
          category_code: 'vaccination',
          name: 'Vacuna anual',
        },
      ],
      error: null,
    });
    const servicesEq = jest.fn(() => ({
      order: servicesOrder,
    }));
    const selectServices = jest.fn(() => ({
      eq: servicesEq,
    }));

    const staffOrder = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'staff-1',
          veterinary_id: 'vet-1',
          full_name: 'Dra. Ana',
        },
      ],
      error: null,
    });
    const staffActiveEq = jest.fn(() => ({
      order: staffOrder,
    }));
    const staffVetEq = jest.fn(() => ({
      eq: staffActiveEq,
    }));
    const selectStaff = jest.fn(() => ({
      eq: staffVetEq,
    }));

    const hoursDayOrder = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'hour-1',
          veterinary_id: 'vet-1',
          hour_type: 'general',
        },
      ],
      error: null,
    });
    const hoursTypeOrder = jest.fn(() => ({
      order: hoursDayOrder,
    }));
    const hoursEq = jest.fn(() => ({
      order: hoursTypeOrder,
    }));
    const selectHours = jest.fn(() => ({
      eq: hoursEq,
    }));

    mockedSupabase.from.mockImplementation(
      ((table: string) => {
        if (table === 'veterinaries') {
          return { select: selectVeterinary };
        }
        if (table === 'veterinary_service_categories') {
          return { select: selectCategories };
        }
        if (table === 'veterinary_services') {
          return { select: selectServices };
        }
        if (table === 'veterinary_staff') {
          return { select: selectStaff };
        }
        return { select: selectHours };
      }) as never
    );

    await expect(
      getVeterinaryRichProfile('vet-1')
    ).resolves.toEqual(
      expect.objectContaining({
        veterinary: expect.objectContaining({
          id: 'vet-1',
        }),
        services: [
          expect.objectContaining({
            id: 'service-1',
            category: expect.objectContaining({
              code: 'vaccination',
            }),
          }),
        ],
        staff: [
          expect.objectContaining({
            id: 'staff-1',
          }),
        ],
        hours: [
          expect.objectContaining({
            id: 'hour-1',
          }),
        ],
      })
    );
  });
});
