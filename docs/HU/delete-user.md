# Delete User

## Goal

Permitir que un usuario autenticado pueda iniciar la eliminación definitiva de su cuenta desde la propia app, cumpliendo el requisito de App Review de Apple para apps que permiten creación de cuenta.

Esta HU debe dejar resuelto el flujo base de:

* acceso a la acción desde una pantalla real de cuenta o configuración
* confirmación explícita del usuario
* ejecución segura del proceso de eliminación
* cierre de sesión local posterior
* feedback claro de éxito o error

No forma parte obligatoria de esta HU:

* recuperación de cuenta eliminada
* baja temporal o desactivación
* panel administrativo de borrado
* exportación de datos previa al borrado
* soporte para múltiples proveedores de autenticación distintos de email/password

## Apple Requirement

Apple exige que toda app que permita crear cuenta también permita iniciar la eliminación de cuenta desde dentro de la app.

Puntos relevantes de la guideline oficial:

* la opción debe ser fácil de encontrar dentro de la app
* debe permitir eliminar la cuenta completa, no solo desactivarla
* si parte del proceso termina en web, la app debe enlazar directamente a esa página final

Fuentes oficiales:

* [App Store Review Guidelines 5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/)
* [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)

## User Flow

1. El usuario autenticado entra a la zona de cuenta, idealmente desde `Perfil de usuario` o `Configuración`.
2. El usuario encuentra la opción `Eliminar cuenta`.
3. La app presenta una explicación clara del impacto:
   * pérdida definitiva de acceso
   * eliminación de datos asociados salvo retención legal mínima
   * necesidad de confirmación explícita
4. El usuario confirma que desea eliminar la cuenta.
5. La app ejecuta la operación segura de borrado.
6. Si el borrado es exitoso:
   * se limpian stores locales sensibles
   * se cierra la sesión
   * el usuario vuelve al flujo auth
7. Si el borrado falla:
   * la cuenta permanece activa
   * se muestra feedback claro
   * el usuario puede reintentar

## Screens

### UserProfileScreen or SettingsScreen

La HU puede integrar la acción en una pantalla ya existente si queda visible y fácil de encontrar.

Debe mostrar al menos:

* CTA clara para `Eliminar cuenta`
* contexto explicativo breve
* acceso a un flujo de confirmación

### DeleteAccount Confirmation State

No requiere necesariamente una pantalla aparte.

Puede resolverse con:

* bloque de confirmación en la propia screen
* modal
* alert de confirmación con copy suficientemente claro

La solución elegida debe dejar inequívoco que:

* la acción es irreversible
* se elimina la cuenta completa

## States

### DeleteAccountIdle

La opción está disponible pero aún no fue iniciada.

### DeleteAccountConfirming

La app muestra el estado de confirmación previa.

### DeleteAccountSubmitting

La operación remota de borrado está en curso.

### DeleteAccountSuccess

La cuenta fue eliminada correctamente y la app procede a cerrar sesión local y volver al auth flow.

### DeleteAccountError

La eliminación falló y la app debe mostrar feedback recuperable.

## Validations

### Visibility Rules

* la opción debe ser fácil de encontrar
* no debe quedar escondida detrás de múltiples niveles innecesarios
* debe estar dentro de una pantalla real de cuenta o settings

### Product Rules

* la app debe ofrecer eliminación real de cuenta, no solo desactivación
* la confirmación debe dejar claro que el proceso es irreversible
* si existe retención legal mínima de ciertos datos, debe explicitarse de forma controlada

### Security Rules

* la eliminación no debe ejecutarse accidentalmente con un solo toque ambiguo
* debe requerir confirmación explícita
* la operación no debe depender únicamente de estado local

### Backend Rules

* la eliminación real del usuario autenticado no debe resolverse solo desde el cliente si la plataforma lo impide
* si Supabase requiere privilegios elevados para borrar `auth.users`, esta HU debe contemplar un backend seguro o mecanismo equivalente
* deben contemplarse también los datos asociados al usuario en tablas dependientes

### Session Rules

* tras una eliminación exitosa, la sesión local debe invalidarse
* stores y estado sensible deben limpiarse
* la app debe volver al flujo auth de forma consistente

## Error Handling

### Confirmation Error

Si la confirmación no puede completarse correctamente:

* la cuenta no debe alterarse
* la UI debe permanecer estable

### Remote Deletion Error

Si falla la operación remota:

* la cuenta debe seguir activa
* debe mostrarse mensaje claro
* el usuario debe poder reintentar

### Partial Cleanup Risk

Si el sistema elimina parte del estado pero falla antes de finalizar:

* la implementación debe priorizar consistencia
* no debe dejar al usuario en una situación ambigua sin feedback

## Services

### Delete Account Service

Responsabilidad:

* iniciar la eliminación remota de cuenta
* encapsular la integración segura necesaria
* mapear errores a mensajes controlados para la UI

Métodos esperados:

* `deleteCurrentUserAccount(input?)`

Nota de arquitectura:

Es altamente probable que esta HU necesite una integración server-side o equivalente, porque el cliente móvil no debería tener permisos directos para borrar `auth.users` de forma privilegiada.

### Auth Store Integration

Debe reutilizarse para:

* cerrar sesión local
* limpiar stores dependientes
* redirigir a login u onboarding auth

## Store

No es obligatorio crear un store nuevo si el flujo vive en una sola pantalla.

Puede resolverse con estado local en hook para:

* loading
* confirmación
* error
* éxito transitorio

## Tests

### Hook Tests

* expone estado inicial correctamente
* entra en submitting al confirmar
* maneja éxito y ejecuta limpieza local
* maneja error remoto sin cerrar sesión

### Service Tests

* llama al mecanismo remoto de eliminación
* mapea errores de red o permisos
* devuelve éxito solo cuando la eliminación fue confirmada

### Screen Tests

* renderiza CTA de eliminación
* muestra confirmación explícita
* bloquea dobles envíos
* muestra feedback de error

## Acceptance Criteria

* existe una forma clara y accesible de iniciar eliminación de cuenta desde la app
* la app no ofrece solo desactivación temporal
* el usuario debe confirmar explícitamente la acción
* la eliminación exitosa invalida sesión y limpia estado local
* un fallo no deja al usuario en un estado ambiguo
* la HU queda alineada al requisito de Apple para account deletion

## Backend Rollout

### Edge Function

La app espera una Edge Function llamada `delete-account`.

Responsabilidades mínimas:

* validar el bearer token de la sesión actual
* identificar al usuario autenticado
* eliminar `profiles`
* eliminar el usuario de `auth.users`
* limpiar archivos asociados en Storage cuando aplique

### Deploy Checklist

1. Desplegar `supabase/functions/delete-account`.
2. Verificar que el proyecto tenga disponible `SUPABASE_SERVICE_ROLE_KEY`.
3. Confirmar que `profiles` y tablas dependientes respeten cascada o borrado consistente.
4. Probar desde una dev build autenticada.
5. Confirmar que tras el borrado el usuario vuelve a login y ya no puede reingresar con la cuenta eliminada.
