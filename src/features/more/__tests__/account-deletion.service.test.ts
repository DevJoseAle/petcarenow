import { supabase } from '@/config/supabase';
import { deleteCurrentUserAccount } from '../services/account-deletion.service';

jest.mock('@/config/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    functions: {
      invoke: jest.fn(),
    },
  },
}));

const mockedSupabase =
  supabase as jest.Mocked<typeof supabase>;

describe('account-deletion.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('invokes remote delete account function', async () => {
    mockedSupabase.auth.getSession.mockResolvedValue(
      {
        data: {
          session: {
            access_token: 'token-123',
          },
        },
        error: null,
      } as never
    );
    mockedSupabase.functions.invoke.mockResolvedValue(
      {
        data: null,
        error: null,
      } as never
    );

    await expect(
      deleteCurrentUserAccount()
    ).resolves.toBeUndefined();

    expect(
      mockedSupabase.functions.invoke
    ).toHaveBeenCalledWith(
      'delete-account',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer token-123',
        },
      })
    );
  });

  test('fails when there is no active session', async () => {
    mockedSupabase.auth.getSession.mockResolvedValue(
      {
        data: {
          session: null,
        },
        error: null,
      } as never
    );

    await expect(
      deleteCurrentUserAccount()
    ).rejects.toThrow(
      'No encontramos una sesión activa para eliminar tu cuenta.'
    );
  });

  test('maps missing function errors', async () => {
    mockedSupabase.auth.getSession.mockResolvedValue(
      {
        data: {
          session: {
            access_token: 'token-123',
          },
        },
        error: null,
      } as never
    );
    mockedSupabase.functions.invoke.mockResolvedValue(
      {
        data: null,
        error: new Error(
          'Function not found'
        ),
      } as never
    );

    await expect(
      deleteCurrentUserAccount()
    ).rejects.toThrow(
      'La eliminación de cuenta no está disponible en este ambiente todavía.'
    );
  });
});
