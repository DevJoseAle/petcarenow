# Settings

## Goal

Permitir que el usuario autenticado gestione desde `Más` las configuraciones base de la aplicación en una pantalla real, clara y segura.

Esta HU debe cerrar la primera opción pendiente de `Más`, cubriendo preferencias de cuenta y de experiencia de uso que no dependen de módulos premium ni de configuración avanzada del sistema operativo.

En esta primera iteración, `Configuración` debe funcionar como hub editable para:

* preferencias generales de la app
* accesos clave de cuenta ya disponibles
* navegación estable dentro del área autenticada

No forma parte de esta HU implementar todavía:

* notificaciones avanzadas
* suscripción / premium
* ayuda
* términos y privacidad

Eso quedará en HUs separadas dentro del sprint de cierre de `Más`.

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. El usuario toca `Configuración`.
3. El sistema navega a una pantalla real de `Configuración`.
4. La pantalla carga el estado inicial de las preferencias disponibles.
5. El usuario puede revisar y modificar preferencias locales o persistidas según el tipo de ajuste.
6. Si el usuario cambia una preferencia, la UI debe reflejar el cambio de forma inmediata o luego de guardar, según la decisión de implementación.
7. Si una subsección aún no está disponible, debe indicarse como `Próximamente` de forma consistente.
8. El usuario puede volver a `Más` con navegación nativa sin perder estabilidad en el shell.

## Screens

### SettingsScreen

Pantalla principal de configuración accesible desde `Más`.

Debe mostrar al menos:

* encabezado claro
* botón nativo de regreso
* secciones agrupadas de configuración
* opciones activas y útiles
* feedback visual si falla la carga o guardado

Secciones sugeridas para esta HU:

* `Cuenta y app`
* `Experiencia`

Opciones mínimas recomendadas para esta iteración:

* `Editar perfil`
  Navega al perfil de usuario ya existente.
* `Mascota activa`
  Muestra contexto de la mascota activa o acceso rápido a `Mascotas`.
* `Tema`
  Si no se implementa control real todavía, debe quedar preparado como opción visible con estado controlado.
* `Idioma`
  Si aún no existe i18n real, debe quedar como placeholder funcional o selector estático no engañoso.

## States

### SettingsLoading

La pantalla está resolviendo el estado inicial de configuración.

### SettingsReady

La pantalla ya puede renderizar opciones y aceptar interacción.

### SettingsUpdating

Se está persistiendo una preferencia editable.

### SettingsError

Falló la carga o guardado de configuración y debe mostrarse feedback recuperable.

## Validations

### Navigation Rules

* `Configuración` debe navegar a una pantalla real, no a un placeholder vacío.
* las opciones activas deben tener comportamiento explícito
* el botón back debe regresar a `Más`

### Persistence Rules

* una preferencia editable no debe dejar el estado inconsistente entre UI y almacenamiento
* si una opción es solo visual por ahora, no debe fingir persistencia real
* la pantalla debe sentirse parte del ecosistema de `Más`
* las opciones deben estar agrupadas de forma comprensible
* no debe haber opciones sin respuesta al toque

## Error Handling

### Load Error

Si falla la carga inicial:

* la pantalla debe mostrar error claro
* debe existir retry
* no debe romper el shell autenticado

### Update Error

Si falla la actualización de una preferencia:

* la UI debe informar el fallo
* el usuario debe poder reintentar
* el estado visual no debe quedar ambiguo

## Services

### Settings Service

Responsabilidad:

* resolver preferencias que deban leerse o persistirse
* abstraer almacenamiento local o remoto según corresponda

Métodos esperados según implementación:

* `getSettings()`
* `updateSetting(key, value)`

Nota:

Si esta primera HU no persiste todavía preferencias reales, el service puede quedar mínimo o incluso delegar a un store/hook con contrato explícito, pero la decisión debe quedar documentada en `PLAN`.

### Profile Service

Debe reutilizarse para accesos ya existentes como:

* `getProfileById(ownerId)`

### Pet Store / Pet Service

Puede reutilizarse para mostrar contexto de mascota activa o navegación a `Mascotas`.

## Store

### Auth Store

Debe seguir siendo la fuente del usuario autenticado actual.

### More / Settings Local State

La pantalla puede manejar localmente:

* loading
* errores
* estado de toggles o selectores
* feedback de opciones futuras

Si una preferencia necesita compartirse globalmente, recién ahí debe evaluarse store dedicado.

## Tests

### Hook Tests

* debe cargar las opciones iniciales
* debe exponer estado loading
* debe manejar errores de carga
* debe actualizar una preferencia editable

### Service Tests

* debe devolver configuración inicial si existe persistencia real
* debe persistir una preferencia editable
* debe mapear errores de lectura o escritura

### Screen Tests

* debe renderizar encabezado y grupos de configuración
* debe navegar al perfil cuando corresponda
* debe mostrar error con retry si falla la carga
* debe permitir volver a `Más`

## Acceptance Criteria

* Existe una pantalla real de `Configuración` accesible desde `Más`.
* La pantalla usa navegación consistente con el shell autenticado.
* La pantalla muestra opciones agrupadas y comprensibles.
* Las opciones activas tienen comportamiento explícito.
* El usuario puede volver a `Más` con navegación nativa.
* La pantalla contempla loading, error y retry.
* La lógica visual reside en screen + hook y no en el route file.
* Cualquier persistencia usada por esta HU queda encapsulada fuera de la screen.

## Status

`Cerrada`

Implementado en:

* pantalla real de `Configuración`
* navegación desde `Más`
* edición local de idioma preferido
* acceso a perfil de usuario
* acceso a contexto de mascota activa
* manejo de loading, error y retry
