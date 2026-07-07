# Pet Onboarding

## User Story

Como usuario autenticado que aún no ha registrado una mascota, quiero completar un onboarding simple después del login para ingresar los datos principales de mi mascota y poder usar la app con información relevante desde el inicio.

## Goal

Permitir que un usuario autenticado registre su primera mascota mediante un flujo guiado post-login cuando no tenga mascotas creadas.

El objetivo del onboarding es capturar la información mínima y útil del modelo `Pet`, priorizando una experiencia clara, progresiva y móvil.

## User Flow

1. El usuario inicia sesión correctamente.
2. El sistema verifica si el usuario ya tiene al menos una mascota registrada.
3. Si no tiene mascotas, el sistema redirige al onboarding de mascota antes de entrar al Home principal.
4. El usuario completa un flujo paso a paso con los datos de su mascota.
5. El usuario puede avanzar entre pasos y revisar la información ingresada.
6. En el último paso, el usuario confirma y guarda la mascota.
7. Si el guardado es exitoso, el sistema marca el onboarding de mascota como completo y redirige al área principal autenticada.
8. Si el usuario ya tiene mascota registrada, el onboarding no debe mostrarse.

## Screens

### PetOnboardingScreen

Pantalla principal del flujo post-login para registrar la primera mascota.

Responsabilidades:

* Mostrar pasos progresivos del formulario
* Renderizar campos según el paso actual
* Mostrar avance visual del onboarding
* Permitir avanzar y volver entre pasos cuando corresponda
* Confirmar el guardado final

Contenido esperado por pasos:

* Paso 1: nombre de la mascota y tipo de mascota
* Paso 2: sexo y raza
* Paso 3: fecha de nacimiento o edad, y peso
* Paso 4: foto opcional, alergias y condiciones médicas
* Paso 5: resumen y confirmación

## States

### CheckingPetStatus

El sistema está validando si el usuario autenticado ya tiene mascotas registradas.

### Initial

El onboarding se presenta en el primer paso con el formulario vacío o con valores iniciales.

### Editing

El usuario está completando o corrigiendo datos de la mascota.

### Invalid

El paso actual contiene errores de validación y no debe permitir avanzar o guardar.

### Reviewing

El usuario está en el paso final revisando la información antes de guardar.

### Submitting

El sistema está guardando la mascota en backend. No debe permitir envíos duplicados.

### Success

La mascota fue creada correctamente y el usuario es redirigido al flujo autenticado principal.

### Error

El guardado falla y la pantalla muestra feedback claro permitiendo reintento.

## Validations

### Required Fields

* `name` es obligatorio
* `petType` es obligatorio

### Conditional Fields

* `breed` puede ser seleccionable según `petType`
* Si `petType` es `dog`, la lista de razas debe usar `DogBreed`
* Si `petType` es `cat`, la lista de razas debe usar `CatBreed`
* Para otros tipos, la raza puede ser texto libre o valor genérico según definición final del diseño

### Optional Fields

* `gender` es opcional
* `birthDate` es opcional
* `ageYears` es opcional
* `weightKg` es opcional
* `photoURL` es opcional
* `allergies` es opcional
* `medicalConditions` es opcional

### Data Rules

* `name` no debe enviarse vacío
* `name` debe ignorar espacios accidentales al inicio y al final
* `weightKg`, si se ingresa, debe ser un número válido y mayor que 0
* `ageYears`, si se ingresa, debe ser un entero válido y no negativo
* `birthDate`, si se ingresa, no puede ser una fecha futura
* Si se usa lista de alergias o condiciones, no deben guardarse strings vacíos

## Error Handling

### Pet Status Check Error

Si falla la consulta inicial para saber si el usuario ya tiene mascotas, el sistema debe mostrar un estado de error recuperable o un retry antes de entrar al flujo.

### Validation Error

Si faltan datos requeridos o algún valor es inválido, el paso actual debe mostrar errores claros y evitar continuar.

### Save Error

Si falla la creación de la mascota, el usuario debe permanecer en el onboarding, ver un mensaje claro y poder reintentar.

### Unexpected Error

Cualquier error no previsto debe mostrarse con un mensaje genérico sin exponer detalles internos.

## Services

### Pet Service

Responsabilidades:

* Consultar si el usuario actual ya tiene mascotas registradas
* Crear la primera mascota del usuario
* Normalizar errores de backend para uso en UI

Métodos esperados:

* `getUserPets(ownerId)`
* `hasRegisteredPets(ownerId)`
* `createPet(payload)`

Notas:

* `createdAt`, `updatedAt` e `id` idealmente deben resolverse desde backend
* `ownerId` debe salir de la sesión autenticada actual
* `isActive` debe guardarse como `true` al crear la primera mascota salvo regla distinta del negocio

## Store

### Auth Store

Debe seguir siendo la fuente del usuario autenticado actual para obtener `ownerId`.

### Pet Onboarding Local State

El estado del formulario debe vivir en el hook del onboarding mientras el usuario completa los pasos.

Estado local esperado:

* `currentStep`
* `name`
* `petType`
* `gender`
* `breed`
* `birthDate`
* `ageYears`
* `weightKg`
* `photoURL`
* `allergies`
* `medicalConditions`
* `errors`
* `isSubmitting`
* `generalError`

### Optional Store

Si luego se necesita persistencia temporal del formulario entre reinicios o navegación, eso puede evaluarse después. No es obligatorio para el primer alcance.

## Tests

### Hook Tests

* Debe iniciar en el primer paso
* Debe actualizar campos correctamente
* Debe validar datos requeridos por paso
* Debe impedir avanzar si el paso actual es inválido
* Debe avanzar y retroceder entre pasos cuando corresponda
* Debe guardar correctamente en el último paso
* Debe exponer error general si falla la creación

### Service Tests

* Debe consultar mascotas del usuario autenticado
* Debe detectar correctamente si el usuario tiene o no mascotas
* Debe crear una mascota con el payload esperado
* Debe mapear errores de red
* Debe mapear errores inesperados

### Screen Tests

* Debe renderizar el contenido del paso actual
* Debe mostrar acciones de navegación entre pasos
* Debe bloquear el CTA principal durante `Submitting`
* Debe mostrar feedback visual en estados de error
* Debe redirigir al flujo principal en éxito

## Acceptance Criteria

* Un usuario autenticado sin mascotas registradas debe ver el onboarding de mascota antes de entrar al Home.
* Un usuario autenticado con al menos una mascota registrada no debe ver este onboarding.
* El onboarding debe permitir registrar la primera mascota con un flujo guiado paso a paso.
* El onboarding debe capturar al menos `name` y `petType` como datos obligatorios.
* El sistema debe soportar selección de raza para `dog` y `cat` usando listas predefinidas.
* El sistema debe permitir ingresar datos opcionales como sexo, edad, peso, alergias y condiciones médicas.
* El sistema debe impedir guardar datos inválidos.
* La mascota debe quedar asociada al usuario autenticado actual.
* Al guardar exitosamente, el usuario debe ser redirigido al flujo principal autenticado.
* El onboarding no debe reaparecer mientras el usuario ya tenga una mascota registrada.
