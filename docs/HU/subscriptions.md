# Subscriptions

## Goal

Permitir que el usuario autenticado acceda desde `Más` a una experiencia real de `Suscripción / Premium`, con visibilidad clara de:

* estado actual del acceso premium
* beneficios del plan
* paywall o catálogo de planes
* restauración de compras
* preparación real de RevenueCat como fuente de verdad de suscripciones

Esta HU no debe quedarse en un placeholder visual. Debe dejar la arquitectura y el producto preparados para monetización real en mobile, usando RevenueCat como capa central para:

* offerings
* entitlements
* customer info
* restore purchases
* futura gestión cross-platform

No forma parte obligatoria de esta HU:

* panel administrativo propio
* analítica avanzada de ingresos
* promociones complejas
* gestión web de billing
* suscripciones familiares o gifting

## User Flow

1. El usuario autenticado entra a la tab `Más`.
2. Toca `Suscripción / Premium`.
3. La app navega a una pantalla real de suscripción.
4. La pantalla carga el estado del usuario en RevenueCat.
5. Si el usuario no tiene acceso premium:
   * ve beneficios
   * ve el plan disponible
   * puede intentar suscribirse
6. Si el usuario ya tiene acceso premium:
   * ve su estado activo
   * ve qué acceso premium tiene desbloqueado
   * puede restaurar compras si lo necesita
7. Si la app está corriendo en Expo Go:
   * la UI debe explicitar que está en modo preview
   * no debe fingir compra real
8. Si la app corre en development build o build nativa:
   * puede consultar offerings reales
   * puede iniciar flujo real de compra / restauración
9. La app actualiza el estado premium usando RevenueCat como fuente de verdad.
10. El usuario puede volver a `Más` con navegación nativa.

## Screens

### SubscriptionScreen

Pantalla principal de suscripciones accesible desde `Más`.

Debe mostrar al menos:

* botón nativo de regreso
* encabezado claro
* resumen de beneficios premium
* estado actual de la suscripción
* CTA principal según contexto
* CTA de restaurar compras
* feedback de carga, error y éxito

Secciones mínimas recomendadas:

* `Tu acceso actual`
* `Beneficios premium`
* `Planes disponibles`
* `Restaurar compras`

### Optional Preview / Empty RevenueCat State

No necesita ser una pantalla aparte, pero la UI debe contemplar explícitamente:

* RevenueCat no configurado aún
* offerings vacíos
* ejecución en Expo Go Preview API mode

## States

### SubscriptionLoading

La pantalla está resolviendo configuración, customer info y offerings.

### SubscriptionReadyFree

El usuario no tiene entitlement premium activo y la pantalla muestra el plan disponible.

### SubscriptionReadyPremium

El usuario sí tiene un entitlement premium activo.

### SubscriptionPreviewMode

La app corre en Expo Go o en un entorno donde RevenueCat solo puede exponer preview APIs sin compra real.

### SubscriptionOfferingsEmpty

RevenueCat responde sin offerings configurados para la app / store actual.

### SubscriptionPurchasing

El usuario inició un intento de compra.

### SubscriptionRestoring

El usuario inició restauración de compras.

### SubscriptionError

Falló la carga de estado, offerings, compra o restore.

## Validations

### Navigation Rules

* `Suscripción / Premium` debe navegar a una pantalla real
* el botón back debe regresar a `Más`
* la pantalla no debe romper el shell autenticado

### RevenueCat Setup Rules

* la app debe usar RevenueCat como fuente de verdad para acceso premium
* la configuración debe contemplar API key por plataforma
* la app debe identificar al usuario autenticado con un `appUserID` estable
* no debe asumirse premium por estado local sin validar `CustomerInfo`

### Product Rules

* debe existir al menos un entitlement premium objetivo
* los productos deben venir desde offerings de RevenueCat
* la UI no debe depender de precios hardcodeados si ya existen offerings reales
* si no hay offerings, debe mostrarse feedback claro y controlado

### Purchase Rules

* no debe iniciarse más de una compra en paralelo
* no debe marcarse premium antes de confirmar entitlement activo
* restaurar compras debe ser una acción explícita
* la UI debe tolerar cancelación del flujo de compra sin tratarla como crash

### Expo / Environment Rules

* Expo Go no debe presentarse como entorno válido para pruebas reales de compra
* la app debe comunicar claramente cuándo está en preview mode
* para pruebas reales debe contemplarse development build, tal como indica la documentación oficial de RevenueCat para Expo

Inferencia basada en RevenueCat:
RevenueCat permite que Expo Go ejecute lógica en Preview API mode, pero para compras reales y comportamiento nativo completo exige development build. Fuente oficial: [RevenueCat Expo Installation](https://www.revenuecat.com/docs/getting-started/installation/expo).

## Error Handling

### Load Error

Si falla la carga inicial:

* la pantalla debe mostrar error claro
* debe existir retry
* no debe romper navegación

### Configuration Error

Si RevenueCat no está correctamente configurado:

* debe mostrarse mensaje explícito
* no debe quedar la UI en blanco
* debe quedar claro si el problema es API key, offerings vacíos o entorno no soportado

### Purchase Error

Si la compra falla:

* debe mostrarse feedback claro
* la cancelación del usuario no debe tratarse como error severo
* la pantalla debe seguir usable

### Restore Error

Si restaurar compras falla:

* debe mostrarse feedback claro
* el usuario debe poder reintentar

### Empty Offerings Error

Si RevenueCat responde sin offerings:

* debe mostrarse un estado controlado
* debe quedar claro que falta configuración y no que el usuario hizo algo mal

## Services

### RevenueCat Service

Responsabilidad:

* inicializar el SDK
* identificar al usuario autenticado
* leer customer info
* leer offerings
* iniciar compras
* restaurar compras
* mapear el estado premium de forma segura para la app

Métodos esperados:

* `configureRevenueCat()`
* `identifyRevenueCatUser(ownerId)`
* `getCustomerInfo()`
* `getCurrentOffering()`
* `purchasePackage(packageId | packageRef)`
* `restorePurchases()`
* `getSubscriptionAccessState()`
* `isRevenueCatPreviewMode()` si se necesita separar Expo Go de build real

### Auth Integration

La integración debe apoyarse en el usuario autenticado actual para enviar a RevenueCat un `appUserID` consistente.

Esto es importante para:

* restauración coherente
* acceso premium estable entre reinstalaciones
* futura expansión multi-device

### Supabase Integration

No es obligatorio que Supabase sea la fuente primaria del estado premium en esta HU.

Decisión recomendada:

* RevenueCat = fuente de verdad de suscripciones
* Supabase = opcional para cache, metadata o mirrors futuros

Para MVP, no conviene duplicar todavía el estado premium en tablas propias si no hay una necesidad clara.

## Store

### Local Screen State

La pantalla puede manejar localmente:

* loading
* error
* preview mode
* offering actual
* customer info
* purchase / restore in progress

### Optional Subscription Store

Puede evaluarse un store global solo si el acceso premium necesita consumirse desde múltiples features.

Ejemplos:

* bloquear funcionalidades premium
* mostrar badges premium en distintas pantallas
* refrescar entitlement después de compra o restore

Si se crea store, debe contener solo estado compartido y no meter lógica de compra compleja dentro del store.

## Tests

### Hook Tests

* debe cargar el estado de suscripción del usuario
* debe distinguir usuario free vs premium
* debe manejar offerings vacíos
* debe manejar preview mode
* debe iniciar compra correctamente
* debe restaurar compras correctamente
* debe manejar errores de carga, compra y restore

### Service Tests

* debe configurar RevenueCat con la API key correcta según plataforma
* debe identificar al usuario autenticado
* debe obtener offerings
* debe obtener customer info
* debe mapear entitlement premium activo / inactivo
* debe mapear errores del SDK a mensajes útiles

### Screen Tests

* renderiza header y botón back
* muestra estado free
* muestra estado premium
* muestra CTA de compra cuando corresponde
* muestra CTA de restore
* muestra retry en error
* muestra mensaje específico en preview mode

### Manual Verification

Debe contemplarse una lista manual clara para probar:

* Expo Go en preview mode
* development build con RevenueCat real
* usuario sin compra
* usuario con compra restaurada
* offerings vacíos

RevenueCat recomienda comenzar con Test Store durante desarrollo y luego pasar a sandboxes de Apple / Google antes del lanzamiento. Fuente oficial: [RevenueCat Sandbox Testing](https://www.revenuecat.com/docs/test-and-launch/sandbox).

## Acceptance Criteria

* Existe una pantalla real de `Suscripción / Premium` accesible desde `Más`.
* La pantalla puede mostrar si el usuario tiene o no acceso premium.
* RevenueCat queda incorporado como fuente de verdad del acceso premium.
* La HU contempla configuración real de offerings, entitlements y customer info.
* La UI contempla preview mode en Expo Go sin fingir compras reales.
* La UI contempla el uso correcto de development build para pruebas reales.
* La pantalla soporta loading, empty offerings, error y retry.
* El usuario puede intentar restaurar compras desde la misma pantalla.
* La arquitectura respeta `Screen -> Hook/ViewModel -> Service`.
