# Home Shell

## Goal

Construir la primera versión funcional del shell autenticado principal de la app, reemplazando el Home placeholder por una experiencia inicial alineada al diseño y dejando operativas las rutas base de navegación:

* `Inicio`
* `Mascotas`
* `+`
* `Calendario`
* `Más`

El objetivo de esta HU no es cerrar todos los feats internos, sino dejar montado el contenedor principal desde donde el usuario puede:

* ver su mascota activa
* acceder a los módulos clave
* abrir acciones rápidas
* navegar a las pantallas base futuras

## User Flow

1. El usuario autenticado entra al área principal de la app.
2. El sistema valida que tenga al menos una mascota registrada.
3. Si tiene mascota, entra al shell principal autenticado.
4. El usuario aterriza en `Inicio` y ve:
   * saludo
   * resumen de mascota activa
   * accesos visuales a emergencia, registro rápido, próximos cuidados y perfil de cuidado
5. El usuario puede cambiar entre tabs:
   * `Inicio`
   * `Mascotas`
   * `Calendario`
   * `Más`
6. El botón central `+` abre un menú de acciones rápidas.
7. Desde el Home, el usuario puede navegar a pantallas base de otros feats aunque algunas usen data mock o placeholders funcionales.

## Screens

### HomeScreen

Pantalla principal del tab `Inicio`.

Debe mostrar:

* saludo y datos básicos del usuario
* resumen de mascota activa
* botón o CTA de cambio de mascota si aplica
* card de emergencia
* sección de vacunas oculta por configuración
* sección de registro rápido
* sección de próximos cuidados
* card de perfil de cuidado

### PetsScreen

Pantalla base del tab `Mascotas`.

Debe mostrar:

* listado de mascotas del usuario
* indicador de mascota activa
* acción para seleccionar mascota activa
* CTA para agregar mascota
* acceso a detalle/edición de mascota

### CalendarScreen

Pantalla base del tab `Calendario`.

Debe mostrar:

* listado inicial de eventos
* CTA para agregar evento

### MoreScreen

Pantalla base del tab `Más`.

Debe mostrar:

* perfil de usuario
* veterinarias guardadas
* cerrar sesión
* placeholders funcionales para configuración, ayuda, legal, premium y notificaciones

### QuickActionsSheet

Menú abierto por el botón `+`.

Acciones:

* Registrar peso
* Registrar síntoma
* Registrar medicación
* Agregar nota
* Programar cuidado
* Agregar mascota

### Hidden Routes Included In Shell

Aunque no sean tabs visibles, esta HU debe dejar registradas las rutas base para:

* `pet-onboarding`
* detalle/edición de mascota
* perfil de cuidado
* formulario de registro rápido
* formulario de evento
* listado de veterinarias
* perfil de veterinaria

## States

### Bootstrapping

El shell autenticado todavía está cargando auth, mascota activa o navegación base.

### HomeReady

El usuario puede ver Home con data disponible.

### PetsReady

La lista de mascotas fue cargada y el usuario puede seleccionar una.

### EmptyPetsFallback

No hay mascotas registradas y el sistema debe mantener el flujo actual de redirección a `pet-onboarding`.

### QuickActionsOpen

El menú del botón `+` está visible.

### LoadingSection

Una sección específica del Home o de un tab aún está cargando.

### SectionError

Una sección falla, pero el shell principal sigue usable.

## Validations

### Navigation Rules

* El shell autenticado solo debe ser accesible con sesión válida.
* Si el usuario no tiene mascotas, no debe quedarse en el shell principal.
* El usuario no debe caer en loops de navegación entre `index`, `/(auth)` y `/(app)`.

### Pet Selection Rules

* Si existe una sola mascota, debe seleccionarse automáticamente como activa.
* Si existe más de una mascota, el usuario debe poder cambiar la mascota activa.
* La mascota activa debe pertenecer al usuario autenticado.

### Quick Actions Rules

* El botón `+` no navega a una pantalla fija.
* El menú rápido debe abrir/cerrar sin bloquear la navegación del resto de tabs.

## Error Handling

### Pets Load Error

Si falla la carga de mascotas:

* Home no debe romperse por completo
* debe mostrarse un mensaje recuperable
* si no puede confirmarse si hay mascotas, se debe priorizar un fallback seguro

### Section Data Error

Si falla una sección secundaria como eventos o veterinarias:

* la pantalla debe seguir renderizando
* debe mostrarse estado vacío o mensaje puntual en esa sección

### Navigation Error

No deben existir redirects en render que provoquen loops.

Las redirecciones automáticas deben resolverse fuera del render cuando corresponda.

## Services

### Pet Service

Debe soportar:

* cargar mascotas del usuario
* conocer la mascota activa
* refrescar lista al agregar/editar/eliminar

Métodos esperados:

* `getUserPets(ownerId)`
* `hasRegisteredPets(ownerId)`

### Care Event Service

En esta HU puede usar datos mock-first.

Debe soportar:

* listar próximos cuidados
* listar eventos del calendario
* filtrar por mascota activa

### Veterinary Service

En esta HU puede usar datos mock-first.

Debe soportar:

* listar veterinarias
* obtener detalle de veterinaria

## Store

### Auth Store

Sigue siendo la fuente de sesión autenticada.

### Pet Store

Debe existir store global compartido para:

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

### Optional UI Local State

Cada pantalla o hook puede manejar localmente:

* apertura del menú `+`
* errores visuales de una sección
* estados de carga por CTA

## Tests

### Store Tests

* debe hidratar mascotas del usuario
* debe seleccionar automáticamente la mascota activa cuando hay una sola
* debe permitir cambiar mascota activa
* debe refrescar mascotas luego de un cambio

### Hook Tests

* Home debe reaccionar a mascota única
* Home debe reaccionar a múltiples mascotas
* el menú de acciones rápidas debe abrirse y cerrarse
* la navegación del shell no debe producir loops

### Screen Tests

* debe renderizar tabs principales
* Home debe renderizar secciones principales
* Mascotas debe renderizar listado y CTA
* Calendario debe renderizar listado base
* Más debe renderizar opciones principales

## Acceptance Criteria

* El área autenticada debe dejar de ser un Home placeholder y pasar a ser un shell con tabs reales.
* El usuario debe poder navegar entre `Inicio`, `Mascotas`, `Calendario` y `Más`.
* El botón `+` debe abrir un menú de acciones rápidas.
* El Home debe mostrar una mascota activa real del usuario.
* Si hay más de una mascota, el usuario debe tener un camino visible para cambiarla.
* El shell debe mantener la protección actual para usuarios sin mascotas y redirigirlos al flujo correspondiente.
* Deben quedar registradas las rutas base para feats siguientes aunque algunas pantallas inicien como placeholders funcionales.
* La navegación no debe generar loops ni duplicar pantallas innecesariamente.
