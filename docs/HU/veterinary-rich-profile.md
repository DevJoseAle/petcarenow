# Veterinary Rich Profile

## Goal

Elevar la experiencia actual de `Veterinarias` desde un flujo útil de mapa/listado hacia un directorio clínico rico, confiable y accionable, donde el dueño de mascota pueda evaluar una clínica con suficiente contexto para tomar una decisión.

La experiencia debe hacer que cada veterinaria muestre mejor su potencial y permita al usuario resolver preguntas clave como:

* quiénes son
* qué servicios ofrecen
* si atienden urgencias
* si atienden a domicilio
* cómo contactarlos rápido
* qué tan confiables se ven
* si cuentan con el servicio específico que su mascota necesita

Esta HU no parte de autogestión por parte de la clínica.

La data será cargada manualmente por el equipo de producto en esta primera etapa.

## User Flow

1. El usuario entra al flujo de veterinarias desde emergencia o desde una ruta secundaria.
2. Ve mapa o listado de clínicas cercanas.
3. Identifica rápidamente una clínica gracias a:
   * logo
   * portada
   * badges clave
   * urgencias
   * 24 horas
   * atención a domicilio
   * categorías de servicios
4. Abre el perfil enriquecido de la clínica.
5. Consulta información de valor:
   * identidad de la clínica
   * información general
   * servicios por categorías
   * equipo médico
   * horarios
   * contacto
   * redes sociales
6. Decide si:
   * llamar
   * escribir por WhatsApp
   * abrir ubicación
   * guardar la clínica
7. Más adelante, la misma estructura permitirá agendar cita o usar telemedicina sin rehacer el modelo.

## Screens

### VeterinariesScreen

Debe evolucionar para mostrar mejor la propuesta de valor de cada clínica incluso antes de entrar al detalle.

Debe incluir:

* logo o imagen principal
* nombre
* badges importantes
* distancia
* urgencias
* 24 horas
* atención a domicilio
* categorías resumidas de servicios

### VeterinaryProfileScreen

Debe convertirse en una pantalla rica y modular.

Secciones esperadas:

#### 1. Perfil de la Clínica

* logo
* foto de portada
* nombre
* descripción
* años de experiencia
* misión
* valores
* idiomas
* sitio web
* WhatsApp
* redes sociales

#### 2. Información General

* dirección
* mapa
* teléfono
* correo
* horario
* urgencias
* atención 24 horas
* estacionamiento
* accesibilidad
* acepta seguros `futuro`
* métodos de pago
* atención a domicilio

#### 3. Servicios

Módulo central del perfil.

Cada servicio debe permitir mostrar:

* nombre
* descripción
* duración aproximada
* precio opcional
* imagen
* categoría
* disponible

El usuario no debe ver esto como texto libre desordenado.

Deben existir categorías estructuradas y seleccionables.

#### 4. Equipo Médico

Cada veterinario debe poder mostrar:

* foto
* nombre
* especialidad
* universidad
* años de experiencia
* mini biografía
* idiomas
* horario opcional
* redes

#### 5. Horarios

Debe permitir modelar mejor que una fila simple de `Lunes 9-18`.

Debe soportar:

* horario general
* horario de urgencias
* días cerrados
* feriados
* turno 24 horas
* atención a domicilio

#### 6. Contacto

Debe priorizar acciones de alto valor:

* llamar
* WhatsApp
* correo
* abrir mapa
* chat `futuro`
* solicitar cita `futuro`
* telemedicina `futuro`

## States

### VeterinariesDirectoryReady

El mapa/listado renderiza cards enriquecidas de clínicas.

### VeterinaryProfileLoading

El perfil enriquecido aún se está armando.

### VeterinaryProfileReady

La clínica y sus módulos ya están disponibles.

### VeterinaryProfilePartial

La clínica existe, pero no todas sus secciones están completas.

La UI debe tolerar esto elegantemente.

### VeterinaryServicesEmpty

La clínica aún no tiene servicios cargados.

### VeterinaryTeamEmpty

La clínica aún no tiene equipo cargado.

### VeterinaryHoursPartial

Hay horarios incompletos o parciales, pero la pantalla sigue siendo usable.

### VeterinaryProfileError

No fue posible cargar el perfil enriquecido.

## Validations

### Data Model Decision

No conviene meter toda la nueva información en una sola tabla `veterinaries`.

La estrategia recomendada es:

#### Mantener y ampliar `veterinaries`

Debe seguir siendo la tabla raíz de la clínica y contener:

* identidad base
* geolocalización
* flags operativos
* contacto principal
* metadata simple de alto acceso

Campos nuevos recomendados en `veterinaries`:

* `logo_url`
* `cover_url`
* `email`
* `website_url`
* `whatsapp_phone`
* `instagram_url`
* `facebook_url`
* `tiktok_url`
* `years_experience`
* `mission`
* `values`
* `languages` text[] o jsonb
* `parking_available`
* `accessibility_features`
* `accepts_insurance`
* `payment_methods`
* `offers_home_visit`
* `home_visit_notes`

#### Crear tablas complementarias

##### `veterinary_services`

Una clínica puede tener muchos servicios.

Campos sugeridos:

* `id`
* `veterinary_id`
* `name`
* `description`
* `duration_minutes`
* `price_amount`
* `currency`
* `image_url`
* `category_code`
* `is_available`
* `created_at`
* `updated_at`

##### `veterinary_service_categories`

Tabla catálogo para evitar texto libre inconsistente.

Campos sugeridos:

* `code`
* `label`
* `description`
* `sort_order`

Categorías iniciales sugeridas:

* `general_consultation`
* `vaccination`
* `emergency`
* `surgery`
* `hospitalization`
* `diagnostic_imaging`
* `laboratory`
* `dentistry`
* `dermatology`
* `traumatology`
* `cardiology`
* `behavior`
* `ophthalmology`
* `exotics`
* `felines`
* `canines`
* `microchip`
* `deworming`
* `euthanasia`
* `certificates`
* `weight_control`

##### `veterinary_staff`

Para equipo médico.

Campos sugeridos:

* `id`
* `veterinary_id`
* `photo_url`
* `full_name`
* `specialty`
* `university`
* `years_experience`
* `bio`
* `languages`
* `schedule_notes`
* `instagram_url`
* `facebook_url`
* `linkedin_url`
* `is_active`
* `created_at`
* `updated_at`

##### `veterinary_hours`

Para horarios estructurados.

Campos sugeridos:

* `id`
* `veterinary_id`
* `hour_type` enum:
  * `general`
  * `emergency`
  * `holiday`
  * `closed_day`
  * `home_visit`
* `day_of_week` nullable
* `opens_at` nullable
* `closes_at` nullable
* `notes`
* `is_24_hours`
* `is_closed`
* `created_at`
* `updated_at`

### UI Rules

* el perfil no debe colapsar en una sola columna interminable sin jerarquía
* debe haber secciones claras
* contacto debe ser accionable
* redes sociales solo deben mostrarse si existen
* servicios deben poder filtrarse por categoría
* atención a domicilio debe mostrarse como badge o atributo visible

### Content Rules

* misión y valores son opcionales
* servicios deben usar categorías estructuradas
* el usuario nunca debe ver listas inconsistentes o mezcladas con texto libre
* si faltan módulos secundarios, la clínica igual debe poder mostrarse

## Error Handling

### Rich Profile Load Error

Si falla la carga compuesta del perfil:

* la UI debe mostrar retry
* no debe romper el resto del flujo de veterinarias
* debe ser posible abrir datos mínimos si existen

### Partial Data Error

Si algunas tablas relacionadas no tienen datos:

* no debe tratarse como error fatal
* debe mostrarse empty state por sección

### Contact Action Error

Si falla abrir WhatsApp, correo o llamada:

* debe mostrarse feedback claro
* la pantalla no debe cerrarse

## Services

### Veterinary Service

Debe seguir resolviendo:

* listado de clínicas
* perfil base de clínica
* favoritas

Debe ampliarse para soportar también:

* `getVeterinaryRichProfile(id)`

### Veterinary Services Service

Debe listar servicios por clínica y opcionalmente filtrarlos por categoría.

### Veterinary Staff Service

Debe listar equipo médico por clínica.

### Veterinary Hours Service

Debe listar y normalizar horarios por clínica.

### Social / Contact Mapping

El servicio debe exponer links limpios y accionables para:

* sitio web
* WhatsApp
* Instagram
* Facebook
* TikTok
* correo

## Store

No es obligatorio introducir un store nuevo para esta HU.

La carga puede seguir siendo screen + hook + service mientras:

* el perfil rico se consulte por pantalla
* no exista edición compleja compartida

Si luego se crea un backoffice o una gestión intensiva de filtros, podría evaluarse store dedicado.

## Tests

### Services

* mapping de `veterinaries` extendida
* listado de `veterinary_services`
* filtrado por categoría
* listado de `veterinary_staff`
* armado de horarios
* armado del perfil rico combinado

### Hooks

* hydrate de perfil rico exitoso
* perfil parcial
* errores de carga por módulo
* filtros de categorías
* acciones de contacto

### Screens

* cards enriquecidas en mapa/listado
* perfil muestra secciones correctas
* servicios se agrupan o filtran
* redes sociales se muestran solo si existen
* badges de urgencias, 24 horas y domicilio

## Acceptance Criteria

* La experiencia de veterinarias debe sentirse como un directorio clínico real, no solo como un mapa básico.
* Cada clínica debe poder mostrar identidad visual clara con logo, portada y descripción.
* Debe existir una estrategia de datos explícita que combine crecimiento de `veterinaries` con tablas relacionadas.
* Los servicios no deben modelarse solo como texto libre; deben soportar categorías estructuradas.
* El perfil de clínica debe soportar redes sociales y atención a domicilio desde la primera iteración.
* La información de contacto debe ser altamente accionable.
* El perfil debe tolerar datos parciales sin romperse.
