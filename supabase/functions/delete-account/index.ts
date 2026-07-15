import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (
  body: Record<string, unknown>,
  status = 200
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const getRequiredEnv = (name: string) => {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
};

const collectPetPhotoPaths = async ({
  adminClient,
  ownerId,
}: {
  adminClient: ReturnType<typeof createClient>;
  ownerId: string;
}) => {
  const { data: petFolders, error } =
    await adminClient.storage
      .from('pet-photos')
      .list(ownerId, {
        limit: 100,
      });

  if (error) {
    throw error;
  }

  const nestedResults = await Promise.all(
    (petFolders ?? []).map(async (folder) => {
      const folderPath = `${ownerId}/${folder.name}`;
      const { data: files, error: filesError } =
        await adminClient.storage
          .from('pet-photos')
          .list(folderPath, {
            limit: 100,
          });

      if (filesError) {
        throw filesError;
      }

      return (files ?? [])
        .filter((file) => file.name)
        .map(
          (file) => `${folderPath}/${file.name}`
        );
    })
  );

  return nestedResults.flat();
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  if (
    request.method !== 'POST' &&
    request.method !== 'DELETE'
  ) {
    return jsonResponse(
      {
        error:
          'Method not allowed. Use POST or DELETE.',
      },
      405
    );
  }

  try {
    const supabaseUrl =
      getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv(
      'SUPABASE_SERVICE_ROLE_KEY'
    );
    const authorizationHeader =
      request.headers.get('Authorization');

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith(
        'Bearer '
      )
    ) {
      return jsonResponse(
        {
          error:
            'Missing or invalid authorization header.',
        },
        401
      );
    }

    const accessToken =
      authorizationHeader.replace(
        'Bearer ',
        ''
      );

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const {
      data: userData,
      error: userError,
    } = await adminClient.auth.getUser(
      accessToken
    );

    if (userError || !userData.user) {
      return jsonResponse(
        {
          error:
            'Unauthorized. We could not validate the active session.',
        },
        401
      );
    }

    const userId = userData.user.id;
    const petPhotoPaths =
      await collectPetPhotoPaths({
        adminClient,
        ownerId: userId,
      });

    if (petPhotoPaths.length > 0) {
      const { error: removeStorageError } =
        await adminClient.storage
          .from('pet-photos')
          .remove(petPhotoPaths);

      if (removeStorageError) {
        return jsonResponse(
          {
            error:
              'We could not remove the pet photos associated with this account.',
            details:
              removeStorageError.message,
          },
          500
        );
      }
    }

    const { error: deleteProfileError } =
      await adminClient
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (deleteProfileError) {
      return jsonResponse(
        {
          error:
            'We could not remove the profile associated with this account.',
          details:
            deleteProfileError.message,
        },
        500
      );
    }

    const { error: deleteUserError } =
      await adminClient.auth.admin.deleteUser(
        userId
      );

    if (deleteUserError) {
      return jsonResponse(
        {
          error:
            'We could not remove the authenticated user.',
          details:
            deleteUserError.message,
        },
        500
      );
    }

    return jsonResponse({
      success: true,
      userId,
    });
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected error while deleting account.',
      },
      500
    );
  }
});
