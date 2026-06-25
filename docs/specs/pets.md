# Pets

## Goal

Permitir que un usuario autenticado gestione sus mascotas registradas desde la app una vez completado el onboarding inicial.

Esta HU debe cerrar el flujo base de mascotas dentro del shell autenticado:

* listar mascotas del usuario
* seleccionar mascota activa
* agregar una mascota adicional
* editar una mascota existente
* eliminar una mascota con confirmación

El objetivo no es rediseñar el onboarding inicial, sino reutilizar y extender la lógica existente para soportar gestión continua de mascotas.

## User Flow

1. El usuario autenticado entra al tab `Mascotas`.
2. El sistema carga todas las mascotas asociadas al usuario.
3. El usuario visualiza:
   * la mascota activa
   * el resto de mascotas registradas
   * una acción para agregar nueva mascota
4. Si el usuario toca una mascota distinta, esa mascota pasa a ser la activa.
5. Si el usuario toca agregar mascota, entra a un flujo de creación reutilizando la base del formulario ya existente.
6. Si el usuario toca editar una mascota, entra al formulario con los datos precargados.
7. Si el usuario guarda cambios, el listado y la mascota activa se refrescan.
8. Si el usuario elimina una mascota, el sistema pide confirmación antes de borrar.
9. Si la mascota eliminada era la activa:
   * si quedan más mascotas, el sistema selecciona otra automáticamente
   * si no queda ninguna, el sistema redirige al flujo de `pet-onboarding`

## Screens

### PetsScreen

Pantalla principal del tab `Mascotas`.

Debe mostrar:

* listado de mascotas del usuario
* estado visual de mascota activa
* CTA para cambiar mascota activa
* CTA para agregar mascota
* acceso a editar cada mascota
* acceso a eliminar cada mascota

### PetDetailScreen

Pantalla de creación y edición de mascota.

Debe soportar dos modos:

* `create`
* `edit`

Responsabilidades:

* renderizar el formulario de mascota
* precargar datos en modo edición
* permitir actualizar foto, nombre, tipo, sexo, raza, fecha, peso, alergias y condiciones médicas
* guardar cambios o crear nueva mascota

### Delete Pet Confirmation

La confirmación de borrado puede resolverse con alert/modal nativo.

Debe:

* mostrar qué mascota se eliminará
* advertir que la acción no se puede deshacer
* ofrecer cancelar o confirmar

## States

### PetsLoading

La lista de mascotas aún se está cargando.

### PetsReady

El listado está disponible y el usuario puede interactuar.

### EmptyPets

No existen mascotas registradas.

Este estado normalmente debe redirigir a `pet-onboarding`, pero puede mostrarse brevemente mientras se resuelve la navegación.

### SelectingActivePet

El usuario cambió la mascota activa y el store está actualizando el estado compartido.

### PetFormCreate

El formulario está en modo creación.

### PetFormEdit

El formulario está en modo edición con datos precargados.

### PetFormInvalid

El formulario contiene errores y no debe permitir guardar.

### PetSubmitting

La mascota se está creando o actualizando.

### PetDeleting

La mascota se está eliminando luego de confirmar.

### PetsError

Falló la carga, creación, edición o eliminación y la UI debe mostrar feedback recuperable.

## Validations

### Required Fields

Todos los campos principales del perfil deben ser obligatorios para creación y edición:

* `name`
* `pet_type`
* `gender`
* `breed`
* `birth_date`
* `weight_kg`
* `photo_url` local o remota visible en UI
* `allergies`
* `medical_conditions`

### Data Rules

* `name` no puede enviarse vacío
* `name` debe guardarse sin espacios accidentales al inicio o final
* `birth_date` no puede ser futura
* `weight_kg` debe ser un número válido mayor que 0
* `breed` debe corresponder al tipo de mascota seleccionado o a una opción libre válida cuando aplique
* `allergies` no debe contener strings vacíos
* `medical_conditions` no debe contener strings vacíos

### Selection Rules

* La mascota activa debe pertenecer al usuario autenticado
* Si existe una sola mascota, debe quedar activa automáticamente
* Si se crea una nueva mascota, debe evaluarse si pasa a ser la activa según la UX definida en implementación
* Si se elimina la mascota activa y quedan otras, debe seleccionarse una nueva automáticamente

### Delete Rules

* No debe eliminarse una mascota sin confirmación explícita
* El usuario solo puede eliminar mascotas propias

## Error Handling

### Pets Load Error

Si falla la carga inicial:

* la pantalla debe mostrar error recuperable
* debe existir acción de retry
* no debe romperse el shell autenticado

### Create Pet Error

Si falla la creación:

* el usuario debe permanecer en el formulario
* los datos ingresados no deben perderse
* debe mostrarse un mensaje claro

### Edit Pet Error

Si falla la edición:

* el usuario debe permanecer en el formulario
* debe poder reintentar
* no debe perderse el contexto de la mascota editada

### Delete Pet Error

Si falla la eliminación:

* la mascota debe seguir visible
* debe mostrarse feedback claro
* el usuario debe poder reintentar

### Active Pet Sync Error

Si falla la sincronización del listado después de crear, editar o eliminar:

* el store no debe quedar en estado inconsistente
* debe existir forma de refrescar mascotas

## Services

### Pet Service

Debe soportar:

* listar mascotas del usuario
* crear mascota adicional
* actualizar mascota existente
* eliminar mascota

Métodos esperados:

* `getUserPets(ownerId)`
* `createPet(payload)`
* `updatePet(petId, payload)`
* `deletePet(petId)`
* `hasRegisteredPets(ownerId)`

Notas:

* `owner_id` debe salir de la sesión autenticada actual
* la subida de foto a Supabase Storage ya debe integrarse con el flujo existente
* `photo_url` final debe persistirse en `pets.photo_url`

## Store

### Pet Store

Debe ser la fuente compartida para gestión de mascotas dentro del shell autenticado.

Estado esperado:

* `pets`
* `activePetId`
* `isHydrating`
* `generalError`

Acciones esperadas:

* `hydratePets(ownerId)`
* `refreshPets(ownerId)`
* `selectPet(petId)`
* `upsertPet(pet)`
* `removePet(petId)`
* `reset()`

### Auth Store

Sigue siendo la fuente de `ownerId` y sesión autenticada.

## Tests

### Service Tests

* debe listar mascotas del usuario autenticado
* debe crear mascota con payload válido
* debe actualizar mascota existente
* debe eliminar mascota propia
* debe mapear errores de backend y errores inesperados

### Store Tests

* debe hidratar mascotas correctamente
* debe seleccionar mascota activa
* debe refrescar el listado después de crear o editar
* debe remover mascota y resolver nueva activa

### Hook Tests

* debe cargar listado al entrar a `PetsScreen`
* debe exponer CTA de agregar mascota
* debe precargar datos en modo edición
* debe bloquear guardado cuando el formulario es inválido
* debe manejar confirmación de eliminación

### Screen Tests

* debe renderizar la lista de mascotas
* debe mostrar cuál mascota está activa
* debe navegar a crear mascota
* debe navegar a editar mascota
* debe mostrar confirmación antes de eliminar

## Acceptance Criteria

* El usuario autenticado debe poder ver todas sus mascotas en el tab `Mascotas`.
* El usuario debe poder identificar cuál es su mascota activa.
* El usuario debe poder cambiar la mascota activa desde la UI.
* El usuario debe poder agregar una mascota adicional.
* El usuario debe poder editar una mascota existente con datos precargados.
* El usuario debe poder eliminar una mascota solo después de confirmar la acción.
* Si se elimina la mascota activa y quedan otras, otra mascota debe pasar a ser la activa automáticamente.
* Si se elimina la última mascota del usuario, el flujo debe volver a `pet-onboarding`.
* El sistema no debe permitir guardar datos inválidos.
* La lista y el estado de mascota activa deben refrescarse después de crear, editar o eliminar.
