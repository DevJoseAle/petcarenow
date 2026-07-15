# Premium Access Control

## Goal

Definir y centralizar las reglas de acceso entre plan gratuito y plan premium para que la app pueda restringir capacidades de forma consistente, persistente y observable a partir del entitlement activo en RevenueCat.

## User Story

Como usuario de PetCareNow,
quiero que la app reconozca si mi cuenta es gratuita o premium
para acceder solo a las capacidades permitidas por mi plan y recibir indicaciones claras cuando llegue a un límite.

## User Flow

1. El usuario abre la app.
2. La app obtiene el estado de suscripción desde RevenueCat.
3. La app hidrata una store global con el tier actual del usuario.
4. Cada feature consulta esa store antes de habilitar acciones restringidas.
5. Si el usuario está dentro de sus límites, la acción continúa.
6. Si el usuario excede un límite del plan gratuito, la app bloquea la acción y muestra contexto de upgrade.
7. Si el usuario compra premium o restaura compras, la app refresca el estado y desbloquea capacidades premium.

## Initial Scope

El feature debe cubrir primero estas restricciones:

* Plan gratuito:
  * máximo `1` mascota activa o registrada
  * máximo `4` eventos de cuidado por usuario
* Plan premium:
  * mascotas sin límite funcional
  * eventos sin límite funcional

## Screens

* `SubscriptionScreen`
  * debe mostrar el estado actual del plan
  * debe permitir refrescar el snapshot premium
* `PetsScreen`
  * debe bloquear la creación de una nueva mascota cuando el usuario free ya alcanzó el límite
* `PetOnboardingScreen`
  * debe validar antes de completar el alta de una mascota
* `PetDetailScreen`
  * debe respetar el límite al intentar crear una nueva mascota desde flujos secundarios
* `CalendarScreen`
  * debe bloquear la creación de nuevos eventos cuando el usuario free ya alcanzó el límite
* `EventEntryScreen`
  * debe validar el límite antes de guardar un nuevo evento

## States

### Subscription Access

* `loading`
  * la app está resolviendo el estado premium
* `free`
  * el usuario no tiene entitlement premium activo
* `premium`
  * el usuario tiene entitlement premium activo
* `provider_unavailable`
  * RevenueCat no está disponible en el build actual
* `error`
  * no fue posible refrescar el estado de suscripción

### Limit Evaluation

* `allowed`
  * la acción puede continuar
* `blocked_by_plan`
  * el usuario alcanzó un límite del plan gratuito
* `unsupported`
  * no existe una política definida para ese recurso

## Validations

* La evaluación del plan no debe depender de lógica duplicada por pantalla.
* Los límites deben salir de una única política centralizada.
* La store global debe exponer al menos:
  * `accessTier`
  * `isPremium`
  * `entitlementId`
  * `lastValidatedAt`
  * `environment`
* Antes de crear una mascota, la app debe contar cuántas mascotas tiene el usuario.
* Antes de crear un evento, la app debe contar cuántos eventos tiene el usuario a nivel global.
* Si el usuario ya es premium, no se deben aplicar límites free.
* Si no se puede validar el estado premium, la app debe usar el último snapshot conocido y evitar promociones engañosas.
* Para el límite free de eventos, sí cuentan eventos completados y archivados.
* Para el límite free de mascotas, se debe distinguir entre mascotas activas e inactivas.

## Error Handling

* Si RevenueCat falla al cargar:
  * mantener el último estado conocido si existe
  * mostrar un mensaje no bloqueante cuando aplique
* Si no existe snapshot previo:
  * asumir comportamiento seguro de `free`
  * registrar el error para soporte/debug
* Si una pantalla intenta usar una política inexistente:
  * retornar un estado controlado
  * no romper la UI

## Services

* `subscription.service`
  * seguir siendo la fuente de verdad del snapshot premium
* nuevo servicio o módulo de políticas:
  * resolver límites por tier
  * evaluar si una acción está permitida
  * generar mensajes de bloqueo reutilizables
* servicios de dominio:
  * mascotas y eventos deben exponer conteos consumidos por las reglas

## Store

Se requiere una store global de suscripción/acceso.

Responsabilidades:

* persistir en memoria el snapshot actual de acceso
* permitir refresh manual y automático
* exponer helpers de lectura para features
* desacoplar pantallas de RevenueCat directo

No debe:

* convertirse en la fuente de verdad final del entitlement
* reemplazar la validación remota de RevenueCat

## UX Rules

* Los bloqueos deben explicar claramente por qué la acción no está disponible.
* El mensaje debe indicar el límite alcanzado y la acción siguiente.
* Cuando corresponda, el CTA debe llevar a `SubscriptionScreen`.
* Un usuario premium no debe ver prompts de upgrade en acciones permitidas.

## Tests

### Unit

* políticas de límites por tier
* evaluación de acceso para mascotas
* evaluación de acceso para eventos
* fallback a free cuando no hay snapshot válido

### Hook / Store

* hidratación del estado premium en la store
* refresh después de compra o restore
* consumo del snapshot desde features

### Integration

* usuario free con `1` mascota no puede crear otra
* usuario free con menos de `4` eventos sí puede crear
* usuario free con `4` eventos globales no puede crear más
* usuario premium no tiene bloqueos en esos flujos

## Acceptance Criteria

* La app conoce globalmente si el usuario es `free` o `premium`.
* El estado premium persiste durante la sesión y se refresca al abrir la app.
* Las reglas de acceso están centralizadas en un único módulo reutilizable.
* Un usuario free no puede crear más de `1` mascota.
* Un usuario free no puede crear más de `4` eventos por usuario.
* Un usuario premium puede crear mascotas y eventos sin esos límites.
* Los bloqueos muestran mensajes claros y dirigen al upgrade cuando corresponde.
* Las pantallas no dependen de consultas directas a RevenueCat para decidir cada restricción.
* El feature queda preparado para agregar futuras restricciones premium sin duplicar lógica.
* La solución debe quedar preparada para validar estas restricciones también en backend más adelante.

## Open Questions

No hay preguntas abiertas funcionales para esta primera iteración.

## Confirmed Decisions

* El límite de eventos free es global por usuario.
* Los eventos completados o archivados sí cuentan para el límite free.
* Para mascotas free sí debemos distinguir entre activas e inactivas.
* Las restricciones deben validarse también en backend en una fase posterior.
