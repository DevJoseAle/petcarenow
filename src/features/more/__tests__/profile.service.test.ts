import {
  getProfileById,
  updateProfile,
} from '../services/profile.service';
import { supabase } from '@/config/supabase';

jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('profile.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('gets profile by id', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: {
        id: 'user-1',
        full_name: 'Jose',
      },
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      select,
    } as never);

    await expect(
      getProfileById('user-1')
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'user-1',
      })
    );
  });

  test('updates user profile', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'user-1',
        full_name: 'Jose Rodriguez',
      },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const eq = jest.fn(() => ({ select }));
    const update = jest.fn(() => ({ eq }));

    mockedSupabase.from.mockReturnValue({
      update,
    } as never);

    await expect(
      updateProfile('user-1', {
        full_name: 'Jose Rodriguez',
        country: 'Chile',
        language: 'es',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        full_name: 'Jose Rodriguez',
      })
    );

    expect(update).toHaveBeenCalledWith({
      full_name: 'Jose Rodriguez',
      country: 'Chile',
      language: 'es',
    });
  });
});
