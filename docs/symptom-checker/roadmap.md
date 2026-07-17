# Symptom Checker Roadmap

## Goal

Definir una hoja de ruta gradual para convertir `Symptom Checker` en un motor importante de PetCareNow sin comprometer seguridad, velocidad de entrega ni capacidad de evolución.

## Product Positioning

`Symptom Checker` debe evolucionar como un motor de orientación de prioridad de atención, no como un sistema de diagnóstico.

Su rol estratégico en la app es:

* aumentar utilidad clínica percibida
* activar el módulo de veterinarias
* mejorar retención y confianza
* producir historial estructurado valioso
* abrir una futura capa de IA segura y orquestable

## Phase 0 — Validation

### Goal

Cerrar reglas base y validar el enfoque clínico-producto.

### Deliverables

* HU del feature
* matriz de triage
* catálogo de preguntas
* catálogo de reglas
* revisión veterinaria inicial

### Exit Criteria

* síntomas MVP cerrados
* prioridades cerradas
* banderas rojas aprobadas
* acciones prohibidas aprobadas

## Phase 1 — Deterministic MVP

### Goal

Lanzar un primer flujo guiado sin IA.

### Scope

* intro y límites
* selección de mascota
* selección de síntoma
* preguntas guiadas
* motor determinístico
* resultado por prioridad
* CTA a veterinarias

### Technical Notes

* sin chat libre
* sin interpretación de texto libre
* copy templated
* sin backend complejo de IA

### Exit Criteria

* flujo usable end-to-end
* reglas críticas testeadas
* navegación estable

## Phase 2 — Persistence and History

### Goal

Guardar evaluaciones y permitir revisión posterior.

### Scope

* tablas mínimas
* guardar assessment
* guardar answers
* guardar result
* historial básico del usuario

### Exit Criteria

* evaluación persistida correctamente
* resumen accesible desde historial
* observabilidad mínima del feature

## Phase 3 — GPT Controlled Messaging

### Goal

Usar GPT para mejorar la redacción del resultado sin tocar la decisión clínica.

### Scope

* gateway de IA
* proveedor OpenAI
* structured outputs
* fallback templated
* output safety filter

### Exit Criteria

* GPT solo redacta
* el dominio no depende de OpenAI
* falla segura con fallback

## Phase 4 — Text Intake Assistance

### Goal

Permitir que el usuario describa síntomas con texto libre, pero sin abrir chat conversacional.

### Scope

* input libre opcional
* extracción limitada de síntoma principal
* confirmación por el usuario
* sin generación libre de preguntas

### Exit Criteria

* extracción acotada y segura
* el usuario siempre confirma
* no se degrada el control del flujo

## Phase 5 — Follow-Up

### Goal

Agregar seguimiento posterior simple.

### Scope

* seguimiento a 12-24 horas según prioridad
* respuestas: mejoró / sigue igual / empeoró / fue al veterinario
* CTA de reevaluación

### Exit Criteria

* follow-up funcionando
* reingreso al flujo sin fricción

## Phase 6 — Multi-Provider AI

### Goal

Desacoplar completamente la capa generativa del proveedor actual.

### Scope

* adapter por proveedor
* config por ambiente
* evaluación comparativa de tono/costo/latencia
* fallback multi-proveedor si hiciera falta

### Exit Criteria

* cambio de proveedor sin tocar el dominio
* observabilidad por proveedor
* políticas de seguridad homogéneas

## Cross-Cutting Work

Durante todas las fases:

* validación veterinaria continua
* tests de reglas
* tests de stop flow
* revisión de copy
* revisión de métricas

## Suggested Metrics

* evaluaciones iniciadas
* evaluaciones completadas
* abandono por paso
* porcentaje por prioridad
* clics a veterinarias
* reingresos por empeoramiento
* fallbacks del gateway de IA
* casos revisados por veterinario

## Risks

### Clinical Risk

* falsos negativos
* copy que suena a diagnóstico
* reglas demasiado permisivas

### Product Risk

* flujo demasiado largo
* abandono alto
* exceso de fricción antes de urgencias

### Technical Risk

* acoplar el dominio a un proveedor
* usar IA demasiado pronto para decidir
* mezclar prompts con lógica de negocio

## Recommendation

La fase que sigue ahora mismo es:

* **Phase 1 — Deterministic MVP**

No conviene empezar por IA.

Conviene empezar por:

* flujo
* reglas
* preguntas
* resultados
* CTA a veterinarias
