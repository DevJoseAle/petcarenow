# delete-account

Edge Function para eliminar la cuenta autenticada desde la app.

## Qué hace

1. Valida el `Authorization: Bearer <token>` recibido desde la app.
2. Busca el usuario autenticado en Supabase Auth.
3. Elimina fotos de mascotas en el bucket `pet-photos` bajo el prefijo `<userId>/`.
4. Elimina la fila de `profiles`.
5. Elimina el usuario de `auth.users`.

La eliminación de `profiles` debe disparar los `on delete cascade` documentados para datos dependientes como:

* `pets`
* `care_events`
* `pet_records`
* `notification_devices`
* `notification_preferences`
* `saved_veterinaries`

## Deploy

```bash
supabase functions deploy delete-account
```

## Probar local

```bash
supabase functions serve delete-account
```

## Variables esperadas

Supabase expone estas variables en el runtime de funciones:

* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`

## Consumo desde app

La app ya la invoca con:

```ts
supabase.functions.invoke('delete-account')
```

pasando el bearer token de la sesión actual.
