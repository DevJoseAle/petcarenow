# Help

## Goal

Permitir que el usuario autenticado acceda desde la tab `Más` a una pantalla real de `Ayuda`, con información clara y accionable para resolver dudas frecuentes sin salir de la app innecesariamente.

En esta primera iteración `MVP`, la experiencia debe cubrir:

* preguntas frecuentes
* canales de contacto básicos
* acceso a términos y privacidad

No forma parte de esta HU:

* chat en tiempo real
* centro de tickets
* base de conocimiento remota
* soporte contextual por pantalla
* seguimiento de casos

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. Toca la opción `Ayuda`.
3. La app navega a una pantalla real de ayuda.
4. El usuario puede revisar preguntas frecuentes.
5. El usuario puede abrir un canal de contacto básico.
6. El usuario puede acceder a términos y privacidad.
7. El usuario puede volver a `Más` sin perder el shell autenticado.

## Screens

### HelpScreen

Pantalla principal de ayuda accesible desde `Más`.

Debe mostrar al menos:

* botón de regreso
* encabezado claro
* sección de preguntas frecuentes
* sección de contacto
* accesos a términos y privacidad

Secciones mínimas recomendadas:

* `Preguntas frecuentes`
* `Contacto`
* `Legal`

## States

### HelpReady

La pantalla renderiza correctamente su contenido principal.

### HelpExternalActionPending

El usuario intenta abrir un canal externo como email o navegador.

### HelpExternalActionError

No fue posible abrir el recurso externo y debe mostrarse feedback claro.

## Validations

### Navigation Rules

* `Ayuda` debe navegar a una pantalla real
* el botón back debe regresar a `Más`
* la pantalla no debe romper el shell autenticado

### FAQ Rules

* las preguntas frecuentes deben estar disponibles localmente en esta iteración
* el contenido debe ser breve, legible y estable
* no debe depender de un backend para renderizarse

### Contact Rules

* al menos un canal de contacto debe ser accionable
* si se expone email, debe abrir el composer del dispositivo cuando sea posible
* si se expone enlace web, debe abrirse de forma segura
* si el dispositivo no puede abrir el recurso, la app debe responder con feedback claro

### Legal Rules

* la pantalla debe exponer accesos claros a términos y privacidad
* en esta iteración pueden abrir un recurso externo o una pantalla placeholder real
* no deben quedar como acciones mudas

## Error Handling

### External Action Error

Si falla abrir email, navegador o recurso legal:

* debe mostrarse mensaje claro
* la pantalla debe seguir usable
* el usuario debe poder reintentar

### Missing Resource Error

Si falta alguna URL o canal configurado:

* debe mostrarse un estado controlado
* la pantalla no debe romper render

## Services

### Help Service

Responsabilidad:

* exponer preguntas frecuentes locales
* exponer configuración básica de contacto
* encapsular apertura de acciones externas

Métodos esperados:

* `getHelpFaqItems()`
* `getHelpContactOptions()`
* `openHelpContactOption(option)`
* `openHelpLegalLink(type)`

## Store

No es obligatorio crear un store para esta HU.

Para esta iteración, el estado puede resolverse a nivel pantalla/hook si:

* las FAQs son estáticas
* las acciones son locales
* no existe sincronización cross-feature

## Tests

### Help Screen Tests

* renderiza FAQ y secciones principales
* navega correctamente desde `Más`
* intenta abrir contacto al tocar una opción
* maneja error si una acción externa falla
* expone accesos a términos y privacidad

### Help Service / Hook Tests

* devuelve FAQ esperadas
* devuelve canales de contacto configurados
* maneja recursos inválidos de forma controlada

## Acceptance Criteria

* desde `Más`, `Ayuda` navega a una pantalla real
* la pantalla muestra preguntas frecuentes locales
* la pantalla ofrece al menos un canal de contacto accionable
* la pantalla expone accesos a términos y privacidad
* si abrir un recurso externo falla, la app muestra feedback claro
* la experiencia queda lista para evolucionar a un centro de ayuda más completo
