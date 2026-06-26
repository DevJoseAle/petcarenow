# Records

## Goal

Permitir que un usuario autenticado consulte y gestione el historial de registros de su mascota activa desde una pantalla dedicada de `Registros`.

Esta HU debe consolidar el concepto de historial de cuidado y salud ya ocurrido, separándolo claramente del calendario de cuidados futuros.

El objetivo es que `pet_records` sea la fuente de verdad para:

* peso registrado
* síntoma observado
* medicación administrada
* nota libre

No forma parte de esta HU mostrar eventos futuros o programados, ya que eso pertenece a `care_events` y al tab de `Calendario`.

## User Flow

1. El usuario autenticado entra al tab `Registros`.
2. El sistema carga los registros de la mascota activa.
3. El usuario visualiza el historial en orden cronológico descendente.
4. El usuario puede identificar rápidamente el tipo de registro y su fecha/hora.
5. Si el usuario quiere agregar un nuevo registro, puede usar:
   * el modal de acciones rápidas
   * un CTA dentro de la pantalla de `Registros`
6. Al volver desde crear un registro, el listado debe refrescarse automáticamente.
7. El usuario puede abrir el detalle de un registro.
8. Desde el detalle, el usuario puede revisar la información completa y, si se define en implementación, editar o eliminar el registro.

## Screens

### RecordsScreen

Pantalla principal del historial de registros.

Debe mostrar:

* listado de registros de la mascota activa
* filtro visual o contextual por tipo si se considera útil
* CTA para agregar registro
* pull to refresh
* estados de loading, vacío y error

La pantalla debe representar hechos ocurridos, no agenda futura.

### RecordEntryScreen

Pantalla de creación de registros.

Debe soportar crear:

* `weight`
* `symptom`
* `medication`
* `note`

Debe incluir:

* selector de tipo
* fecha
* hora
* descripción
* peso cuando el tipo sea `weight`
* navegación clara para volver

### RecordDetailScreen

Pantalla de detalle de un registro individual.

Debe mostrar:

* tipo de registro
* fecha y hora
* descripción completa
* valor numérico y unidad cuando aplique

Puede incluir:

* CTA para editar
* CTA para eliminar

La decisión de soportar edición completa en esta HU se valida en `PLAN`.

## States

### RecordsLoading

El historial se está cargando.

### RecordsReady

El historial está disponible y es interactivo.

### RecordsEmpty

No existen registros todavía para la mascota activa.

La UI debe mostrar un mensaje claro y CTA para crear el primer registro.

### RecordsRefreshing

El usuario está haciendo pull to refresh o la pantalla se refresca al recuperar foco.

### RecordFormCreate

El formulario está en modo creación.

### RecordFormInvalid

El formulario contiene errores y no debe guardarse.

### RecordSubmitting

El registro se está creando.

### RecordDetailLoading

Se está cargando el detalle del registro.

### RecordDeleting

Se está eliminando un registro.

### RecordsError

Falló la carga, creación, consulta o eliminación y la UI debe mostrar feedback recuperable.

## Validations

### Required Fields

Todos los registros deben requerir:

* `record_type`
* `recorded_at`
* `description`

Además:

* `weight` requiere `value_numeric`
* `weight` requiere `value_unit = 'kg'`

### Data Rules

* `description` no puede enviarse vacía
* `description` debe guardarse sin espacios accidentales al inicio o final
* `recorded_at` debe construirse combinando fecha y hora válidas
* `weight` debe ser un número válido mayor que 0
* la hora debe respetar formato `HH:mm`
* los registros pueden pertenecer al pasado o al presente
* esta HU no debe forzar la lógica de “futuro” porque eso pertenece a `care_events`

### Ownership Rules

* el registro debe pertenecer al usuario autenticado
* el registro debe pertenecer a la mascota activa o a una mascota seleccionada explícitamente
* el usuario solo puede ver o modificar registros propios

## Error Handling

### Records Load Error

Si falla la carga del listado:

* la pantalla debe mostrar error claro
* debe existir retry
* no debe romper el shell autenticado

### Record Create Error

Si falla la creación:

* el usuario debe permanecer en el formulario
* los datos ingresados no deben perderse
* debe mostrarse un mensaje claro
* debe poder reintentar

### Record Detail Error

Si falla la carga del detalle:

* la pantalla debe mostrar error recuperable
* debe existir retry

### Record Delete Error

Si falla la eliminación:

* el registro debe seguir visible
* debe mostrarse feedback claro
* el usuario debe poder reintentar

## Services

### Record Service

Debe usar `pet_records` como fuente de verdad.

Métodos esperados:

* `listPetRecords(ownerId, petId?)`
* `createPetRecord(payload)`
* `getPetRecordById(ownerId, recordId)`
* `updatePetRecord(recordId, payload)` si se implementa edición en esta HU
* `deletePetRecord(ownerId, recordId)` si se implementa eliminación en esta HU

Notas:

* `recorded_at` debe persistirse como `timestamptz`
* `weight` debe guardarse con `value_numeric` y `value_unit = 'kg'`
* `symptom`, `medication` y `note` deben depender principalmente de `description`

## Store

### Pet Store

Debe seguir siendo la fuente para resolver la mascota activa.

Estado relevante:

* `pets`
* `activePetId`

### Records Local State

La HU puede manejar localmente:

* loading del listado
* refreshing
* loading del detalle
* estado del formulario
* errores del flujo

No necesita store global nuevo salvo que se justifique en `PLAN`.

## Tests

### Service Tests

* debe listar registros del usuario y mascota correcta
* debe crear registro válido
* debe obtener detalle por id
* debe eliminar registro propio si esa acción entra en la HU
* debe mapear errores de backend y errores inesperados

### Hook Tests

* debe cargar registros al abrir la pantalla
* debe refrescar al volver a foco
* debe soportar pull to refresh
* debe validar formulario de registro
* debe crear registro válido
* debe mantener datos del formulario si falla el guardado
* debe cargar detalle del registro

### Screen Tests

* debe renderizar listado de registros
* debe mostrar estados `loading`, `empty`, `error`
* debe mostrar CTA para agregar registro
* debe navegar al detalle del registro
* debe renderizar el formulario con campos esperados

## Acceptance Criteria

* Debe existir una pantalla dedicada de `Registros`
* La pantalla debe listar registros históricos de la mascota activa
* `Registros` y `Calendario` deben quedar conceptualmente separados
* Crear peso, síntoma, medicación y nota debe persistir en `pet_records`
* Al volver desde crear registro, el listado debe refrescarse automáticamente
* La pantalla debe soportar pull to refresh
* Debe existir pantalla de detalle de registro
* La UI debe mostrar errores recuperables sin romper navegación ni estado de mascota activa
