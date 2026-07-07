y# More

## Goal

Permitir que el usuario autenticado acceda desde la tab `Más` a un hub de opciones secundarias de la app, separando claramente:

* accesos activos y funcionales
* accesos placeholder listos para evolucionar
* acción de cierre de sesión segura

En esta HU, `Más` debe consolidar navegación útil y estable para:

* perfil de usuario
* veterinarias guardadas
* logout

Sin bloquear el resto del menú, aunque algunas opciones todavía queden como placeholders funcionales.

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. La pantalla muestra un listado de opciones del menú.
3. El usuario puede tocar:
   * `Perfil de usuario`
   * `Veterinarias guardadas`
   * `Configuración`
   * `Notificaciones`
   * `Suscripción / Premium`
   * `Ayuda`
   * `Términos y privacidad`
4. Si el usuario toca una opción activa, navega a su pantalla correspondiente.
5. Si el usuario toca una opción aún no implementada, el sistema debe responder de forma controlada y consistente.
   Debe mostrar un label o feedback de `Próximamente`.
6. El usuario puede cerrar sesión desde el CTA inferior.
7. Si el logout es exitoso, vuelve al flujo de autenticación sin conservar estado local sensible.

## Screens

### MoreScreen

Pantalla principal de la tab `Más`.

Debe mostrar:

* título o encabezado claro
* listado de opciones navegables
* distinción visual entre opciones activas y futuras
* label `Próximamente` en opciones aún no activas
* CTA de cerrar sesión
* feedback si falla el logout

### SavedVeterinariesScreen

Pantalla accesible desde `Más`.

Debe mostrar:

* listado de veterinarias guardadas del usuario
* empty state si no hay guardadas
* retry si falla la carga
* acceso al perfil de veterinaria
* navegación de regreso

### UserProfileScreen

Pantalla dedicada al perfil de usuario.

Para esta primera iteración debe enfocarse en consulta y edición básica de datos del perfil ya existente.

Debe mostrar al menos:

* nombre
* email si está disponible
* estado mínimo del perfil
* CTA de guardar si se habilita edición en esta HU

Si no se implementa edición completa en esta iteración, al menos debe existir una pantalla real y no redirigir a otra feature no relacionada.

## States

### MoreReady

La pantalla `Más` renderiza correctamente sus opciones y CTA principal.

### LogoutIdle

El usuario aún no inició el cierre de sesión.

### LogoutSubmitting

Se está procesando el cierre de sesión.

### LogoutError

El logout falló y debe mostrarse feedback recuperable.

### SavedVeterinariesLoading

Se están cargando las veterinarias guardadas.

### SavedVeterinariesReady

Las veterinarias guardadas están disponibles para consulta.

### SavedVeterinariesEmpty

El usuario no tiene veterinarias guardadas.

### SavedVeterinariesError

Falló la carga de guardadas y debe existir retry.

### UserProfileLoading

Se está resolviendo la información del perfil del usuario.

### UserProfileReady

El perfil está disponible para renderizado o edición básica.

### UserProfileError

No fue posible cargar o actualizar el perfil y la UI debe mostrar feedback claro.

## Validations

### Navigation Rules

* cada opción del menú debe tener comportamiento explícito
* una opción activa debe navegar a una pantalla real
* una opción placeholder no debe romper navegación ni quedar sin respuesta
* `Perfil de usuario` no debe seguir redirigiendo a `Mascotas`

### Logout Rules

* no debe ejecutarse más de una vez en paralelo
* debe limpiar sesión autenticada
* debe limpiar stores sensibles dependientes del usuario
* debe redirigir al flujo auth al finalizar exitosamente

### Saved Veterinaries Rules

* solo deben mostrarse veterinarias guardadas por el usuario autenticado
* si no hay guardadas, debe mostrarse empty state
* el listado debe seguir permitiendo navegar al perfil de veterinaria

### Profile Rules

* el perfil de usuario debe basarse en la entidad real `profiles`
* no se deben inventar datos locales desconectados de la fuente de verdad
* si existen campos opcionales ausentes, la UI debe tolerarlo sin romperse

## Error Handling

### Logout Error

Si falla el cierre de sesión:

* el usuario debe permanecer en la pantalla actual
* debe mostrarse mensaje claro
* debe poder reintentar

### Saved Veterinaries Error

Si falla la carga:

* la pantalla debe mostrar error claro
* debe existir retry
* no debe romper la navegación general de la app

### User Profile Error

Si falla la carga o guardado del perfil:

* debe mostrarse feedback recuperable
* la pantalla no debe quedar en blanco
* debe existir retry o salida segura

### Placeholder Actions

Las opciones aún no implementadas deben responder con un comportamiento controlado.

Ejemplos válidos:

* feedback visual de `Próximamente`
* badge o label visible dentro de la fila
* pantalla placeholder real si se decide más adelante

No deben:

* no hacer nada silenciosamente
* romper navegación

## Services

### Profile Service

Debe usar `profiles` como fuente de verdad.

Métodos esperados:

* `getProfileById(ownerId)`
* `updateProfile(ownerId, input)` si esta HU incluye edición

### Veterinary Service

Debe reutilizar la capacidad ya existente para:

* `listSavedVeterinaries(ownerId)`
* `getVeterinaryById(id)`

### Auth Store / Session Integration

El logout debe seguir apoyándose en la integración ya existente de auth para:

* cerrar sesión
* limpiar estado local dependiente
* redirigir al login

## Store

### Existing Stores

Esta HU puede reutilizar:

* `auth.store`
* `pet.store`
* `petOnboardingGate.store`
* `veterinaries.store` si aporta valor para favoritos

### New Store

No es obligatorio crear un store nuevo para `Más` si el estado es mayormente de pantalla.

Solo debe introducirse uno nuevo si:

* el perfil del usuario necesita compartirse entre múltiples pantallas
* existe persistencia o sincronización cross-feature justificada

## Tests

### More Screen Tests

* renderiza todas las opciones esperadas
* navega correctamente en opciones activas
* muestra label `Próximamente` en placeholders
* muestra feedback controlado en placeholders
* deshabilita o protege logout concurrente

### Profile Service / Hook Tests

* carga perfil correctamente
* tolera perfil incompleto
* maneja error de carga
* maneja actualización si se implementa edición

### Saved Veterinaries Tests

* muestra loading
* muestra empty state
* muestra lista de favoritas
* permite navegar al perfil
* muestra retry en error

### Logout Tests

* limpia stores al cerrar sesión
* redirige a auth
* muestra error si el logout falla

## Acceptance Criteria

* La tab `Más` debe renderizar un menú estable con opciones definidas.
* `Perfil de usuario` debe navegar a una pantalla real del perfil, no a otra feature ajena.
* `Veterinarias guardadas` debe abrir una pantalla real con lista, empty state y retry.
* Las opciones aún no implementadas deben mostrarse con label `Próximamente` y responder de forma controlada.
* `Cerrar sesión` debe limpiar sesión y devolver al usuario al login.
* Ninguna opción del menú debe quedar sin comportamiento explícito.
