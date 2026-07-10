# Notifications

## Goal

Permitir que el usuario autenticado gestione desde `Más` una pantalla real de `Notificaciones`, donde pueda entender el estado actual de sus avisos y controlar las preferencias base del MVP.

En esta primera iteración, la HU debe cubrir:

* permisos de notificaciones del dispositivo
* preferencias básicas visibles para el usuario
* estructura lista para conectar recordatorios reales de eventos y registros más adelante

No forma parte de esta HU:

* envío real de push notifications
* token push persistido en Supabase
* programación avanzada de recordatorios por evento
* centro histórico completo de notificaciones recibidas

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. Toca `Notificaciones`.
3. El sistema navega a una pantalla real de `Notificaciones`.
4. La pantalla resuelve el estado local inicial y el permiso actual del dispositivo.
5. El usuario visualiza si las notificaciones están habilitadas o no.
6. El usuario puede activar o desactivar preferencias base del MVP.
7. Si el permiso del sistema no está concedido, la pantalla debe explicarlo claramente.
8. Si el usuario quiere habilitarlas y el sistema lo permite, debe poder disparar la solicitud de permiso o ser guiado a ajustes del dispositivo.
9. El usuario puede volver a `Más` con navegación nativa.

## Screens

### NotificationsScreen

Pantalla principal de notificaciones accesible desde `Más`.

Debe mostrar al menos:

* encabezado claro
* botón nativo de regreso
* estado actual de permisos
* preferencias agrupadas
* feedback visual si falla la carga o actualización

Secciones mínimas recomendadas:

* `Estado de permisos`
* `Recordatorios`
* `Preferencias`

Opciones mínimas recomendadas para esta iteración:

* `Permitir notificaciones`
  Refleja el estado actual del permiso del dispositivo.
* `Recordatorios de próximos cuidados`
  Preferencia base del MVP.
* `Alertas de registros importantes`
  Preferencia base para evolución futura.
* `Resumen diario`
  Puede quedar visible pero desactivado por defecto.

## States

### NotificationsLoading

La pantalla está resolviendo permisos y preferencias.

### NotificationsReady

La pantalla puede renderizar opciones y aceptar interacción.

### NotificationsUpdating

Se está guardando una preferencia local.

### NotificationsPermissionDenied

El usuario no ha concedido permisos y debe mostrarse guía clara.

### NotificationsError

Falló la carga o guardado y debe mostrarse feedback recuperable.

## Validations

### Navigation Rules

* `Notificaciones` debe navegar a una pantalla real
* el botón back debe regresar a `Más`
* la pantalla no debe romper el shell autenticado

### Permission Rules

* la UI debe distinguir entre permiso concedido, denegado o no determinado
* no debe fingirse que las push están activas si el sistema no concedió permiso
* si el permiso está denegado, la pantalla debe comunicar el siguiente paso

### Persistence Rules

* las preferencias visibles deben persistirse localmente
* una actualización fallida no debe dejar el estado ambiguo
* si una preferencia depende de permiso del sistema, eso debe reflejarse visualmente

## Error Handling

### Load Error

Si falla la carga inicial:

* la pantalla debe mostrar error claro
* debe existir retry
* no debe romper la navegación

### Update Error

Si falla guardar una preferencia:

* la UI debe informar el fallo
* el usuario debe poder reintentar
* el resto de la pantalla debe seguir usable

### Permission Error

Si el sistema no concede permisos o falla la solicitud:

* debe mostrarse mensaje claro
* debe existir acción explícita para reintentar o ir a ajustes

## Services

### Notifications Service

Responsabilidad:

* leer y persistir preferencias locales de notificaciones
* abstraer el acceso a permisos del dispositivo

Métodos esperados:

* `getNotificationSettings()`
* `updateNotificationSetting(key, value)`
* `getNotificationPermissionStatus()`
* `requestNotificationPermission()`

Nota:

Si en esta iteración no se implementa push real, el service debe dejar claro que solo maneja permiso local y preferencias del MVP.

## Store

No es obligatorio crear store global.

La pantalla puede manejar localmente:

* loading
* errores
* toggles
* estado del permiso

Solo se evalúa store si estas preferencias necesitan compartirse de forma transversal más adelante.

## Tests

### Hook Tests

* debe cargar el estado inicial de permisos y preferencias
* debe manejar loading
* debe manejar error de carga
* debe actualizar una preferencia editable
* debe manejar permiso denegado

### Service Tests

* debe devolver preferencias por defecto
* debe persistir una preferencia
* debe mapear errores de lectura/escritura

### Screen Tests

* debe renderizar encabezado y grupos
* debe mostrar estado del permiso
* debe mostrar retry en error
* debe permitir volver a `Más`

## Acceptance Criteria

* Existe una pantalla real de `Notificaciones` accesible desde `Más`.
* La pantalla muestra claramente si el permiso del dispositivo está concedido o no.
* Las preferencias base visibles del MVP pueden persistirse localmente.
* La pantalla contempla loading, error y retry.
* El usuario puede volver a `Más` con navegación nativa.
* La lógica reside en screen + hook + service y no en el route file.
