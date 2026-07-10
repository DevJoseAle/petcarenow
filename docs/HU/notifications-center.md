# Notifications Center

## Goal

Permitir que el usuario autenticado consulte un centro de notificaciones dentro de la app, con historial claro, navegación útil y contexto suficiente para entender qué ocurrió y qué acción puede tomar.

Esta HU se apoya sobre `Notifications Core`, por lo que asume que permisos, token, preferencias y generación de avisos ya existen o están encaminados.

## User Flow

1. El usuario autenticado entra a `Notificaciones`.
2. Desde allí accede al centro o historial de notificaciones.
3. El sistema lista notificaciones recientes relevantes para su mascota.
4. El usuario puede distinguir tipo, fecha y estado.
5. El usuario puede abrir una notificación y navegar a la entidad asociada cuando aplique.
6. El usuario puede marcar como leída o gestionar el estado si esa acción forma parte de la iteración.

## Screens

### NotificationsInboxScreen

Debe mostrar:

* listado cronológico
* empty state
* filtro simple por tipo o estado si se justifica
* acceso al detalle o deep link interno

### NotificationDetailScreen

Opcional según implementación inicial.

Si existe, debe mostrar:

* título
* mensaje
* tipo
* fecha
* CTA de navegación al origen relacionado

## States

### NotificationsInboxLoading

### NotificationsInboxReady

### NotificationsInboxEmpty

### NotificationsInboxError

## Validations

* no deben mostrarse notificaciones de otro usuario
* una notificación debe tener tipo y fecha comprensibles
* si existe navegación asociada, debe ser explícita y estable

## Error Handling

* retry en error de carga
* no romper navegación al abrir una notificación sin destino disponible

## Services

### Notifications Inbox Service

Métodos esperados:

* `listNotifications(ownerId)`
* `markNotificationAsRead(id)` si aplica
* `getNotificationById(id)` si hay detalle

## Store

Puede manejarse con estado local en una primera iteración.

## Tests

* listado de notificaciones
* empty state
* navegación al destino relacionado
* manejo de errores

## Acceptance Criteria

* Existe una pantalla real para consultar notificaciones recibidas.
* El usuario puede entender qué pasó y cuándo.
* Las notificaciones se relacionan con el contexto real del producto cuando corresponda.
