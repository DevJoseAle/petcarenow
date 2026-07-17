# Symptom Checker AI Architecture

## Goal

Definir cómo usar GPT en el MVP del `Symptom Checker` sin volver el producto dependiente de un solo proveedor ni delegar la seguridad clínica al modelo.

## Decision

Para el MVP:

* el motor determinístico define el nivel de atención
* GPT solo genera la redacción final para el tutor
* la app nunca usa el modelo para bajar una prioridad
* la app debe poder reemplazar GPT por otro proveedor sin reescribir el dominio

## Document Placement

Estos documentos no viven en `docs/specs` porque no son guías generales de desarrollo.

Pertenecen al feature y deben vivir junto a sus artefactos de negocio en:

* `docs/HU/symptom-checker.md`
* `docs/symptom-checker/triage-matrix.md`
* `docs/symptom-checker/rule-catalog.md`
* `docs/symptom-checker/question-catalog.md`
* `docs/symptom-checker/roadmap.md`

Si más adelante existe un backend dedicado, los prompts reales, schemas y plantillas operativas deben vivir en el backend, no solo en `docs/`.

## Architecture Principle

La arquitectura debe separarse en cuatro capas:

1. **Flow layer**
   Maneja UI, navegación, estado y progreso del cuestionario.

2. **Decision layer**
   Ejecuta reglas determinísticas y devuelve un resultado estructurado de triage.

3. **Generation layer**
   Toma un resultado estructurado y produce un mensaje seguro para el tutor.

4. **Provider layer**
   Implementa el proveedor actual del modelo, hoy OpenAI, mañana cualquier otro.

## Deterministic Engine First

El motor de triage debe devolver algo de este estilo:

```ts
interface SymptomAssessmentDecision {
  priority:
    | 'emergency'
    | 'urgent'
    | 'consult'
    | 'monitor';
  stopFlow: boolean;
  matchedRuleCodes: string[];
  reasonCodes: string[];
  nextAction:
    | 'call_emergency_vet'
    | 'open_vet_map'
    | 'book_vet_consult'
    | 'monitor_at_home';
  escalationSignals: string[];
}
```

Este objeto es la fuente de verdad del producto.

## GPT Usage In MVP

GPT debe usarse solo para convertir el resultado estructurado en una explicación clara, calmada y no diagnóstica.

Ejemplo:

Entrada estructurada:

```json
{
  "priority": "urgent",
  "reasonCodes": [
    "repeated_vomiting",
    "cannot_keep_water"
  ],
  "nextAction": "open_vet_map",
  "escalationSignals": [
    "difficulty_breathing",
    "collapse",
    "blood_in_vomit"
  ]
}
```

Salida esperada:

```json
{
  "title": "Consulta veterinaria prioritaria",
  "summary": "Lo que indicas requiere una evaluación veterinaria pronta.",
  "why": [
    "Tu mascota ha vomitado repetidamente.",
    "No está logrando retener agua."
  ],
  "next_step": "Te recomendamos contactar una veterinaria hoy.",
  "watch_out": [
    "Si aparece dificultad para respirar, colapso o sangre, busca atención inmediata."
  ]
}
```

## OpenAI Recommendation

Para el proveedor actual conviene usar OpenAI Responses API para solicitudes nuevas y Structured Outputs con JSON Schema para asegurar respuestas válidas.

Fuentes oficiales revisadas el viernes 17 de julio de 2026:

* [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create/)
* [Text generation guide](https://developers.openai.com/api/docs/guides/text)
* [Structured outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs)

Inferencia operativa:

* Responses API es el surface recomendado para nuevas integraciones.
* Structured Outputs reduce riesgo de texto libre inconsistente para un feature sensible.

## Recommended Interface

```ts
export interface SymptomCheckerAiGateway {
  generateOwnerMessage(
    input: SymptomOwnerMessageInput
  ): Promise<SymptomOwnerMessageResult>;
}
```

Implementaciones futuras:

* `OpenAiSymptomCheckerGateway`
* `AnthropicSymptomCheckerGateway`
* `GoogleSymptomCheckerGateway`
* `CompositeSymptomCheckerGateway`

## Provider Input Contract

La capa de IA no debe recibir el historial completo crudo del usuario si no es necesario.

Debe recibir un contrato reducido:

* especie
* síntoma principal
* prioridad final
* rule codes
* reason codes aprobados
* next action
* escalation signals

No debe recibir:

* libertad para reinterpretar clínicamente el caso
* instrucciones para elegir prioridad
* instrucciones para sugerir medicación

## Output Contract

El modelo debe responder con schema cerrado.

Campos sugeridos:

* `title`
* `summary`
* `why[]`
* `next_step`
* `watch_out[]`

Y restricciones:

* sin diagnósticos
* sin tratamientos
* sin dosis
* sin frases de certeza absoluta

## Fallback Strategy

Si GPT falla, devuelve texto inválido o incumple validaciones:

* no se rompe el flujo
* se usa copy templated por prioridad
* se registra el fallo para observabilidad

## Output Safety Layer

Antes de mostrar el mensaje al usuario:

1. validar schema
2. validar longitud
3. bloquear términos prohibidos
4. si falla, usar fallback templated

Ejemplos de términos o patrones a bloquear:

* `tiene`
* `padece`
* `diagnóstico`
* `dale`
* `administra`
* `dosis`
* `no te preocupes`
* `seguro no es grave`

## Backend Placement

Cuando se implemente backend para el feature, allí deberían vivir:

* prompts
* JSON schemas
* plantillas fallback
* adapters por proveedor
* telemetría del gateway

La app mobile debería consumir solo el resultado ya controlado.

## MVP Recommendation

Secuencia recomendada:

1. construir flujo guiado sin IA
2. construir motor determinístico
3. guardar evaluación
4. agregar GPT solo para redacción final
5. dejar interfaz abierta para múltiples proveedores
