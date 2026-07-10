# Notifications Core

## Goal

Permitir que el usuario autenticado gestione desde `Más` una pantalla real de `Notificaciones`, conectada a permisos del dispositivo, registro real del dispositivo, preferencias persistidas y recordatorios útiles para el cuidado de su mascota.

Esta HU debe cubrir el corazón operativo del sistema de notificaciones para owners:

* permisos de notificaciones del dispositivo
* registro del dispositivo y token push
* preferencias persistidas del usuario
* programación base de recordatorios a partir de eventos/cuidados
* base lista para push remotas y deep links internos

No forma parte de esta HU:

* centro histórico completo de notificaciones recibidas
* inbox con leídas/no leídas
* agrupación por tipo en listado histórico

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. Toca `Notificaciones`.
3. El sistema navega a una pantalla real de `Notificaciones`.
4. La pantalla resuelve:
   * permiso del dispositivo
   * preferencias persistidas
   * estado de registro del dispositivo
5. Si el permiso no está concedido, la pantalla lo comunica y permite solicitarlo o guiar a ajustes.
6. Si el permiso está concedido, el usuario puede activar o desactivar preferencias reales.
7. El sistema registra o actualiza el dispositivo/token según corresponda.
8. El usuario puede definir qué tipos de avisos quiere recibir.
9. Los próximos cuidados y eventos relevantes quedan listos para disparar recordatorios.
10. El usuario puede volver a `Más` con navegación nativa.

## Screens

### NotificationsScreen

Pantalla principal de notificaciones accesible desde `Más`.

Debe mostrar al menos:

* encabezado claro
* botón nativo de regreso
* estado actual de permisos
* estado del dispositivo registrado
* preferencias agrupadas
* feedback visual si falla la carga o actualización

Secciones mínimas recomendadas:

* `Estado de permisos`
* `Estado del dispositivo`
* `Recordatorios y avisos`
* `Preferencias`

Opciones mínimas recomendadas para esta iteración:

* `Permitir notificaciones`
  Refleja el estado actual del permiso del dispositivo.
* `Estado del dispositivo`
  Debe indicar si existe token / registro válido.
* `Recordatorios de próximos cuidados`
  Preferencia real conectada al producto.
* `Medicaciones y tratamientos`
  Preferencia real para eventos y cuidados programados.
* `Vacunas y controles`
  Preferencia real para próximos hitos clínicos.
* `Alertas importantes`
  Preferencia para cambios sensibles o eventos relevantes.
* `Resumen diario`
  Puede entrar como preferencia si se decide para MVP, aunque su entrega visible al usuario quede para iteración posterior.

## States

### NotificationsLoading

La pantalla está resolviendo permisos, preferencias y registro del dispositivo.

### NotificationsReady

La pantalla puede renderizar opciones y aceptar interacción.

### NotificationsUpdating

Se está guardando una preferencia o actualizando el registro del dispositivo.

### NotificationsPermissionDenied

El usuario no ha concedido permisos y debe mostrarse guía clara.

### NotificationsRegistrationPending

Existe permiso, pero el dispositivo/token aún no quedó correctamente registrado.

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
* no debe marcarse el dispositivo como listo si el token no pudo registrarse

### Persistence Rules

* las preferencias visibles deben persistirse realmente
* el token del dispositivo debe registrarse de forma segura
* una actualización fallida no debe dejar el estado ambiguo
* si una preferencia depende de permiso del sistema, eso debe reflejarse visualmente

### Product Rules

* las preferencias deben mapearse a categorías comprensibles para el owner
* la arquitectura debe quedar lista para disparar avisos desde `care_events`
* la feature debe servir tanto para recordatorios locales como para futura push remota

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

### Registration Error

Si falla registrar el dispositivo o token:

* debe mostrarse feedback claro
* el usuario debe poder reintentar
* la pantalla debe distinguir entre permiso concedido y registro incompleto

## Services

### Notifications Service

Responsabilidad:

* leer y persistir preferencias reales de notificaciones
* abstraer permisos del dispositivo
* registrar token/dispositivo
* exponer helpers para programación base de recordatorios

Métodos esperados:

* `getNotificationSettings()`
* `updateNotificationSetting(key, value)`
* `getNotificationPermissionStatus()`
* `requestNotificationPermission()`
* `registerNotificationDevice()`
* `syncNotificationPreferences()`
* `scheduleLocalReminder()` si se decide cubrir recordatorios locales en esta HU

### Event / Care Integration

La HU debe contemplar integración con:

* `care_events`
* futuros eventos tipo vacuna, medicación, consulta o desparasitación

### Supabase

Debe contemplarse persistencia real para:

* preferencias del usuario
* dispositivos registrados
* token push si aplica en esta iteración

## Store

La pantalla puede manejar localmente:

* loading
* errores
* toggles
* estado del permiso
* estado de registro del dispositivo

Si el token o preferencias deben consumirse de forma transversal, puede evaluarse store dedicado en `notifications`.

## Tests

### Hook Tests

* debe cargar el estado inicial de permisos, preferencias y registro
* debe manejar loading
* debe manejar error de carga
* debe actualizar una preferencia editable
* debe manejar permiso denegado
* debe manejar registro incompleto del dispositivo

### Service Tests

* debe devolver preferencias iniciales reales
* debe persistir una preferencia
* debe registrar dispositivo/token
* debe mapear errores de lectura/escritura
* debe mapear errores de permisos o registro

### Integration Tests

* debe preparar recordatorios a partir de eventos elegibles
* debe ignorar eventos no configurados para notificación si corresponde

### Screen Tests

* debe renderizar encabezado y grupos
* debe mostrar estado del permiso
* debe mostrar estado del registro del dispositivo
* debe mostrar retry en error
* debe permitir volver a `Más`

## Acceptance Criteria

* Existe una pantalla real de `Notificaciones` accesible desde `Más`.
* La pantalla muestra claramente si el permiso del dispositivo está concedido o no.
* La pantalla muestra claramente si el dispositivo quedó correctamente registrado.
* Las preferencias base visibles del MVP pueden persistirse realmente.
* La arquitectura queda lista para conectar y disparar recordatorios de cuidados/eventos.
* La pantalla contempla loading, error y retry.
* El usuario puede volver a `Más` con navegación nativa.
* La lógica reside en screen + hook + service y no en el route file.
