# Emergency and Veterinaries

## Goal

Permitir que un usuario autenticado acceda rápidamente a un flujo de emergencia desde el `Home`, con capacidad de consultar veterinarias en mapa o listado, revisar información útil y navegar al perfil de una veterinaria.

Esta HU debe convertir la card de emergencia en una experiencia accionable y clara, enfocada en:

* acceso rápido a veterinarias cercanas o relevantes
* segmentación entre vista mapa y vista listado
* filtros o pickers básicos para refinar la consulta
* visualización de información relevante para decidir rápido
* uso de la ubicación actual del usuario para mejorar el contexto del mapa

El objetivo principal de esta primera iteración es el modo `mapa`, con datos almacenados en Supabase y seed inicial en Santiago.

## User Flow

1. El usuario autenticado entra al `Home`.
2. El usuario toca la card `¿Es una emergencia?`.
3. El sistema muestra un menú con:
   * `Ver mapa`
   * `Ver listado`
   * `Cancelar`
4. Si el usuario elige `Ver mapa`, navega a la pantalla de veterinarias en modo mapa.
5. La pantalla solicita permisos de ubicación si aún no fueron concedidos.
6. Si el usuario acepta, el sistema intenta obtener su ubicación actual.
7. La pantalla carga veterinarias desde Supabase.
8. El usuario puede aplicar filtros o pickers básicos.
9. El mapa muestra puntos o markers de veterinarias.
10. El usuario toca una veterinaria y visualiza información resumida.
11. El usuario puede abrir el perfil completo de la veterinaria.
12. Desde el perfil puede:
   * ver detalles
   * abrir mapas externos
   * llamar
   * guardar o desguardar

## Screens

### Emergency Entry Action

El disparador está en la card de emergencia del `Home`.

Debe abrir un menú o action sheet con:

* `Ver mapa`
* `Ver listado`
* `Cancelar`

### VeterinariesScreen

Debe soportar dos modos:

* `map`
* `list`

Para esta HU, el modo `map` es prioritario.

#### Map Mode

Debe mostrar:

* mapa con veterinarias
* ubicación actual del usuario cuando el permiso esté disponible
* pickers o filtros básicos
* información resumida de la veterinaria seleccionada
* CTA para abrir perfil

Filtros posibles:

* solo emergencia
* solo 24/7
* ciudad o zona si aplica

Ubicación:

* debe usar `expo-location`
* debe pedir permiso de ubicación al usuario
* si el permiso es concedido, debe centrar o contextualizar el mapa con la ubicación actual
* si el permiso es rechazado, la pantalla debe seguir funcionando con una región inicial por defecto en Santiago

#### List Mode

Debe seguir disponible como alternativa simple.

Debe mostrar:

* listado de veterinarias
* información breve
* acceso al perfil

### VeterinaryProfileScreen

Pantalla de detalle de una veterinaria.

Debe mostrar:

* nombre
* dirección
* teléfono
* si atiende emergencias
* si es 24/7
* descripción
* CTA abrir mapa externo
* CTA llamar
* CTA guardar/desguardar

## States

### VeterinariesLoading

La pantalla está cargando veterinarias.

### VeterinariesReady

Las veterinarias ya están disponibles en mapa o listado.

### VeterinariesEmpty

No hay veterinarias disponibles para los filtros actuales.

La UI debe informar esto claramente y permitir limpiar filtros o reintentar.

### VeterinariesMapReady

El mapa está listo para interacción y markers.

### LocationPermissionPending

La pantalla está solicitando permiso de ubicación.

### LocationPermissionDenied

El usuario rechazó el permiso o no fue posible obtener ubicación.

La pantalla debe seguir funcionando con una región fallback.

### LocationReady

La ubicación actual del usuario fue resuelta y puede usarse para centrar o contextualizar el mapa.

### VeterinarySelected

El usuario seleccionó una veterinaria y se muestra un resumen contextual.

### VeterinariesError

Falló la carga de veterinarias y la UI debe mostrar feedback recuperable.

### VeterinaryProfileLoading

Se está cargando el detalle de una veterinaria.

### VeterinaryProfileReady

El perfil está listo para consulta y acciones.

## Validations

### Data Rules

Cada veterinaria debe tener datos mínimos válidos:

* `name`
* `address`
* `city`
* `photo_url` opcional pero recomendado para mejorar la card del mapa y listado
* `latitude`
* `longitude`
* `is_emergency`
* `is_24_7`

### Map Rules

* no debe renderizarse un marker sin coordenadas válidas
* el mapa debe usar una región inicial coherente con Santiago en esta primera iteración
* los filtros no deben romper el render del mapa si no hay resultados
* si existe ubicación actual válida, debe priorizarse para el contexto del mapa
* si no existe permiso o ubicación, debe usarse una región fallback segura

### Location Rules

* el permiso de ubicación debe pedirse de forma explícita
* la app debe tolerar rechazo de permisos sin bloquear la pantalla
* la ubicación del usuario no debe impedir que se muestren veterinarias si falla
* esta HU no requiere tracking en background, solo ubicación actual o reciente

### Ownership Rules

Las veterinarias son datos compartidos del sistema, no datos privados por usuario.

Pero:

* las veterinarias guardadas sí dependen del usuario autenticado
* el guardado/desguardado debe operar solo sobre favoritas del usuario

## Error Handling

### Veterinaries Load Error

Si falla la carga:

* la pantalla debe mostrar error claro
* debe existir acción de retry
* no debe romper navegación ni shell autenticado

### Map Render Error

Si el mapa no puede renderizarse:

* la pantalla debe degradar con una alternativa útil
* el listado o la información textual debe seguir siendo accesible si es posible

### Location Error

Si falla el permiso o la obtención de ubicación:

* la pantalla debe seguir siendo usable
* debe mostrarse un mensaje contextual si aporta valor
* el mapa debe abrir en Santiago por defecto

### Veterinary Profile Error

Si falla la carga del perfil:

* la pantalla debe mostrar error recuperable
* debe existir retry

### Save Favorite Error

Si falla guardar o desguardar:

* el perfil no debe cerrarse
* debe mostrarse feedback claro
* el usuario debe poder reintentar

## Services

### Veterinary Service

Debe usar `veterinaries` como fuente de verdad.

Métodos esperados:

* `listVeterinaries(filters?)`
* `getVeterinaryById(id)`
* `listSavedVeterinaryIds(ownerId)`
* `saveVeterinary(...)`
* `removeSavedVeterinary(...)`

Debe leer desde Supabase.

### Location Service

Debe usar `expo-location`.

Responsabilidades:

* solicitar permiso de ubicación foreground
* obtener ubicación actual del usuario
* devolver coordenadas listas para el mapa
* manejar rechazo o error sin romper la experiencia

### Saved Veterinaries Service

Debe usar `saved_veterinaries`.

Métodos esperados:

* `listSavedVeterinaries(ownerId)`
* `saveVeterinary(ownerId, veterinaryId, petId?)`
* `removeSavedVeterinary(ownerId, veterinaryId)`

### Emergency Navigation Layer

Debe existir una forma clara de abrir `VeterinariesScreen` en:

* modo mapa
* modo listado

## Store

### Veterinaries Store

Puede mantenerse si realmente aporta valor para:

* favoritas
* estado compartido del mapa o selección
* ubicación resuelta del usuario

Si no agrega valor, la HU puede resolverse con estado local en hooks.

### Local UI State

Debe manejar:

* filtros
* veterinaria seleccionada
* loading/error
* modo actual de vista
* permiso de ubicación
* coordenadas actuales o fallback

## Tests

### Service Tests

* debe listar veterinarias desde Supabase
* debe obtener veterinaria por id
* debe guardar/desguardar favorita
* debe mapear errores de backend y errores inesperados
* debe resolver correctamente estados de permiso/ubicación en la capa correspondiente

### Hook Tests

* debe cargar veterinarias en modo mapa
* debe aplicar filtros básicos
* debe permitir seleccionar una veterinaria
* debe navegar al perfil
* debe exponer retry ante error
* debe manejar permiso de ubicación concedido
* debe manejar permiso de ubicación rechazado con fallback

### Screen Tests

* debe renderizar modo mapa y modo listado
* debe mostrar estados `loading`, `empty`, `error`
* debe mostrar información resumida de veterinaria seleccionada
* debe renderizar acciones del perfil de veterinaria
* debe seguir funcionando cuando no haya permiso de ubicación

## Acceptance Criteria

* La card de emergencia del `Home` debe abrir un menú con mapa o listado
* Debe existir una tabla `veterinaries` en Supabase
* Debe existir una carga inicial de veterinarias para Santiago
* Debe integrarse `expo-location`
* La pantalla debe solicitar permiso de ubicación
* Si el permiso es concedido, el mapa debe usar la ubicación actual del usuario
* Si el permiso es rechazado, el mapa debe seguir funcionando con región inicial en Santiago
* El modo mapa debe mostrar veterinarias con información básica relevante
* Debe existir al menos un filtro o picker útil en mapa
* El usuario puede abrir el perfil de una veterinaria desde mapa o listado
* El perfil de veterinaria permite llamar, abrir mapa externo y guardar/desguardar
* Si la carga falla, la UI muestra error recuperable sin romper el shell autenticado
