# Care Profile

## Goal

Permitir que un usuario autenticado visualice un perfil de cuidado completo de su mascota activa desde el `Home`.

Esta HU no debe duplicar el flujo de edición de mascota ya existente.

Su objetivo es construir una ficha de cuidado orientada a consulta, seguimiento y compartición, compuesta por:

* perfil base de la mascota
* resumen de vacunas
* última visita médica registrada
* datos clínicos relevantes visibles
* acción para compartir el perfil

La edición de datos base debe resolverse como una acción secundaria que reutiliza el flujo ya existente de `Editar mascota`.

## User Flow

1. El usuario autenticado entra al `Home`.
2. El usuario toca la card `Perfil de cuidado`.
3. El sistema abre la pantalla de perfil de cuidado para la mascota activa.
4. La pantalla carga:
   * datos base de la mascota
   * resumen de vacunas
   * última visita médica disponible
   * información clínica relevante
5. El usuario revisa el perfil como una ficha resumida de salud y cuidado.
6. Si necesita cambiar datos base, toca una acción de editar y navega al flujo existente de edición de mascota.
7. Si desea compartir el perfil, toca `Compartir`.
8. El sistema genera una representación compartible del perfil y abre el share sheet nativo.

## Screens

### CareProfileScreen

Pantalla principal de resumen de cuidado.

Debe mostrar:

* foto y nombre de la mascota activa
* tipo, raza, edad o fecha de nacimiento y peso
* alergias
* condiciones médicas
* resumen de vacunas
* última visita médica registrada
* CTA para editar perfil base
* CTA para compartir perfil

La pantalla debe sentirse como una ficha o tarjeta de salud de la mascota, no como un formulario.

### Share Care Profile Action

La acción de compartir puede resolverse desde la misma pantalla con el share sheet nativo del sistema.

Debe permitir compartir al menos:

* texto formateado del perfil
* resumen apto para WhatsApp
* resumen apto para RRSS o apps compatibles con el share sheet

No forma parte de esta HU generar una imagen renderizada del perfil, a menos que se defina explícitamente en `PLAN`.

## States

### CareProfileLoading

La pantalla está cargando la información de la mascota activa y sus bloques de cuidado.

### CareProfileReady

La información está disponible y el usuario puede consultarla o compartirla.

### CareProfileEmpty

No existe mascota activa disponible o no hay datos suficientes para construir el perfil.

La UI debe mostrar estado recuperable y CTA para ir a `Mascotas`.

### CareProfilePartial

La mascota existe, pero una o más secciones del perfil aún no tienen datos.

Ejemplos:

* no hay vacunas registradas
* no hay visitas médicas registradas
* faltan alergias o condiciones

La pantalla debe seguir siendo útil y mostrar placeholders claros por sección.

### CareProfileSharing

El sistema está preparando el contenido para compartir.

### CareProfileError

Falló la carga o la preparación del contenido compartible y la UI debe mostrar feedback recuperable.

## Validations

### Data Composition Rules

El perfil de cuidado debe construirse a partir de información consistente de la mascota activa.

Reglas:

* la mascota debe pertenecer al usuario autenticado
* la foto puede ser opcional visualmente, pero la pantalla debe renderizarse correctamente con o sin ella
* si no existe información de vacunas, la sección debe indicarlo explícitamente
* si no existe última visita médica, la sección debe indicarlo explícitamente
* alergias y condiciones médicas no deben mostrar strings vacíos
* los datos compartidos no deben incluir valores `null`, `undefined` o placeholders técnicos

### Share Rules

* no debe compartirse información de una mascota distinta a la activa o seleccionada
* el contenido compartido debe usar etiquetas legibles para usuario final
* el contenido debe poder compartirse aunque falten algunas secciones
* si una sección no tiene datos, debe omitirse o mostrarse como “Sin registros” según la UX definida en implementación

## Error Handling

### Load Error

Si falla la carga inicial del perfil:

* la pantalla debe mostrar error claro
* debe existir acción de retry
* no debe romper el shell autenticado

### Section Error

Si falla una sección secundaria, como vacunas o última visita:

* el resto del perfil debe seguir mostrándose si está disponible
* la sección fallida debe mostrar estado recuperable
* debe existir retry por pantalla o por sección, según implementación

### Share Error

Si falla la generación del contenido compartible:

* la pantalla debe permanecer estable
* debe mostrarse un mensaje claro
* el usuario debe poder reintentar compartir

### Missing Active Pet

Si la navegación entra a perfil de cuidado sin mascota activa válida:

* debe mostrarse estado vacío o error recuperable
* debe existir CTA para ir a `Mascotas`

## Services

### Pet Service

Debe reutilizar `pets` como fuente de verdad para el perfil base.

Métodos relevantes:

* `getUserPets(ownerId)`
* acceso al `activePetId` desde store

### Vaccination Summary Service

Debe exponer un resumen de vacunas para la mascota activa.

En esta HU puede resolverse como:

* servicio mock-first
* adaptador temporal
* lectura de `care_events` si ya existe esa capa

Debe permitir mostrar:

* si existen vacunas registradas
* vacunas destacadas o recientes
* estado vacío cuando no existan registros

### Medical Visit Summary Service

Debe exponer la última visita médica registrada de la mascota.

En esta HU puede resolverse como:

* servicio mock-first
* adaptador temporal
* lectura de `care_events` o registros equivalentes cuando existan

Debe permitir mostrar:

* fecha de la última visita
* título o motivo principal
* estado vacío cuando no existan registros

### Share Service

Debe construir el contenido compartible del perfil de cuidado.

Responsabilidades:

* transformar los datos del perfil a un texto legible
* omitir datos vacíos o inválidos
* delegar al share sheet nativo

## Store

### Pet Store

Debe seguir siendo la fuente compartida para:

* `pets`
* `activePetId`
* hidratación y refresco de la mascota activa

### Care Profile Local State

La pantalla puede manejar localmente:

* loading de secciones
* errores por bloque
* estado de share
* datos derivados para la vista

No debe duplicar en store global el perfil completo si puede derivarse de servicios + `Pet Store`.

## Tests

### Service Tests

* debe construir correctamente el resumen compartible del perfil
* debe omitir valores vacíos del contenido a compartir
* debe mapear correctamente estados vacíos de vacunas
* debe mapear correctamente estados vacíos de última visita médica

### Hook Tests

* debe cargar la mascota activa y construir el perfil de cuidado
* debe exponer estados parciales cuando falten vacunas o visitas
* debe permitir navegar a edición de mascota
* debe preparar el contenido para compartir
* debe exponer retry cuando falle la carga

### Screen Tests

* debe renderizar los bloques principales del perfil de cuidado
* debe mostrar loading, empty, partial y ready
* debe renderizar CTA de editar perfil base
* debe renderizar CTA de compartir
* debe mostrar resumen de vacunas
* debe mostrar última visita médica o estado vacío

## Acceptance Criteria

* El usuario puede abrir `Perfil de cuidado` desde el `Home`
* La pantalla carga la mascota activa real
* La pantalla muestra perfil base de la mascota sin duplicar el formulario de edición
* Debe existir un resumen de vacunas visible
* Debe existir una sección de última visita médica visible
* Si faltan vacunas o visitas médicas, la pantalla sigue funcionando con estados vacíos claros
* El usuario puede ir desde esta pantalla al flujo existente de `Editar mascota`
* El usuario puede compartir el perfil mediante el share sheet nativo
* El contenido compartido debe ser legible y apto para WhatsApp y otras apps compatibles
* Si falla la carga o el share, la UI muestra error recuperable sin romper navegación ni estado de mascota activa
